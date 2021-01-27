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
 * Option argument seperator enumeration.
 */
export enum OptionArgumentSeparator {
  None = '',
  Space = ' ',
  Equals = '=',
}

/**
 * Option argument requirement enumeration.
 */
export enum OptionArgumentRequirement {
  None,
  Optional,
  Required,
}

/**
 * Option occurance enumeration.
 */
export enum OptionOccurrence {
  Single,
  Multiple,
}

/**
 * Option configuration.
 * @internal
 */
interface OptionConfig {
  /**
   * Option flag as used on cli.
   */
  option: string;

  /**
   * Allow single or multiple occurrences of option.
   */
  occurrence?: OptionOccurrence;

  /**
   * Seperator between option flag & argument (none, space, or equals sign).
   */
  seperator?: OptionArgumentSeparator;

  /**
   * Indicate if option requires an argument (none, optional, or required).
   */
  argRequirement?: OptionArgumentRequirement;
}

/**
 * Option methods.
 * @internal
 */
interface OptionMethods {
  /**
   * Validate specified argument for option against option configuration.
   * @param arg Option argument.
   */
  validate: (arg?: string) => void;

  /**
   * Transform specified argument into option flag with argument.
   * @param arg Option argument.
   * @returns Transformed option flag with argument as string arry.
   */
  transform: (arg?: string) => string[];

  /**
   * Increment option occurrence counter.
   * @returns Current occurrence count.
   */
  increment: () => number;
}

/**
 * Option accessor.
 * @typeParam T Object mapping option names to option configurations.
 * @typeParam U Command builder.
 * @internal
 */
type OptionAccessor<T, U> = {
  /**
   * Invoke combined option methods with specified option argument.
   * @param arg Option argument.
   * @returns Command builder.
   */
  [k in keyof T]: (arg?: string) => U;
};

/**
 * Command accessor.
 * @typeParam T Object mapping option names to option configurations.
 * @typeParam U Command builder.
 * @internal
 */
type CommandAccessor<T, U> = {
  /**
   * Command as used on cli.
   */
  command: string;

  /**
   * Option accessor for this command.
   */
  option: OptionAccessor<T, U>;
};

/**
 * Option factory.
 * @param config Option configuration.
 * @returns Option methods.
 * @internal
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
     * Validate specified argument for option against option configuration.
     * @param arg Option argument.
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
     * Transform specified argument into option flag with argument.
     * @param arg Option argument.
     * @returns Transformed option flag with argument as string arry.
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
     * Increment option occurrence counter.
     * @returns Current occurrence count.
     */
    increment: () => ++counter,
  };
}

/**
 * Command builder cache.
 * @internal
 */
class CommandBuilderCache {
  /**
   * Array cache.
   */
  public array: string[];

  /**
   * String cache.
   */
  public string: string;

  /**
   * Clear cache.
   */
  public clear(): void {
    this.array = undefined;
    this.string = undefined;
  }
}

/**
 * Command builder.
 * @internal
 */
export abstract class CommandBuilder {
  /**
   * Command accessor factory.
   * @typeParam T Object mapping option names to option configurations.
   * @typeParam U Command builder.
   * @param command Command as used on cli.
   * @param commandName Command name.
   * @param options Object mapping option names to option configurations.
   * @param builder Command builder.
   * @returns Command accessor instance.
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
   * Option accessor factory.
   * @typeParam T Object mapping option names to option configurations.
   * @typeParam U Command builder.
   * @param commandName Command name.
   * @param options Object mapping option names to option configurations.
   * @param builder Command builder.
   * @returns Option accessor instance.
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
   * Object mapping command names to their corresponding command accessors.
   */
  public abstract readonly command: Record<
    string,
    CommandAccessor<{}, CommandBuilder>
  >;

  /**
   * Default option accessor.
   */
  public abstract readonly option: OptionAccessor<{}, CommandBuilder>;

  /**
   * Track order of command names.
   */
  protected abstract readonly commandIndex: string[];

  /**
   * Track order of specified options.
   */
  private readonly currentOptions: Record<string, string[]> = {};

  /**
   *Track order of specified parameters.
   */
  private readonly currentParameters: string[] = [];

  /**
   * Command builder cache.
   */
  private readonly cache = new CommandBuilderCache();

  /**
   * Reset the command builder.
   * @returns Command builder instance to facilitate method chaining.
   */
  public reset(): this {
    Object.values(this.currentOptions).forEach((q) => (q.length = 0));

    this.currentParameters.length = 0;
    this.cache.clear();

    return this;
  }

  /**
   * Set command parameter(s).
   * @param params Command parameter(s).
   * @returns Command builder instance to facilitate method chaining.
   */
  public parameter(...params: string[]): this {
    const sanitized = params.map((p) => p.trim()).filter(Boolean);

    if (sanitized.length) {
      this.currentParameters.concat(sanitized);
      this.cache.clear();
    }

    return this;
  }

  /**
   * Spawn command (with currently set options & parameters) as an asynchronous
   * process.
   * @param options Spawn options. {@link https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options}
   * @returns Command process instance.
   * @see CommandProcess {@link CommandProcess}
   */
  public spawn(options: SpawnOptions): CommandProcess {
    const [command, ...args] = this.toArray();
    return new CommandProcess(spawn(command, args, options));
  }

  /**
   * Spawn command (with currently set options & parameters) as a synchronous
   * process.
   * @param options Spawn sync options. {@link https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options}
   * @returns Command process snapshot instance.
   * @see CommandProcessSnapshot {@link CommandProcessSnapshot}
   */
  public spawnSync(options: SpawnSyncOptions): CommandProcessSnapshot {
    const [command, ...args] = this.toArray();
    return new CommandProcessSnapshot(spawnSync(command, args, options));
  }

  /**
   * Get command invocation as array.
   * @returns Command invocation as array of strings.
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
   * Get command invocation as string.
   * @returns Command invocation as string.
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
 * Command process cache.
 * @internal
 */
class CommandProcessCache {
  /**
   * Caches stdio with array of strings.
   */
  public readonly stdio: string[] = [];

  /**
   * Cache stdout with buffer.
   */
  public readonly stdout = Buffer.alloc(maxBufferSize);

  /**
   * Cache stderr with buffer.
   */
  public readonly stderr = Buffer.alloc(maxBufferSize);
}

/**
 * Command process.
 */
export class CommandProcess {
  /**
   * Status code subject.
   */
  private readonly codeSubject$ = new BehaviorSubject<number>(undefined);

  /**
   * Process signal subject.
   */
  private readonly signalSubject$ = new BehaviorSubject<NodeJS.Signals>(
    undefined
  );

  /**
   * Error subject.
   */
  private readonly errorSubject$ = new BehaviorSubject<Error>(undefined);

  /**
   * Command process snapshot subject.
   */
  private readonly snapshotSubject$ = new BehaviorSubject<
    CommandProcessSnapshot
  >(undefined);

  /**
   * Stdout state stream.
   */
  public readonly stdout$ = new Observable<Buffer | string>((observer) => {
    this.childProcess.stdout
      .on('data', (chunk) => observer.next(chunk))
      .on('close', () => observer.complete())
      .on('error', (error) => observer.error(error));
  });

  /**
   * Stderr state stream.
   */
  public readonly stderr$ = new Observable<Buffer | string>((observer) => {
    this.childProcess.stderr
      .on('data', (chunk) => observer.next(chunk))
      .on('close', () => observer.complete())
      .on('error', (error) => observer.error(error));
  });

  /**
   * Command process cache.
   */
  private readonly cache = new CommandProcessCache();

  /**
   * Instantiate command process.
   * @param childProcess Child process.
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
   * Status code state stream.
   */
  public get code$(): Observable<number> {
    return this.codeSubject$;
  }

  /**
   * Status code.
   */
  public get code(): number {
    return this.codeSubject$.value;
  }

  /**
   * Process signal state stream.
   */
  public get signal$(): Observable<NodeJS.Signals> {
    return this.signalSubject$;
  }

  /**
   * Process signal.
   */
  public get signal(): NodeJS.Signals {
    return this.signalSubject$.value;
  }

  /**
   * Error state stream.
   */
  public get error$(): Observable<Error> {
    return this.errorSubject$;
  }

  /**
   * Error.
   */
  public get error(): Error {
    return this.errorSubject$.value;
  }

  /**
   * Command process snapshot state stream.
   */
  public get snapshot$(): Observable<CommandProcessSnapshot> {
    return this.snapshotSubject$;
  }

  /**
   * Command process snapshot.
   */
  public get snapshot(): CommandProcessSnapshot {
    return this.snapshotSubject$.value;
  }

  /**
   * Create command process snapshot.
   * @param status Status code.
   * @param signal Process signal.
   * @param error Error.
   * @returns Command process snapshot instance.
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
 * Command process snapshot cache.
 * @internal
 */
class CommandProcessSnapshotCache {
  /**
   * Sanitized output.
   */
  public sanitizedOutput: string[];

  /**
   * Sanitized stdout.
   */
  public sanitizedStdout: string[];

  /**
   * Sanitized stderr.
   */
  public sanitizedStderr: string[];
}

/**
 * Command process snapshot.
 */
export class CommandProcessSnapshot implements SpawnSyncReturns<Buffer | string> {
  /**
   * Sanitize string.
   * @param str String.
   * @returns Santizied string.
   */
  public static sanitzeString(str: string): string[] {
    return str
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  /**
   * Snapshot cache.
   */
  private readonly cache = new CommandProcessSnapshotCache();

  /**
   * Instantiate command process snapshot.
   * @param spawnSyncReturns Spawn sync return object.
   */
  public constructor(
    private readonly spawnSyncReturns: SpawnSyncReturns<Buffer | string>
  ) {}

  /**
   * Process ID.
   */
  public get pid(): number {
    return this.spawnSyncReturns.pid;
  }

  /**
   * Output.
   */
  public get output(): string[] {
    return this.spawnSyncReturns.output;
  }

  /**
   * Stdout.
   */
  public get stdout(): Buffer | string {
    return this.spawnSyncReturns.stdout;
  }

  /**
   * Stderr.
   */
  public get stderr(): Buffer | string {
    return this.spawnSyncReturns.stderr;
  }

  /**
   * Status code.
   */
  public get status(): number {
    return this.spawnSyncReturns.status;
  }

  /**
   * Process signal.
   */
  public get signal(): NodeJS.Signals {
    return this.spawnSyncReturns.signal;
  }

  /**
   * Error.
   */
  public get error(): Error {
    return this.spawnSyncReturns.error;
  }

  /**
   * Santized output.
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
   * Sanitized stdout.
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
   * Sanitized stderr.
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
