import { Command } from '../../command';

import { gitCommandConfig, gitCommandOptions } from './git';

/**
 * TODO: Options...
 * @see GitAmDocumentation {@link https://git-scm.com/docs/git-am}
 */
export const gitAmCommandOptions = {};

/**
 *
 */
export const gitAmCommandConfig = {
  /**
   *
   */
  command: 'am',

  /**
   * @see gitAmCommandOptions {@link gitAmCommandOptions}
   */
  options: gitAmCommandOptions,
};

/**
 * @see GitAmDocumentation {@link https://git-scm.com/docs/git-am}
 */
export class GitAmCommand extends Command<
  typeof gitCommandOptions,
  typeof gitAmCommandOptions
> {
  /**
   *
   */
  public constructor() {
    super(gitCommandConfig, gitAmCommandConfig);
  }
}
