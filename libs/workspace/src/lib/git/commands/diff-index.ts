import { Command } from '../../command';

import { gitCommandConfig, gitCommandOptions } from './git';

/**
 * TODO: Options...
 * @see GitDiffIndexDocumentation {@link https://git-scm.com/docs/git-diff-index}
 */
export const gitDiffIndexCommandOptions = {
  /**
   *
   */
  nameOnly: { option: '--name-only' },

  /**
   *
   */
  cached: { option: '--cached' },
};

/**
 *
 */
export const gitDiffIndexCommandConfig = {
  /**
   *
   */
  command: 'diff-index',

  /**
   * @see gitDiffIndexCommandOptions {@link gitDiffIndexCommandOptions}
   */
  options: gitDiffIndexCommandOptions,
};

/**
 * @see GitDiffIndexDocumentation {@link https://git-scm.com/docs/git-diff-index}
 */
export class GitDiffIndexCommand extends Command<
  typeof gitCommandOptions,
  typeof gitDiffIndexCommandOptions
> {
  /**
   *
   */
  public constructor() {
    super(gitCommandConfig, gitDiffIndexCommandConfig);
  }
}
