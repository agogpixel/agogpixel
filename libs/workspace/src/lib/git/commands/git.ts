import { CommandBuilder, OptionArgumentSeparator } from '../../command-builder';

/**
 * @see GitDocumentation {@link https://git-scm.com/docs/git}
 */
export const gitCommandOptions = {
  version: { option: '--version' },
  help: { option: '--help' },
  cwd: { option: '-C', seperator: OptionArgumentSeparator.Space },
  config: { option: '-c', seperator: OptionArgumentSeparator.Space },
  execPath: {
    option: '--exec-path',
    seperator: OptionArgumentSeparator.Equals,
  },
  htmlPath: { option: '--html-path' },
  manPath: { option: '--man-path' },
  infoPath: { option: '--info-path' },
  paginate: { option: '--paginate' },
  noPager: { option: '--no-pager' },
  gitDir: { option: '--git-dir', seperator: OptionArgumentSeparator.Equals },
  workTree: {
    option: '--work-tree',
    seperator: OptionArgumentSeparator.Equals,
  },
  namespace: {
    option: '--namespace',
    seperator: OptionArgumentSeparator.Equals,
  },
  superPrefix: {
    option: '--super-prefix',
    seperator: OptionArgumentSeparator.Equals,
  },
  bare: { option: '--bare' },
  noReplaceObjects: { option: '--no-replace-objects' },
  literalPathspecs: { option: '--literal-pathspecs' },
  globPathspecs: { option: '--glob-pathspecs' },
  noglobPathspecs: { option: '--noglob-pathspecs' },
  icasePathspecs: { option: '--icase-pathspecs' },
  noOptionalLocks: { option: '--no-optional-locks' },
  listCmds: {
    option: '--list-cmds',
    seperator: OptionArgumentSeparator.Equals,
  },
};

/**
 * @see GitDocumentation {@link https://git-scm.com/docs/git}
 */
export class GitCommand extends CommandBuilder {
  public readonly command = {
    git: GitCommand.commandAccessorFactory<typeof gitCommandOptions, GitCommand>(
      'git',
      'git',
      gitCommandOptions,
      this
    ),
  };

  public readonly option = this.command.git.option;

  protected readonly commandIndex = ['git'];
}
