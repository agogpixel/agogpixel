/**
 * Git.
 * @copyright Copyright © 2021, AgogPixel - All rights reserved.
 * @author Tristan Bonsor <kidthales@agogpixel.com>
 * @packageDocumentation
 * @module workspace/git
 */
import {
  Command as BaseCommand,
  CommandWithOptions,
  OptionArgumentSeparator,
  OptionConfig,
} from './command';
import { maxBufferSize as maxBuffer } from './shared';

////////////////////////////////////////////////////////////////////////////////
// Utilities
////////////////////////////////////////////////////////////////////////////////

/**
 * Get git hash options.
 * @see {getHash} {@link getHash}
 * @category Utilities
 */
export interface GetHashOptions {
  /**
   * Get git hash only if repo is not dirty.
   * @defaultValue false
   * @see isRepoDirty {@link isRepoDirty}
   */
  cleanOnly?: boolean;

  /**
   * Output short git hash.
   * @defaultValue false
   */
  short?: boolean;
}

/**
 * Get git hash.
 * @param options Options.
 * @returns Git hash according to specified options.
 * @see GetHashOptions {@link GetHashOptions}
 * @see isRepoDirty {@link isRepoDirty}
 * @category Utilities
 */
export function getHash(options: GetHashOptions): string {
  const { cleanOnly, short } = options;

  if (cleanOnly && isRepoDirty()) {
    return undefined;
  }

  revParseCommand.reset();

  if (short) {
    revParseCommand.soptShort();
  }

  return revParseCommand
    .parameter('HEAD')
    .spawnSync({ maxBuffer })
    .sanitizedStdout.find((v) => v.match(/\b[0-9a-f]{5,40}\b/));
}

/**
 * Test if git repo is dirty. A repos is considered dirty if it has any
 * untracked, uncommitted, or staged files.
 * @returns True if git repo is dirty.
 * @see insideWorkTree {@link insideWorkTree}
 * @see hasRefs {@link hasRefs}
 * @see hasUntrackedFiles {@link hasUntrackedFiles}
 * @see hasUncommittedFiles {@link hasUncommittedFiles}
 * @see hasStagedFiles {@link hasStagedFiles}
 * @category Utilities
 */
export function isRepoDirty(): boolean {
  return (
    insideWorkTree() &&
    hasRefs() &&
    (hasUntrackedFiles() || hasUncommittedFiles() || hasStagedFiles())
  );
}

/**
 * Test if inside git work tree.
 * @returns True if inside git work tree.
 * @category Utilities
 */
export function insideWorkTree(): boolean {
  return revParseCommand
    .reset()
    .soptIsInsideWorkTree()
    .spawnSync({ maxBuffer })
    .sanitizedStdout.some((s) => s === 'true');
}

/**
 * Test if git refs exist.
 * @returns True if inside git refs exist.
 * @see getRefs {@link getRefs}
 * @category Utilities
 */
export function hasRefs(): boolean {
  return !!getRefs().length;
}

/**
 * Get git refs.
 * @returns Git refs as array of trimmed, non-empty strings.
 * @see hasRefs {@link hasRefs}
 * @category Utilities
 */
export function getRefs(): string[] {
  return showRefCommand.reset().spawnSync({ maxBuffer }).sanitizedStdout;
}

/**
 * Test if git has untracked files.
 * @returns True if git has untracked files.
 * @see getUntrackedFiles {@link getUntrackedFiles}
 * @category Utilities
 */
export function hasUntrackedFiles(): boolean {
  return !!getUntrackedFiles().length;
}

/**
 * Get untracked git files.
 * @returns Untracked git files as array of trimmed, non-empty strings.
 * @see hasUntrackedFiles {@link hasUntrackedFiles}
 * @category Utilities
 */
export function getUntrackedFiles(): string[] {
  return lsFilesCommand
    .reset()
    .subOption('--other')
    .subOption('--exclude-standard')
    .spawnSync({ maxBuffer }).sanitizedStdout;
}

/**
 * Test if git has uncommitted files.
 * @returns True if git as uncommitted files.
 * @see getUncommittedFiles {@link getUncommittedFiles}
 * @category Utilities
 */
export function hasUncommittedFiles(): boolean {
  return !!getUncommittedFiles().length;
}

/**
 * Get uncommitted git files.
 * @returns Uncommented git files as array of trimmed, non-empty strings.
 * @see hasUncommittedFiles {@link hasUncommittedFiles}
 * @category Utilities
 */
export function getUncommittedFiles(): string[] {
  return diffCommand
    .reset()
    .subOption('--name-only')
    .subOption('--relative')
    .parameter('HEAD')
    .spawnSync({ maxBuffer }).sanitizedStdout;
}

/**
 * Test if git has staged files.
 * @returns True if git has staged files.
 * @see getStagedFiles {@link getStagedFiles}
 * @category Utilities
 */
export function hasStagedFiles(): boolean {
  return !!getStagedFiles().length;
}

/**
 * Get staged git files.
 * @returns Staged git files as array of trimmed, non-empty strings.
 * @see hasStagedFiles {@link hasStagedFiles}
 * @category Utilities
 */
export function getStagedFiles(): string[] {
  return diffIndexCommand
    .reset()
    .subOption('--name-only')
    .subOption('--cached')
    .parameter('HEAD')
    .spawnSync({ maxBuffer }).sanitizedStdout;
}

/**
 * Test if git has changed files across commits.
 * @param base Base commit-ish.
 * @param head Head commit-ish.
 * @returns True if git has changed files across commits.
 * @see getChangedFiles {@link getChangedFiles}
 * @category Utilities
 */
export function hasChangedFiles(base: string, head: string): boolean {
  return !!getChangedFiles(base, head).length;
}

/**
 * Get changed files across git commits.
 * @param base Base commit-ish.
 * @param head Head commit-ish.
 * @returns Changed git files as array of trimmed, non-empty strings.
 * @see hasChangedFiles {@link hasChangedFiles}
 * @category Utilities
 */
export function getChangedFiles(base: string, head: string): string[] {
  const mergeBase = mergeBaseCommand
    .reset()
    .parameter(base)
    .parameter(head)
    .spawnSync({ maxBuffer })
    .stdout.toString('utf-8')
    .trim();

  return diffCommand
    .reset()
    .subOption('--name-only')
    .subOption('--relative')
    .parameter(mergeBase)
    .parameter(head)
    .spawnSync({ maxBuffer }).sanitizedStdout;
}

////////////////////////////////////////////////////////////////////////////////
// Commands
////////////////////////////////////////////////////////////////////////////////

/**
 * @internal
 */
type CommandOptionsConfig = Record<string, OptionConfig>;

/**
 * @see GitDocumentation {@link https://git-scm.com/docs/git}
 * @category Commands
 * @internal
 */
class GitCommand extends BaseCommand {
  /**
   * @internal
   */
  private static readonly gitCommandOptionsConfig: CommandOptionsConfig = {
    /**
     * @see version {@link https://git-scm.com/docs/git#Documentation/git.txt---version}
     */
    version: {
      option: '--version',
    },
    /**
     * @see help {@link https://git-scm.com/docs/git#Documentation/git.txt---help}
     */
    help: {
      option: '--help',
    },
    /**
     * @see cwd {@link https://git-scm.com/docs/git#Documentation/git.txt--Cltpathgt}
     */
    cwd: {
      option: '-C',
      seperator: OptionArgumentSeparator.Space,
    },
    /**
     * @see config {@link https://git-scm.com/docs/git#Documentation/git.txt--cltnamegtltvaluegt}
     */
    config: {
      option: '-c',
      seperator: OptionArgumentSeparator.Space,
    },
    /**
     * @see exec-path {@link https://git-scm.com/docs/git#Documentation/git.txt---exec-pathltpathgt}
     */
    execPath: {
      option: '--exec-path',
      seperator: OptionArgumentSeparator.Equals,
    },
    /**
     * @see html-path {@link https://git-scm.com/docs/git#Documentation/git.txt---html-path}
     */
    htmlPath: {
      option: '--html-path',
    },
    /**
     * @see man-path {@link https://git-scm.com/docs/git#Documentation/git.txt---man-path}
     */
    manPath: {
      option: '--man-path',
    },
    /**
     * @see info-path {@link https://git-scm.com/docs/git#Documentation/git.txt---info-path}
     */
    infoPath: {
      option: '--info-path',
    },
    /**
     * @see paginate {@link https://git-scm.com/docs/git#Documentation/git.txt---paginate}
     */
    paginate: {
      option: '--paginate',
    },
    /**
     * @see no-pager {@link https://git-scm.com/docs/git#Documentation/git.txt---no-pager}
     */
    noPager: {
      option: '--no-pager',
    },
    /**
     * @see git-dir {@link https://git-scm.com/docs/git#Documentation/git.txt---git-dirltpathgt}
     */
    gitDir: {
      option: '--git-dir',
      seperator: OptionArgumentSeparator.Equals,
    },
    /**
     * @see work-tree {@link https://git-scm.com/docs/git#Documentation/git.txt---work-treeltpathgt}
     */
    workTree: {
      option: '--work-tree',
      seperator: OptionArgumentSeparator.Equals,
    },
    /**
     * @see namespace {@link https://git-scm.com/docs/git#Documentation/git.txt---namespaceltpathgt}
     */
    namespace: {
      option: '--namespace',
      seperator: OptionArgumentSeparator.Equals,
    },
    /**
     * @see super-prefix {@link https://git-scm.com/docs/git#Documentation/git.txt---super-prefixltpathgt}
     */
    superPrefix: {
      option: '--super-prefix',
      seperator: OptionArgumentSeparator.Equals,
    },
    /**
     * @see bare {@link https://git-scm.com/docs/git#Documentation/git.txt---bare}
     */
    bare: {
      option: '--bare',
    },
    /**
     * @see no-replace-objects {@link https://git-scm.com/docs/git#Documentation/git.txt---no-replace-objects}
     */
    noReplaceObjects: {
      option: '--no-replace-objects',
    },
    /**
     * @see literal-pathspecs {@link https://git-scm.com/docs/git#Documentation/git.txt---literal-pathspecs}
     */
    literalPathspecs: {
      option: '--literal-pathspecs',
    },
    /**
     * @see glob-pathspecs {@link https://git-scm.com/docs/git#Documentation/git.txt---glob-pathspecs}
     */
    globPathspecs: {
      option: '--glob-pathspecs',
    },
    /**
     * @see noglob-pathspecs {@link https://git-scm.com/docs/git#Documentation/git.txt---noglob-pathspecs}
     */
    noglobPathspecs: {
      option: '--noglob-pathspecs',
    },
    /**
     * @see icase-pathspecs {@link https://git-scm.com/docs/git#Documentation/git.txt---icase-pathspecs}
     */
    icasePathspecs: {
      option: '--icase-pathspecs',
    },
    /**
     * @see no-optional-locks {@link https://git-scm.com/docs/git#Documentation/git.txt---no-optional-locks}
     */
    noOptionalLocks: {
      option: '--no-optional-locks',
    },
    /**
     * @see list-cmds {@link https://git-scm.com/docs/git#Documentation/git.txt---list-cmdsgroupgroup82308203}
     */
    listCmds: {
      option: '--list-cmds',
      seperator: OptionArgumentSeparator.Equals,
    },
  };

  /**
   * @param subCommand
   */
  public constructor(subCommand?: CommandWithOptions) {
    super({
      command: 'git',
      options: Object.values(GitCommand.gitCommandOptionsConfig),
      subCommand,
    });
  }

  /**
   * `--version`
   * @see version {@link https://git-scm.com/docs/git#Documentation/git.txt---version}
   */
  public optVersion(): this {
    return this.option(GitCommand.gitCommandOptionsConfig.version.option);
  }

  /**
   * `--help`
   * @see help {@link https://git-scm.com/docs/git#Documentation/git.txt---help}
   */
  public optHelp(): this {
    return this.option(GitCommand.gitCommandOptionsConfig.help.option);
  }

  /**
   * `-C <path>`
   * @param path
   * @see cwd {@link https://git-scm.com/docs/git#Documentation/git.txt--Cltpathgt}
   */
  public optCwd(path: string): this {
    return this.option(GitCommand.gitCommandOptionsConfig.cwd.option, path);
  }

  /**
   * `-c <name>=<value>`
   * @param param
   * @see config {@link https://git-scm.com/docs/git#Documentation/git.txt--cltnamegtltvaluegt}
   */
  public optConfig(param: string): this {
    return this.option(GitCommand.gitCommandOptionsConfig.config.option, param);
  }

  /**
   * `--exec-path[=<path>]`
   * @param path
   * @see exec-path {@link https://git-scm.com/docs/git#Documentation/git.txt---exec-pathltpathgt}
   */
  public optExecPath(path?: string): this {
    return this.option(
      GitCommand.gitCommandOptionsConfig.execPath.option,
      path
    );
  }

  /**
   * `--html-path`
   * @see html-path {@link https://git-scm.com/docs/git#Documentation/git.txt---html-path}
   */
  public optHtmlPath(): this {
    return this.option(GitCommand.gitCommandOptionsConfig.htmlPath.option);
  }

  /**
   * `--man-path`
   * @see man-path {@link https://git-scm.com/docs/git#Documentation/git.txt---man-path}
   */
  public optManPath(): this {
    return this.option(GitCommand.gitCommandOptionsConfig.manPath.option);
  }

  /**
   * `--info-path`
   * @see info-path {@link https://git-scm.com/docs/git#Documentation/git.txt---info-path}
   */
  public optInfoPath(): this {
    return this.option(GitCommand.gitCommandOptionsConfig.infoPath.option);
  }

  /**
   * `--paginate`
   * @see paginate {@link https://git-scm.com/docs/git#Documentation/git.txt---paginate}
   */
  public optPaginate(): this {
    return this.option(GitCommand.gitCommandOptionsConfig.paginate.option);
  }

  /**
   * `--no-pager`
   * @see no-pager {@link https://git-scm.com/docs/git#Documentation/git.txt---no-pager}
   */
  public optNoPager(): this {
    return this.option(GitCommand.gitCommandOptionsConfig.noPager.option);
  }

  /**
   * `--git-dir=<path>`
   * @param path
   * @see git-dir {@link https://git-scm.com/docs/git#Documentation/git.txt---git-dirltpathgt}
   */
  public optGitDir(path: string): this {
    return this.option(GitCommand.gitCommandOptionsConfig.gitDir.option, path);
  }

  /**
   * `--work-tree=<path>`
   * @param path
   * @see work-tree {@link https://git-scm.com/docs/git#Documentation/git.txt---work-treeltpathgt}
   */
  public optWorkTree(path: string): this {
    return this.option(
      GitCommand.gitCommandOptionsConfig.workTree.option,
      path
    );
  }

  /**
   * `--namespace=<path>`
   * @param path
   * @see namespace {@link https://git-scm.com/docs/git#Documentation/git.txt---namespaceltpathgt}
   */
  public optNamespace(path: string): this {
    return this.option(
      GitCommand.gitCommandOptionsConfig.namespace.option,
      path
    );
  }

  /**
   * `--super-prefix=<path>`
   * @param path
   * @see super-prefix {@link https://git-scm.com/docs/git#Documentation/git.txt---super-prefixltpathgt}
   */
  public optSuperPrefix(path: string): this {
    return this.option(
      GitCommand.gitCommandOptionsConfig.superPrefix.option,
      path
    );
  }

  /**
   * `--bare`
   * @see bare {@link https://git-scm.com/docs/git#Documentation/git.txt---bare}
   */
  public optBare(): this {
    return this.option(GitCommand.gitCommandOptionsConfig.bare.option);
  }

  /**
   * `--no-replace-objects`
   * @see no-replace-objects {@link https://git-scm.com/docs/git#Documentation/git.txt---no-replace-objects}
   */
  public optNoReplaceObjects(): this {
    return this.option(
      GitCommand.gitCommandOptionsConfig.noReplaceObjects.option
    );
  }

  /**
   * `--literal-pathspecs`
   * @see literal-pathspecs {@link https://git-scm.com/docs/git#Documentation/git.txt---literal-pathspecs}
   */
  public optLiteralPathspecs(): this {
    return this.option(
      GitCommand.gitCommandOptionsConfig.literalPathspecs.option
    );
  }

  /**
   * `--glob-pathspecs`
   * @see glob-pathspecs {@link https://git-scm.com/docs/git#Documentation/git.txt---glob-pathspecs}
   */
  public optGlobPathspecs(): this {
    return this.option(GitCommand.gitCommandOptionsConfig.globPathspecs.option);
  }

  /**
   * `--noglob-pathspecs`
   * @see noglob-pathspecs {@link https://git-scm.com/docs/git#Documentation/git.txt---noglob-pathspecs}
   */
  public optNoglobPathspecs(): this {
    return this.option(
      GitCommand.gitCommandOptionsConfig.noglobPathspecs.option
    );
  }

  /**
   * `--icase-pathspecs`
   * @see icase-pathspecs {@link https://git-scm.com/docs/git#Documentation/git.txt---icase-pathspecs}
   */
  public optIcasePathspecs(): this {
    return this.option(
      GitCommand.gitCommandOptionsConfig.icasePathspecs.option
    );
  }

  /**
   * `--no-optional-locks`
   * @see no-optional-locks {@link https://git-scm.com/docs/git#Documentation/git.txt---no-optional-locks}
   */
  public optNoOptionalLocks(): this {
    return this.option(
      GitCommand.gitCommandOptionsConfig.noOptionalLocks.option
    );
  }

  /**
   * `--list-cmds=group[,group...]
   * @param group
   * @see list-cmds {@link https://git-scm.com/docs/git#Documentation/git.txt---list-cmdsgroupgroup82308203}
   */
  public optListCmds(group: string | string[]): this {
    const grp = Array.isArray(group) ? group : [group];
    return this.option(
      GitCommand.gitCommandOptionsConfig.listCmds.option,
      grp.join(',')
    );
  }
}

/**
 * @see GitDocumentation {@link https://git-scm.com/docs/git}
 * @category Commands
 */
export class Command extends GitCommand {
  /**
   *
   */
  public constructor() {
    super();
  }
}

/**
 * @see GitRevParseDocumentation {@link https://git-scm.com/docs/git-rev-parse}
 * @category Commands
 */
export class RevParseCommand extends GitCommand {
  /**
   * @internal
   */
  private static readonly revParseCommandConfig = {
    // Options for Filtering
    // Options for Output
    /**
     * @see short {@link https://git-scm.com/docs/git-rev-parse#Documentation/git-rev-parse.txt---shortlength}
     */
    short: {
      option: '--short',
      seperator: OptionArgumentSeparator.Equals,
    },
    // Options for Objects
    // Options for Files
    /**
     * @see is-inside-work-tree {@link https://git-scm.com/docs/git-rev-parse#Documentation/git-rev-parse.txt---is-inside-work-tree}
     */
    isInsideWorkTree: {
      option: '--is-inside-work-tree',
    },
    // Other Options
  };

  /**
   *
   */
  public constructor() {
    super({
      command: 'rev-parse',
      options: Object.values(RevParseCommand.revParseCommandConfig),
    });
  }

  /**
   * `--short[=length]`
   * @param length
   * @see short {@link https://git-scm.com/docs/git-rev-parse#Documentation/git-rev-parse.txt---shortlength}
   */
  public soptShort(length?: number): this {
    return this.subOption(
      RevParseCommand.revParseCommandConfig.short.option,
      length?.toString()
    );
  }

  /**
   * `--is-inside-work-tree`
   * @see is-inside-work-tree {@link https://git-scm.com/docs/git-rev-parse#Documentation/git-rev-parse.txt---is-inside-work-tree}
   */
  public soptIsInsideWorkTree(): this {
    return this.subOption(
      RevParseCommand.revParseCommandConfig.isInsideWorkTree.option
    );
  }
}

////////////////////////////////////////////////////////////////////////////////
// Internal API
////////////////////////////////////////////////////////////////////////////////

/**
 * @internal
 */
const revParseCommand = new RevParseCommand();

const showRefCommand = new BaseCommand({
  command: 'git',
  subCommand: {
    command: 'show-ref',
  },
});

const lsFilesCommand = new BaseCommand({
  command: 'git',
  subCommand: {
    command: 'ls-files',
    options: [{ option: '--other' }, { option: '--exclude-standard' }],
  },
});

const diffCommand = new BaseCommand({
  command: 'git',
  subCommand: {
    command: 'diff',
    options: [
      { option: '--name-only' },
      { option: '--relative', seperator: OptionArgumentSeparator.Space },
    ],
  },
});

const diffIndexCommand = new BaseCommand({
  command: 'git',
  subCommand: {
    command: 'diff-index',
    options: [{ option: '--name-only' }, { option: '--cached' }],
  },
});

const mergeBaseCommand = new BaseCommand({
  command: 'git',
  subCommand: {
    command: 'merge-base',
  },
});
