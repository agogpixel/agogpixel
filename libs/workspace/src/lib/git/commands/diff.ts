import { Command, OptionArgumentSeparator } from '../../command';

import { gitCommandConfig, gitCommandOptions } from './git';

/**
 * TODO: Options...
 * @see GitDiffDocumentation {@link https://git-scm.com/docs/git-diff}
 */
export const gitDiffCommandOptions = {
  /**
   *
   */
  nameOnly: { option: '--name-only' },

  /**
   *
   */
  relative: { option: '--relative', seperator: OptionArgumentSeparator.Space },
};

/**
 *
 */
export const gitDiffCommandConfig = {
  /**
   *
   */
  command: 'diff',

  /**
   * @see gitDiffCommandOptions {@link gitDiffCommandOptions}
   */
  options: gitDiffCommandOptions,
};

/**
 * @see GitDiffDocumentation {@link https://git-scm.com/docs/git-diff}
 */
export class GitDiffCommand extends Command<
  typeof gitCommandOptions,
  typeof gitDiffCommandOptions
> {
  /**
   *
   */
  public constructor() {
    super(gitCommandConfig, gitDiffCommandConfig);
  }
}
