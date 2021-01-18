import { CommandBuilder, OptionArgumentSeparator } from '../../command-builder';

import { gitCommandOptions } from './git';

/**
 * TODO: Options...
 * @see GitDiffDocumentation {@link https://git-scm.com/docs/git-diff}
 */
export const gitDiffCommandOptions = {
  nameOnly: { option: '--name-only' },
  relative: { option: '--relative', seperator: OptionArgumentSeparator.Space },
};

/**
 * @see GitDiffDocumentation {@link https://git-scm.com/docs/git-diff}
 */
export class GitDiffCommand extends CommandBuilder {
  public readonly command = {
    git: GitDiffCommand.commandAccessorFactory<
      typeof gitCommandOptions,
      GitDiffCommand
    >('git', 'git', gitCommandOptions, this),
    diff: GitDiffCommand.commandAccessorFactory<
      typeof gitDiffCommandOptions,
      GitDiffCommand
    >('diff', 'diff', gitDiffCommandOptions, this),
  };

  public readonly option = this.command.diff.option;

  protected readonly commandIndex = ['git', 'diff'];
}
