/**
 * Command builder library.
 * @copyright Copyright © 2021, AgogPixel - All rights reserved.
 * @author Tristan Bonsor <kidthales@agogpixel.com>
 * @packageDocumentation
 * @module workspace/command-builder
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
interface OptionMethods {
  /**
   *
   */
  validate: (arg?: string) => void;

  /**
   *
   */
  transform: (arg?: string) => string[];

  /**
   *
   */
  increment: () => number;
}

/**
 *
 */
type OptionAccessor<T, U> = {
  /**
   *
   */
  [k in keyof T]: (arg?: string) => U;
};

/**
 *
 */
type CommandAccessor<T, U> = {
  /**
   *
   */
  command: string;

  /**
   *
   */
  option: OptionAccessor<T, U>;
};

/**
 *
 * @param config
 */
function optionFactory(config: OptionConfig): OptionMethods {
  const { option: opt } = config;

  let { occurrence, seperator, argRequirement } = config;

  occurrence = occurrence || OptionOccurrence.Single;
  seperator = seperator || OptionArgumentSeparator.None;
  argRequirement = argRequirement || OptionArgumentRequirement.None;

  let counter = 0;

  return {
    /**
     *
     * @param arg
     */
    validate: (arg?: string) => {
      const missingArg =
        arg === undefined &&
        argRequirement === OptionArgumentRequirement.Required;
      const tooManyArgs =
        arg !== undefined && argRequirement === OptionArgumentRequirement.None;
      const duplicateOption = counter && occurrence === OptionOccurrence.Single;

      if (missingArg || tooManyArgs || duplicateOption) {
        const message = missingArg
          ? 'Argument missing'
          : tooManyArgs
          ? 'Too many arguments'
          : 'Option occurs more than once';

        throw new Error(message);
      }
    },

    /**
     *
     * @param arg
     */
    transform: (arg?: string) => {
      arg = arg ? arg.trim() : '';

      return arg
        ? seperator === OptionArgumentSeparator.Space
          ? [opt, arg]
          : [`${opt}${seperator}${arg}`]
        : [opt];
    },

    /**
     *
     */
    increment: () => ++counter,
  };
}

/**
 *
 */
class CommandBuilderCache {
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
export abstract class CommandBuilder {
  /**
   *
   * @param command
   * @param commandName
   * @param options
   * @param builder
   */
  protected static commandAccessorFactory<T, U>(
    command: string,
    commandName: string,
    options: { [k in keyof T]: OptionConfig },
    builder: U
  ): CommandAccessor<T, U> {
    return {
      command,
      option: CommandBuilder.optionAccessorFactory(
        commandName,
        options,
        builder
      ),
    };
  }

  /**
   *
   * @param commandName
   * @param options
   * @param builder
   */
  private static optionAccessorFactory<T, U>(
    commandName: string,
    options: { [k in keyof T]: OptionConfig },
    builder: U
  ): OptionAccessor<T, U> {
    const commandBuilder = (builder as unknown) as CommandBuilder;
    const accessor = {};

    // Create option queue for command name.
    commandBuilder.currentOptions[commandName] = [];

    Object.entries<OptionConfig>(options).forEach(
      ([optionName, optionConfig]) => {
        const { validate, transform, increment } = optionFactory(optionConfig);

        accessor[optionName] = (arg?: string) => {
          try {
            validate(arg);
          } catch (e) {
            throw new Error(
              `OptionAccessorError: ${optionName}: ${(e as Error).message}`
            );
          }

          const transformedOption = transform(arg);

          // Add option to queue for command name.
          commandBuilder.currentOptions[commandName].concat(transformedOption);

          // Clear cache.
          commandBuilder.cache.clear();

          increment();

          return builder;
        };
      }
    );

    return accessor as OptionAccessor<T, U>;
  }

  /**
   *
   */
  public abstract readonly command: Record<
    string,
    CommandAccessor<{}, CommandBuilder>
  >;

  /**
   *
   */
  public abstract readonly option: OptionAccessor<{}, CommandBuilder>;

  /**
   *
   */
  protected abstract readonly commandIndex: string[];

  /**
   *
   */
  private readonly currentOptions: Record<string, string[]> = {};

  /**
   *
   */
  private readonly currentParameters: string[] = [];

  /**
   *
   */
  private readonly cache = new CommandBuilderCache();

  /**
   *
   */
  public reset(): this {
    Object.values(this.currentOptions).forEach((q) => (q.length = 0));

    this.currentParameters.length = 0;
    this.cache.clear();

    return this;
  }

  /**
   *
   * @param param
   */
  public parameter(param: string): this {
    const sanitized = param.trim();

    if (sanitized) {
      this.currentParameters.push(sanitized);
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

    this.commandIndex.forEach((commandName) => {
      arr.push(this.command[commandName].command);

      if (this.currentOptions[commandName]) {
        arr.concat(this.currentOptions[commandName].filter(Boolean));
      }
    });

    arr.concat(this.currentParameters.filter(Boolean));

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
class CommandProcess {
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
class CommandProcessSnapshot implements SpawnSyncReturns<Buffer | string> {
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
