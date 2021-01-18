import { CommandBuilder } from '../../command-builder';

import { gitCommandOptions } from './git';

/**
 * TODO: Options...
 * @see GitLsFilesDocumentation {@link https://git-scm.com/docs/git-ls-files}
 */
export const gitLsFilesCommandOptions = {
  other: { option: '--other' },
  excludeStandard: { option: '--exclude-standard' },
};

/**
 * @see GitLsFilesDocumentation {@link https://git-scm.com/docs/git-ls-files}
 */
export class GitLsFilesCommand extends CommandBuilder {
  public readonly command = {
    git: GitLsFilesCommand.commandAccessorFactory<
      typeof gitCommandOptions,
      GitLsFilesCommand
    >('git', 'git', gitCommandOptions, this),
    lsFiles: GitLsFilesCommand.commandAccessorFactory<
      typeof gitLsFilesCommandOptions,
      GitLsFilesCommand
    >('ls-files', 'lsFiles', gitLsFilesCommandOptions, this),
  };

  public readonly option = this.command.lsFiles.option;

  protected readonly commandIndex = ['git', 'lsFiles'];
}
