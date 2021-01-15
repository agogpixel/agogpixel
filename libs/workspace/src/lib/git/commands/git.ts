import { Command, OptionArgumentSeparator } from '../../command';

/**
 * @see GitDocumentation {@link https://git-scm.com/docs/git}
 */
export const gitCommandOptions = {
  /**
   * @see version {@link https://git-scm.com/docs/git#Documentation/git.txt---version}
   */
  version: { option: '--version' },

  /**
   * @see help {@link https://git-scm.com/docs/git#Documentation/git.txt---help}
   */
  help: { option: '--help' },

  /**
   * @see cwd {@link https://git-scm.com/docs/git#Documentation/git.txt--Cltpathgt}
   */
  cwd: { option: '-C', seperator: OptionArgumentSeparator.Space },

  /**
   * @see config {@link https://git-scm.com/docs/git#Documentation/git.txt--cltnamegtltvaluegt}
   */
  config: { option: '-c', seperator: OptionArgumentSeparator.Space },

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
  htmlPath: { option: '--html-path' },

  /**
   * @see man-path {@link https://git-scm.com/docs/git#Documentation/git.txt---man-path}
   */
  manPath: { option: '--man-path' },

  /**
   * @see info-path {@link https://git-scm.com/docs/git#Documentation/git.txt---info-path}
   */
  infoPath: { option: '--info-path' },

  /**
   * @see paginate {@link https://git-scm.com/docs/git#Documentation/git.txt---paginate}
   */
  paginate: { option: '--paginate' },

  /**
   * @see no-pager {@link https://git-scm.com/docs/git#Documentation/git.txt---no-pager}
   */
  noPager: { option: '--no-pager' },

  /**
   * @see git-dir {@link https://git-scm.com/docs/git#Documentation/git.txt---git-dirltpathgt}
   */
  gitDir: { option: '--git-dir', seperator: OptionArgumentSeparator.Equals },

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
  bare: { option: '--bare' },

  /**
   * @see no-replace-objects {@link https://git-scm.com/docs/git#Documentation/git.txt---no-replace-objects}
   */
  noReplaceObjects: { option: '--no-replace-objects' },

  /**
   * @see literal-pathspecs {@link https://git-scm.com/docs/git#Documentation/git.txt---literal-pathspecs}
   */
  literalPathspecs: { option: '--literal-pathspecs' },

  /**
   * @see glob-pathspecs {@link https://git-scm.com/docs/git#Documentation/git.txt---glob-pathspecs}
   */
  globPathspecs: { option: '--glob-pathspecs' },

  /**
   * @see noglob-pathspecs {@link https://git-scm.com/docs/git#Documentation/git.txt---noglob-pathspecs}
   */
  noglobPathspecs: { option: '--noglob-pathspecs' },

  /**
   * @see icase-pathspecs {@link https://git-scm.com/docs/git#Documentation/git.txt---icase-pathspecs}
   */
  icasePathspecs: { option: '--icase-pathspecs' },

  /**
   * @see no-optional-locks {@link https://git-scm.com/docs/git#Documentation/git.txt---no-optional-locks}
   */
  noOptionalLocks: { option: '--no-optional-locks' },

  /**
   * @see list-cmds {@link https://git-scm.com/docs/git#Documentation/git.txt---list-cmdsgroupgroup82308203}
   */
  listCmds: {
    option: '--list-cmds',
    seperator: OptionArgumentSeparator.Equals,
  },
};

/**
 *
 */
export const gitCommandConfig = {
  /**
   *
   */
  command: 'git',

  /**
   * @see gitCommandOptions {@link gitCommandOptions}
   */
  options: gitCommandOptions,
};

/**
 * @see GitDocumentation {@link https://git-scm.com/docs/git}
 */
export class GitCommand extends Command<typeof gitCommandOptions> {
  /**
   *
   */
  public constructor() {
    super(gitCommandConfig);
  }
}
