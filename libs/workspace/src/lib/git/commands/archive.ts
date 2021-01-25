import {
  CommandBuilder,
  OptionArgumentRequirement,
  OptionArgumentSeparator,
} from '../../command-builder';

import { gitCommandOptions } from './git';

/**
 * @see GitArchiveDocumentation {@link https://git-scm.com/docs/git-archive}
 * @internal
 */
const gitArchiveCommandOptions = {
  format: {
    option: '--format',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  list: { option: '--list' },
  verbose: { option: '--verbose' },
  prefix: {
    option: '--prefix',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  output: {
    option: '--output',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  addFile: {
    option: '--add-file',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  worktreeAttributes: { option: '--worktree-attributes' },
  zip0: { option: '-0' },
  zip1: { option: '-1' },
  zip2: { option: '-2' },
  zip3: { option: '-3' },
  zip4: { option: '-4' },
  zip5: { option: '-5' },
  zip6: { option: '-6' },
  zip7: { option: '-7' },
  zip8: { option: '-8' },
  zip9: { option: '-9' },
  remote: {
    option: '--remote',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  exec: {
    option: '--exec',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
};

/**
 * Git archive command.
 * @see GitArchiveDocumentation {@link https://git-scm.com/docs/git-archive}
 */
export class GitArchiveCommand extends CommandBuilder {
  /**
   * Command accessor map.
   */
  public readonly command = {
    /**
     * Git command accessor.
     */
    git: GitArchiveCommand.commandAccessorFactory<
      typeof gitCommandOptions,
      GitArchiveCommand
    >('git', 'git', gitCommandOptions, this),

    /**
     * Archive sub-command accessor.
     */
    archive: GitArchiveCommand.commandAccessorFactory<
      typeof gitArchiveCommandOptions,
      GitArchiveCommand
    >('archive', 'archive', gitArchiveCommandOptions, this),
  };

  /**
   * Archive sub-command option accessor.
   */
  public readonly option = this.command.archive.option;

  /**
   * Command name order.
   */
  protected readonly commandIndex = ['git', 'archive'];
}
