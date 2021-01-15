import { Command } from '../../command';

import { gitCommandConfig, gitCommandOptions } from './git';

/**
 * TODO: Options...
 * @see GitShowRefDocumentation {@link https://git-scm.com/docs/git-show-ref}
 */
export const gitShowRefCommandOptions = {};

/**
 *
 */
export const gitShowRefCommandConfig = {
  /**
   *
   */
  command: 'show-ref',

  /**
   * @see gitShowRefCommandOptions {@link gitShowRefCommandOptions}
   */
  options: gitShowRefCommandOptions,
};

/**
 * @see GitShowRefDocumentation {@link https://git-scm.com/docs/git-show-ref}
 */
export class GitShowRefCommand extends Command<
  typeof gitCommandOptions,
  typeof gitShowRefCommandOptions
> {
  /**
   *
   */
  public constructor() {
    super(gitCommandConfig, gitShowRefCommandConfig);
  }
}
