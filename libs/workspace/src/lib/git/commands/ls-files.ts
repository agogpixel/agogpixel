import { Command } from '../../command';

import { gitCommandConfig, gitCommandOptions } from './git';

/**
 * TODO: Options...
 * @see GitLsFilesDocumentation {@link https://git-scm.com/docs/git-ls-files}
 */
export const gitLsFilesCommandOptions = {
  /**
   *
   */
  other: { option: '--other' },

  /**
   *
   */
  excludeStandard: { option: '--exclude-standard' },
};

/**
 *
 */
export const gitLsFilesCommandConfig = {
  /**
   *
   */
  command: 'ls-files',

  /**
   * @see gitLsFilesCommandOptions {@link gitLsFilesCommandOptions}
   */
  options: gitLsFilesCommandOptions,
};

/**
 * @see GitLsFilesDocumentation {@link https://git-scm.com/docs/git-ls-files}
 */
export class GitLsFilesCommand extends Command<
  typeof gitCommandOptions,
  typeof gitLsFilesCommandOptions
> {
  /**
   *
   */
  public constructor() {
    super(gitCommandConfig, gitLsFilesCommandConfig);
  }
}
