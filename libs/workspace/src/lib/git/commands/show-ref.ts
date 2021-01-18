import { CommandBuilder } from '../../command-builder';

import { gitCommandOptions } from './git';

/**
 * TODO: Options...
 * @see GitShowRefDocumentation {@link https://git-scm.com/docs/git-show-ref}
 */
export const gitShowRefCommandOptions = {};

/**
 * @see GitShowRefDocumentation {@link https://git-scm.com/docs/git-show-ref}
 */
export class GitShowRefCommand extends CommandBuilder {
  public readonly command = {
    git: GitShowRefCommand.commandAccessorFactory<
      typeof gitCommandOptions,
      GitShowRefCommand
    >('git', 'git', gitCommandOptions, this),
    showRef: GitShowRefCommand.commandAccessorFactory<
      typeof gitShowRefCommandOptions,
      GitShowRefCommand
    >('show-ref', 'showRef', gitShowRefCommandOptions, this),
  };

  public readonly option = this.command.showRef.option;

  protected readonly commandIndex = ['git', 'showRef'];
}
