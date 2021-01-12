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

export enum OptionArgumentSeparator {
  None = '',
  Space = ' ',
  Equals = '=',
}

export interface OptionConfig {
  option: string;
  seperator?: OptionArgumentSeparator;
}

export interface CommandWithOptions {
  command: string;
  options?: OptionConfig[];
}

export interface CommandConfig extends CommandWithOptions {
  subCommand?: CommandWithOptions;
}

export class Command {
  private static reduceOptions(options: OptionConfig[] = []): OptionsRecord {
    return options.reduce((opts, config) => {
      opts[config.option] = optionFactory(config);
      return opts;
    }, {});
  }

  private static addOption(
    src: OptionsRecord,
    dst: Option[],
    opt: string,
    arg?: string,
    sub?: boolean
  ): void {
    const optFn = src[opt];

    if (!optFn) {
      throw new Error(`${sub ? 'Subcommand' : ''} Option: '${opt}' not found.`);
    }

    dst.push(optFn.bind(Command, arg));
  }

  private static optionsToArray(options: Option[]): string[] {
    return options.reduce((opts, opt) => opts.concat(opt()), []);
  }

  private readonly command = this.config.command;

  private readonly options = Command.reduceOptions(this.config.options);

  private readonly subCommand = this.config.subCommand?.command;

  private readonly subOptions = Command.reduceOptions(
    this.config.subCommand.options
  );

  private readonly cache = new CommandCache();

  private currentOptions: Option[] = [];

  private currentSubOptions: Option[] = [];

  private currentParameters: string[] = [];

  public constructor(private readonly config: CommandConfig) {}

  public option(opt: string, arg?: string): this {
    Command.addOption(this.options, this.currentOptions, opt, arg);
    this.cache.clear();
    return this;
  }

  public subOption(opt: string, arg?: string): this {
    Command.addOption(this.subOptions, this.currentSubOptions, opt, arg, true);
    this.cache.clear();
    return this;
  }

  public parameter(param: string): this {
    const sanitized = param.trim();

    if (sanitized) {
      this.currentParameters.push(param);
      this.cache.clear();
    }

    return this;
  }

  public reset(): this {
    this.currentOptions = [];
    this.currentSubOptions = [];
    this.currentParameters = [];
    this.cache.clear();
    return this;
  }

  public spawn(options: SpawnOptions): CommandProcess {
    const [command, ...args] = this.toArray();
    return new CommandProcess(spawn(command, args, options));
  }

  public spawnSync(options: SpawnSyncOptions): CommandProcessSnapshot {
    const [command, ...args] = this.toArray();
    return new CommandProcessSnapshot(spawnSync(command, args, options));
  }

  public toArray(): string[] {
    const cache = this.cache;

    if (cache.array) {
      return [...cache.array];
    }

    const arr = (cache.array = [this.command].concat(
      Command.optionsToArray(this.currentOptions),
      this.subCommand ? [this.subCommand] : [],
      Command.optionsToArray(this.currentSubOptions),
      this.currentParameters
    ));

    return [...arr];
  }

  public toString(): string {
    const cache = this.cache;

    if (cache.string) {
      return cache.string;
    }

    const str = (cache.string = this.toArray().join(' '));

    return str;
  }
}

export class CommandProcess {
  public static readonly maxCacheBuffer = 1024 * 10000;

  private readonly codeSubject$ = new BehaviorSubject<number>(undefined);

  private readonly signalSubject$ = new BehaviorSubject<NodeJS.Signals>(
    undefined
  );

  private readonly errorSubject$ = new BehaviorSubject<Error>(undefined);

  private readonly snapshotSubject$ = new BehaviorSubject<
    CommandProcessSnapshot
  >(undefined);

  public readonly stdout$ = new Observable<Buffer | string>((observer) => {
    this.childProcess.stdout
      .on('data', (chunk) => observer.next(chunk))
      .on('close', () => observer.complete())
      .on('error', (error) => observer.error(error));
  });

  public readonly stderr$ = new Observable<Buffer | string>((observer) => {
    this.childProcess.stderr
      .on('data', (chunk) => observer.next(chunk))
      .on('close', () => observer.complete())
      .on('error', (error) => observer.error(error));
  });

  private readonly cache = new CommandProcessCache();

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

  public get code$(): Observable<number> {
    return this.codeSubject$;
  }

  public get code(): number {
    return this.codeSubject$.value;
  }

  public get signal$(): Observable<NodeJS.Signals> {
    return this.signalSubject$;
  }

  public get signal(): NodeJS.Signals {
    return this.signalSubject$.value;
  }

  public get error$(): Observable<Error> {
    return this.errorSubject$;
  }

  public get error(): Error {
    return this.errorSubject$.value;
  }

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

export class CommandProcessSnapshot
  implements SpawnSyncReturns<Buffer | string> {
  public static sanitzeString(str: string): string[] {
    return str
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  private readonly cache = new CommandProcessSnapshotCache();

  public constructor(
    private readonly spawnSyncReturns: SpawnSyncReturns<Buffer | string>
  ) {}

  public get pid(): number {
    return this.spawnSyncReturns.pid;
  }

  public get output(): string[] {
    return this.spawnSyncReturns.output;
  }

  public get stdout(): Buffer | string {
    return this.spawnSyncReturns.stdout;
  }

  public get stderr(): Buffer | string {
    return this.spawnSyncReturns.stderr;
  }

  public get status(): number {
    return this.spawnSyncReturns.status;
  }

  public get signal(): NodeJS.Signals {
    return this.spawnSyncReturns.signal;
  }

  public get error(): Error {
    return this.spawnSyncReturns.error;
  }

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

////////////////////////////////////////////////////////////////////////////////
// Internal API
////////////////////////////////////////////////////////////////////////////////

type Option = (arg?: string) => string[];

type OptionsRecord = Record<string, Option>;

function optionFactory(config: OptionConfig): Option {
  const { option: opt } = config;

  let { seperator } = config;

  seperator = seperator || OptionArgumentSeparator.None;

  return function option(arg?: string): string[] {
    arg = arg ? arg.trim() : '';

    return arg
      ? seperator === OptionArgumentSeparator.Space
        ? [opt, arg]
        : [`${opt}${seperator}${arg}`]
      : [opt];
  };
}

class CommandCache {
  public array: string[];
  public string: string;

  public clear(): void {
    this.array = undefined;
    this.string = undefined;
  }
}

class CommandProcessCache {
  private static readonly maxBufferSize = maxBufferSize;

  public readonly stdio: string[] = [];
  public readonly stdout = Buffer.alloc(CommandProcessCache.maxBufferSize);
  public readonly stderr = Buffer.alloc(CommandProcessCache.maxBufferSize);
}

class CommandProcessSnapshotCache {
  public sanitizedOutput: string[];
  public sanitizedStdout: string[];
  public sanitizedStderr: string[];
}
