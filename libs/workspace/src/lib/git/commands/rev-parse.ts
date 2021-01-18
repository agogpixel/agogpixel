import { CommandBuilder, OptionArgumentSeparator } from '../../command-builder';

import { gitCommandOptions } from './git';

/**
 * TODO: Options...
 * @see GitRevParseDocumentation {@link https://git-scm.com/docs/git-rev-parse}
 */
export const gitRevParseCommandOptions = {
  // Options for Filtering
  // Options for Output
  short: { option: '--short', seperator: OptionArgumentSeparator.Equals },
  // Options for Objects
  // Options for Files
  isInsideWorkTree: { option: '--is-inside-work-tree' },
  // Other Options
};

/**
 * @see GitRevParseDocumentation {@link https://git-scm.com/docs/git-rev-parse}
 */
export class GitRevParseCommand extends CommandBuilder {
  public readonly command = {
    git: GitRevParseCommand.commandAccessorFactory<
      typeof gitCommandOptions,
      GitRevParseCommand
    >('git', 'git', gitCommandOptions, this),
    revParse: GitRevParseCommand.commandAccessorFactory<
      typeof gitRevParseCommandOptions,
      GitRevParseCommand
    >('rev-parse', 'revParse', gitRevParseCommandOptions, this),
  };

  public readonly option = this.command.revParse.option;

  protected readonly commandIndex = ['git', 'revParse'];
}
