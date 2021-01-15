import { Command } from '../../command';

import { gitCommandConfig, gitCommandOptions } from './git';

/**
 * TODO: Options...
 * @see GitMergeBaseDocumentation {@link https://git-scm.com/docs/git-merge-base}
 */
export const gitMergeBaseCommandOptions = {};

/**
 *
 */
export const gitMergBaseCommandConfig = {
  /**
   *
   */
  command: 'merge-base',

  /**
   * @see gitMergeBaseCommandOptions {@link gitMergeBaseCommandOptions}
   */
  options: gitMergeBaseCommandOptions,
};

/**
 * @see GitMergeBaseDocumentation {@link https://git-scm.com/docs/git-merge-base}
 */
export class GitMergeBaseCommand extends Command<
  typeof gitCommandOptions,
  typeof gitMergeBaseCommandOptions
> {
  /**
   *
   */
  public constructor() {
    super(gitCommandConfig, gitMergBaseCommandConfig);
  }
}
