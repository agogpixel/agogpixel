import { CommandBuilder } from '../../command-builder';

import { gitCommandOptions } from './git';

/**
 * TODO: Options...
 * @see GitAmDocumentation {@link https://git-scm.com/docs/git-am}
 */
export const gitAmCommandOptions = {};

/**
 * @see GitAmDocumentation {@link https://git-scm.com/docs/git-am}
 */
export class GitAmCommand extends CommandBuilder {
  public readonly command = {
    git: GitAmCommand.commandAccessorFactory<typeof gitCommandOptions, GitAmCommand>(
      'git',
      'git',
      gitCommandOptions,
      this
    ),
    am: GitAmCommand.commandAccessorFactory<typeof gitAmCommandOptions, GitAmCommand>(
      'am',
      'am',
      gitAmCommandOptions,
      this
    ),
  };

  public readonly option = this.command.am.option;

  protected readonly commandIndex = ['git', 'am'];
}
