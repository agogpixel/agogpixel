import { CommandBuilder } from '../../command-builder';

import { gitCommandOptions } from './git';

/**
 * TODO: Options...
 * @see GitDiffIndexDocumentation {@link https://git-scm.com/docs/git-diff-index}
 */
export const gitDiffIndexCommandOptions = {
  nameOnly: { option: '--name-only' },
  cached: { option: '--cached' },
};

/**
 * @see GitDiffIndexDocumentation {@link https://git-scm.com/docs/git-diff-index}
 */
export class GitDiffIndexCommand extends CommandBuilder {
  public readonly command = {
    git: GitDiffIndexCommand.commandAccessorFactory<
      typeof gitCommandOptions,
      GitDiffIndexCommand
    >('git', 'git', gitCommandOptions, this),
    diffIndex: GitDiffIndexCommand.commandAccessorFactory<
      typeof gitDiffIndexCommandOptions,
      GitDiffIndexCommand
    >('diff-index', 'diffIndex', gitDiffIndexCommandOptions, this),
  };

  public readonly option = this.command.diffIndex.option;

  protected readonly commandIndex = ['git', 'diffIndex'];
}
