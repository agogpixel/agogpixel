import { CommandBuilder } from '../../command-builder';

import { gitCommandOptions } from './git';

/**
 * @see GitMergeBaseDocumentation {@link https://git-scm.com/docs/git-merge-base}
 * @internal
 */
const gitMergeBaseCommandOptions = {
  all: { option: '--all' },
  octopus: { option: '--octopus' },
  independent: { option: '--independent' },
  isAncestor: { option: '--is-ancestor' },
  forkPoint: { option: '--fork-point' },
};

/**
 * Git merge-base command.
 * @see GitMergeBaseDocumentation {@link https://git-scm.com/docs/git-merge-base}
 */
export class GitMergeBaseCommand extends CommandBuilder {
  /**
   * Command accessor map.
   */
  public readonly command = {
    /**
     * Git command accessor.
     */
    git: GitMergeBaseCommand.commandAccessorFactory<
      typeof gitCommandOptions,
      GitMergeBaseCommand
    >('git', 'git', gitCommandOptions, this),

    /**
     * Merge-base sub-command accessor.
     */
    mergeBase: GitMergeBaseCommand.commandAccessorFactory<
      typeof gitMergeBaseCommandOptions,
      GitMergeBaseCommand
    >('merge-base', 'mergeBase', gitMergeBaseCommandOptions, this),
  };

  /**
   * Merge-base sub-command option accessor.
   */
  public readonly option = this.command.mergeBase.option;

  /**
   * Command name order.
   */
  protected readonly commandIndex = ['git', 'mergeBase'];
}
