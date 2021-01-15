import { Command, OptionArgumentSeparator } from '../../command';

import { gitCommandConfig, gitCommandOptions } from './git';

/**
 * TODO: Options...
 * @see GitRevParseDocumentation {@link https://git-scm.com/docs/git-rev-parse}
 */
export const gitRevParseCommandOptions = {
  // Options for Filtering

  // Options for Output

  /**
   * @see short {@link https://git-scm.com/docs/git-rev-parse#Documentation/git-rev-parse.txt---shortlength}
   */
  short: { option: '--short', seperator: OptionArgumentSeparator.Equals },

  // Options for Objects

  // Options for Files

  /**
   * @see is-inside-work-tree {@link https://git-scm.com/docs/git-rev-parse#Documentation/git-rev-parse.txt---is-inside-work-tree}
   */
  isInsideWorkTree: { option: '--is-inside-work-tree' },

  // Other Options
};

/**
 *
 */
export const gitRevParseCommandConfig = {
  /**
   *
   */
  command: 'rev-parse',

  /**
   * @see gitRevParseCommandOptions {@link gitRevParseCommandOptions}
   */
  options: gitRevParseCommandOptions,
};

/**
 * @see GitRevParseDocumentation {@link https://git-scm.com/docs/git-rev-parse}
 */
export class GitRevParseCommand extends Command<
  typeof gitCommandOptions,
  typeof gitRevParseCommandOptions
> {
  /**
   *
   */
  public constructor() {
    super(gitCommandConfig, gitRevParseCommandConfig);
  }
}
