/**
 * Command library.
 * @copyright Copyright © 2021, AgogPixel - All rights reserved.
 * @author Tristan Bonsor <kidthales@agogpixel.com>
 * @packageDocumentation
 * @module workspace/command
 */
import {
  ChildProcess,
  spawn,
  SpawnOptions,
  spawnSync,
  SpawnSyncOptions,
  SpawnSyncReturns,
} from 'child_process';
import { BehaviorSubject, Observable } from 'rxjs';

import { maxBufferSize } from './shared';

/**
 *
 */
export enum OptionArgumentSeparator {
  None = '',
  Space = ' ',
  Equals = '=',
}

/**
 *
 */
export enum OptionArgumentRequirement {
  None,
  Optional,
  Required,
}

/**
 *
 */
export enum OptionOccurrence {
  Single,
  Multiple,
}

/**
 *
 */
interface OptionConfig {
  /**
   *
   */
  option: string;

  /**
   *
   */
  occurrence?: OptionOccurrence;

  /**
   *
   */
  seperator?: OptionArgumentSeparator;

  /**
   *
   */
  argRequirement?: OptionArgumentRequirement;
}

/**
 *
 */
type OptionConfigRecord = Record<string, OptionConfig>;

/**
 *
 */
type Option = (arg?: string) => string[];

/**
 *
 */
type OptionAccessor<
  A extends OptionConfigRecord,
  B extends OptionConfigRecord,
  C extends OptionConfigRecord,
  O = (arg?: string) => Command<A, B, C>
> = {
  [p in keyof (A & B & C)]: O;
};

/**
 *
 */
interface CommandConfig<T extends OptionConfigRecord> {
  /**
   *
   */
  command: string;

  /**
   *
   */
  options?: T;
}

/**
 *
 */
class CommandCache {
  /**
   *
   */
  public array: string[];

  /**
   *
   */
  public string: string;

  /**
   *
   */
  public clear(): void {
    this.array = undefined;
    this.string = undefined;
  }
}

/**
 *
 */
export class Command<
  A extends OptionConfigRecord,
  B extends OptionConfigRecord = {},
  C extends OptionConfigRecord = {}
> {
  /**
   *
   * @param command
   * @param configA
   * @param configB
   * @param configC
   */
  private static optionAccessorFactory<
    A extends OptionConfigRecord,
    B extends OptionConfigRecord,
    C extends OptionConfigRecord
  >(
    command: Command<A, B, C>,
    configA: CommandConfig<A>,
    configB: CommandConfig<B>,
    configC: CommandConfig<C>
  ): OptionAccessor<A, B, C> {
    const accessor: Record<string, (arg?: string) => Command<A, B, C>> = {};

    Command.bindOptionAccessor(
      accessor,
      command,
      configA.command,
      configA.options
    );

    if (configB) {
      Command.bindOptionAccessor(
        accessor,
        command,
        configB.command,
        configB.options || ({} as B)
      );
    }

    if (configC) {
      Command.bindOptionAccessor(
        accessor,
        command,
        configC.command,
        configC.options || ({} as C)
      );
    }

    return accessor as OptionAccessor<A, B, C>;
  }

  /**
   *
   * @param accessor
   * @param command
   * @param commandName
   * @param config
   */
  private static bindOptionAccessor<
    A extends OptionConfigRecord,
    B extends OptionConfigRecord,
    C extends OptionConfigRecord
  >(
    accessor: Record<string, (arg?: string) => Command<A, B, C>>,
    command: Command<A, B, C>,
    commandName: string,
    config: A | B | C
  ): void {
    command.currentOptions[commandName] = [];

    Object.entries(config).forEach(([name, conf]) => {
      const option = Command.optionFactory(conf);

      accessor[name] = (arg?: string) => {
        command.currentOptions[commandName].push(option.bind(arg));
        command.cache.clear();
        return command;
      };
    });
  }

  /**
   *
   * @param config
   */
  private static optionFactory(config: OptionConfig): Option {
    const { option: opt } = config;

    let { occurrence, seperator, argRequirement } = config;

    occurrence = occurrence || OptionOccurrence.Single;
    seperator = seperator || OptionArgumentSeparator.None;
    argRequirement = argRequirement || OptionArgumentRequirement.None;

    let counter = 0;

    return function option(arg?: string): string[] {
      if (counter++ && occurrence === OptionOccurrence.Single) {
        throw new Error();
      } else if (
        arg === undefined &&
        argRequirement === OptionArgumentRequirement.Required
      ) {
        throw new Error();
      } else if (
        arg !== undefined &&
        argRequirement === OptionArgumentRequirement.None
      ) {
        throw new Error();
      }

      arg = arg ? arg.trim() : '';

      return arg
        ? seperator === OptionArgumentSeparator.Space
          ? [opt, arg]
          : [`${opt}${seperator}${arg}`]
        : [opt];
    };
  }

  /**
   *
   */
  public readonly option: OptionAccessor<
    A,
    B,
    C
  > = Command.optionAccessorFactory(
    this,
    this.configA,
    this.configB,
    this.configC
  );

  /**
   *
   */
  private readonly cache = new CommandCache();

  /**
   *
   */
  private readonly commands: string[] = [];

  /**
   *
   */
  private readonly currentOptions: Record<string, Option[]> = {};

  /**
   *
   */
  private readonly currentCommandParameters: Record<string, string[]> = {};

  /**
   *
   */
  private currentParameters: string[] = [];

  /**
   *
   * @param configA
   * @param configB
   * @param configC
   */
  public constructor(
    private readonly configA: CommandConfig<A>,
    private readonly configB?: CommandConfig<B>,
    private readonly configC?: CommandConfig<C>
  ) {
    this.commands.push(
      configA.command,
      configB?.command || '',
      configC?.command || ''
    );
  }

  /**
   *
   */
  public reset(): this {
    Object.keys(this.currentOptions).forEach(
      (key) => (this.currentOptions[key] = [])
    );
    Object.keys(this.currentCommandParameters).forEach(
      (key) => (this.currentCommandParameters[key] = [])
    );

    this.currentParameters = [];
    this.cache.clear();

    return this;
  }

  /**
   *
   * @param param
   * @param command
   */
  public parameter(param: string, command?: string): this {
    const sanitized = param.trim();

    if (sanitized) {
      if (command === undefined || !this.commands.includes(command)) {
        this.currentParameters.push(param);
      } else {
        if (!this.currentCommandParameters[command]) {
          this.currentCommandParameters[command] = [];
        }

        this.currentCommandParameters[command].push(param);
      }

      this.cache.clear();
    }

    return this;
  }

  /**
   *
   * @param options
   */
  public spawn(options: SpawnOptions): CommandProcess {
    const [command, ...args] = this.toArray();
    return new CommandProcess(spawn(command, args, options));
  }

  /**
   *
   * @param options
   */
  public spawnSync(options: SpawnSyncOptions): CommandProcessSnapshot {
    const [command, ...args] = this.toArray();
    return new CommandProcessSnapshot(spawnSync(command, args, options));
  }

  /**
   *
   */
  public toArray(): string[] {
    const cache = this.cache;

    if (cache.array) {
      return [...cache.array];
    }

    const arr: string[] = [];

    this.commands.forEach((commandName) => {
      arr.push(commandName);

      if (this.currentOptions[commandName]) {
        this.currentOptions[commandName].forEach((opt) => {
          arr.push(...opt());
        });
      }

      if (this.currentCommandParameters[commandName]) {
        this.currentCommandParameters[commandName].forEach((param) => {
          arr.push(param);
        });
      }
    });

    arr.push(...this.currentParameters);

    return [...arr];
  }

  /**
   *
   */
  public toString(): string {
    const cache = this.cache;

    if (cache.string) {
      return cache.string;
    }

    const str = (cache.string = this.toArray().join(' '));

    return str;
  }
}

/**
 *
 */
class CommandProcessCache {
  /**
   *
   */
  public readonly stdio: string[] = [];

  /**
   *
   */
  public readonly stdout = Buffer.alloc(maxBufferSize);

  /**
   *
   */
  public readonly stderr = Buffer.alloc(maxBufferSize);
}

/**
 *
 */
export class CommandProcess {
  /**
   *
   */
  private readonly codeSubject$ = new BehaviorSubject<number>(undefined);

  /**
   *
   */
  private readonly signalSubject$ = new BehaviorSubject<NodeJS.Signals>(
    undefined
  );

  /**
   *
   */
  private readonly errorSubject$ = new BehaviorSubject<Error>(undefined);

  /**
   *
   */
  private readonly snapshotSubject$ = new BehaviorSubject<
    CommandProcessSnapshot
  >(undefined);

  /**
   *
   */
  public readonly stdout$ = new Observable<Buffer | string>((observer) => {
    this.childProcess.stdout
      .on('data', (chunk) => observer.next(chunk))
      .on('close', () => observer.complete())
      .on('error', (error) => observer.error(error));
  });

  /**
   *
   */
  public readonly stderr$ = new Observable<Buffer | string>((observer) => {
    this.childProcess.stderr
      .on('data', (chunk) => observer.next(chunk))
      .on('close', () => observer.complete())
      .on('error', (error) => observer.error(error));
  });

  /**
   *
   */
  private readonly cache = new CommandProcessCache();

  /**
   *
   * @param childProcess
   */
  public constructor(public readonly childProcess: ChildProcess) {
    childProcess.stdout.on('data', (chunk) => {
      const cache = this.cache;
      cache.stdio.push(chunk);
      cache.stdout.write(chunk);
    });

    childProcess.stderr.on('data', (chunk) => {
      const cache = this.cache;
      cache.stdio.push(chunk);
      cache.stderr.write(chunk);
    });

    childProcess
      .on('exit', (code, signal) => {
        this.codeSubject$.next(code);
        this.signalSubject$.next(signal);
        this.snapshotSubject$.next(this.createSnapshot(code, signal));
      })
      .on('error', (error) => {
        this.errorSubject$.next(error);
        this.snapshotSubject$.next(this.createSnapshot(null, null, error));
      });
  }

  /**
   *
   */
  public get code$(): Observable<number> {
    return this.codeSubject$;
  }

  /**
   *
   */
  public get code(): number {
    return this.codeSubject$.value;
  }

  /**
   *
   */
  public get signal$(): Observable<NodeJS.Signals> {
    return this.signalSubject$;
  }

  /**
   *
   */
  public get signal(): NodeJS.Signals {
    return this.signalSubject$.value;
  }

  /**
   *
   */
  public get error$(): Observable<Error> {
    return this.errorSubject$;
  }

  /**
   *
   */
  public get error(): Error {
    return this.errorSubject$.value;
  }

  /**
   *
   */
  public get snapshot$(): Observable<CommandProcessSnapshot> {
    return this.snapshotSubject$;
  }

  /**
   *
   */
  public get snapshot(): CommandProcessSnapshot {
    return this.snapshotSubject$.value;
  }

  /**
   *
   * @param status
   * @param signal
   * @param error
   */
  private createSnapshot(
    status: number | null,
    signal: NodeJS.Signals | null,
    error?: Error
  ): CommandProcessSnapshot {
    const cache = this.cache;

    return new CommandProcessSnapshot({
      pid: this.childProcess.pid,
      output: [...cache.stdio],
      stdout: cache.stdout,
      stderr: cache.stderr,
      status,
      signal,
      error,
    });
  }
}

/**
 *
 */
class CommandProcessSnapshotCache {
  /**
   *
   */
  public sanitizedOutput: string[];

  /**
   *
   */
  public sanitizedStdout: string[];

  /**
   *
   */
  public sanitizedStderr: string[];
}

/**
 *
 */
export class CommandProcessSnapshot
  implements SpawnSyncReturns<Buffer | string> {
  /**
   *
   * @param str
   */
  public static sanitzeString(str: string): string[] {
    return str
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  /**
   *
   */
  private readonly cache = new CommandProcessSnapshotCache();

  /**
   *
   * @param spawnSyncReturns
   */
  public constructor(
    private readonly spawnSyncReturns: SpawnSyncReturns<Buffer | string>
  ) {}

  /**
   *
   */
  public get pid(): number {
    return this.spawnSyncReturns.pid;
  }

  /**
   *
   */
  public get output(): string[] {
    return this.spawnSyncReturns.output;
  }

  /**
   *
   */
  public get stdout(): Buffer | string {
    return this.spawnSyncReturns.stdout;
  }

  /**
   *
   */
  public get stderr(): Buffer | string {
    return this.spawnSyncReturns.stderr;
  }

  /**
   *
   */
  public get status(): number {
    return this.spawnSyncReturns.status;
  }

  /**
   *
   */
  public get signal(): NodeJS.Signals {
    return this.spawnSyncReturns.signal;
  }

  /**
   *
   */
  public get error(): Error {
    return this.spawnSyncReturns.error;
  }

  /**
   *
   */
  public get sanitizedOutput(): string[] {
    const cache = this.cache;

    if (cache.sanitizedOutput) {
      return [...cache.sanitizedOutput];
    }

    const out = (cache.sanitizedOutput = this.output.reduce(
      (cache, value) =>
        cache.concat(CommandProcessSnapshot.sanitzeString(value)),
      [] as string[]
    ));

    return [...out];
  }

  /**
   *
   */
  public get sanitizedStdout(): string[] {
    const cache = this.cache;

    if (cache.sanitizedStdout) {
      return [...cache.sanitizedStdout];
    }

    const out = (cache.sanitizedStdout = CommandProcessSnapshot.sanitzeString(
      this.stdout.toString('utf-8')
    ));

    return [...out];
  }

  /**
   *
   */
  public get sanitizedStderr(): string[] {
    const cache = this.cache;

    if (cache.sanitizedStderr) {
      return [...cache.sanitizedStderr];
    }

    const out = (cache.sanitizedStderr = CommandProcessSnapshot.sanitzeString(
      this.stderr.toString('utf-8')
    ));

    return [...out];
  }
}
