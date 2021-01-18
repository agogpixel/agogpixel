import { CommandBuilder } from '../../command-builder';

import { gitCommandOptions } from './git';

/**
 * TODO: Options...
 * @see GitMergeBaseDocumentation {@link https://git-scm.com/docs/git-merge-base}
 */
export const gitMergeBaseCommandOptions = {};

/**
 * @see GitMergeBaseDocumentation {@link https://git-scm.com/docs/git-merge-base}
 */
export class GitMergeBaseCommand extends CommandBuilder {
  public readonly command = {
    git: GitMergeBaseCommand.commandAccessorFactory<
      typeof gitCommandOptions,
      GitMergeBaseCommand
    >('git', 'git', gitCommandOptions, this),
    mergeBase: GitMergeBaseCommand.commandAccessorFactory<
      typeof gitMergeBaseCommandOptions,
      GitMergeBaseCommand
    >('merge-base', 'mergeBase', gitMergeBaseCommandOptions, this),
  };

  public readonly option = this.command.mergeBase.option;

  protected readonly commandIndex = ['git', 'mergeBase'];
}
