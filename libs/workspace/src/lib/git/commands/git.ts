import {
  CommandBuilder,
  OptionArgumentRequirement,
  OptionArgumentSeparator,
  OptionOccurrence,
} from '../../command-builder';

/**
 * @see GitDocumentation {@link https://git-scm.com/docs/git}
 */
export const gitCommandOptions = {
  version: { option: '--version' },
  help: { option: '--help' },
  cwd: {
    option: '-C',
    seperator: OptionArgumentSeparator.Space,
    occurence: OptionOccurrence.Multiple,
    argRequired: OptionArgumentRequirement.Required,
  },
  config: {
    option: '-c',
    seperator: OptionArgumentSeparator.Space,
    occurence: OptionOccurrence.Multiple,
    argRequired: OptionArgumentRequirement.Required,
  },
  execPath: {
    option: '--exec-path',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Optional,
  },
  htmlPath: { option: '--html-path' },
  manPath: { option: '--man-path' },
  infoPath: { option: '--info-path' },
  paginate: { option: '--paginate' },
  noPager: { option: '--no-pager' },
  gitDir: {
    option: '--git-dir',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  workTree: {
    option: '--work-tree',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  namespace: {
    option: '--namespace',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  superPrefix: {
    option: '--super-prefix',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
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
    git: GitCommand.commandAccessorFactory<
      typeof gitCommandOptions,
      GitCommand
    >('git', 'git', gitCommandOptions, this),
  };

  public readonly option = this.command.git.option;

  protected readonly commandIndex = ['git'];
}
