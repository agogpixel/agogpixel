import {
  CommandBuilder,
  OptionArgumentRequirement,
  OptionArgumentSeparator,
} from '../../command-builder';

import { gitCommandOptions } from './git';

/**
 * @see GitLsFilesDocumentation {@link https://git-scm.com/docs/git-ls-files}
 * @internal
 */
const gitLsFilesCommandOptions = {
  cached: { option: '--cached' },
  deleted: { option: '--deleted' },
  modified: { option: '--modified' },
  others: { option: '--others' },
  ignored: { option: '--ignored' },
  stage: { option: '--stage' },
  directory: { option: '--directory' },
  noEmptyDirectory: { option: '--no-empty-directory' },
  unmerged: { option: '--unmerged' },
  killed: { option: '--killed' },
  noQuoteFilenames: { option: '-z' },
  exclude: {
    option: '--exclude',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  excludeFrom: {
    option: '--exclude-from',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  excludePerDirectory: {
    option: '--exclude-per-directory',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  excludeStandard: { option: '--exclude-standard' },
  errorUnmatch: { option: '--error-unmatch' },
  withTree: {
    option: '--with-tree',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  identifyFileStatus: { option: '-t' },
  identifyFileStatusAssumeUnchanged: { option: '-v' },
  identifyFileStatusFsmonitorValid: { option: '-f' },
  fullName: { option: '--full-name' },
  recurseSubmodules: { option: '--recurse-submodules' },
  abbrev: {
    option: '--abbrev',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Optional,
  },
  debug: { option: '--debug' },
  eol: { option: '--eol' },
};

/**
 * Git ls-files command.
 * @see GitLsFilesDocumentation {@link https://git-scm.com/docs/git-ls-files}
 */
export class GitLsFilesCommand extends CommandBuilder {
  /**
   * Command accessor map.
   */
  public readonly command = {
    /**
     * Git command accessor.
     */
    git: GitLsFilesCommand.commandAccessorFactory<
      typeof gitCommandOptions,
      GitLsFilesCommand
    >('git', 'git', gitCommandOptions, this),

    /**
     * Ls-files sub-command accessor.
     */
    lsFiles: GitLsFilesCommand.commandAccessorFactory<
      typeof gitLsFilesCommandOptions,
      GitLsFilesCommand
    >('ls-files', 'lsFiles', gitLsFilesCommandOptions, this),
  };

  /**
   * Ls-files sub-command option accessor.
   */
  public readonly option = this.command.lsFiles.option;

  /**
   * Command name order.
   */
  protected readonly commandIndex = ['git', 'lsFiles'];
}
