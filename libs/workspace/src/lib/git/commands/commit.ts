import {
  CommandBuilder,
  OptionArgumentRequirement,
  OptionArgumentSeparator,
  OptionOccurrence,
} from '../../command-builder';

import { gitCommandOptions } from './git';

/**
 * @see GitCommitDocumentation {@link https://git-scm.com/docs/git-commit}
 */
const gitCommitCommandOptions = {
  all: { option: '--all' },
  patch: { option: '--patch' },
  reuseMessage: {
    option: '--reuse-message',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  reeditMessage: {
    option: '--reedit-message',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  fixup: {
    option: '--fixup',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  squash: {
    option: '--squash',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  resetAuthor: { option: '--reset-author' },
  short: { option: '--short' },
  branch: { option: '--branch' },
  porcelain: { option: '--porcelain' },
  long: { option: '--long' },
  null: { option: '--null' },
  file: {
    option: '--file',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  author: {
    option: '--author',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  date: {
    option: '--date',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  message: {
    option: '--message',
    seperator: OptionArgumentSeparator.Equals,
    occurrence: OptionOccurrence.Multiple,
    argRequired: OptionArgumentRequirement.Required,
  },
  template: {
    option: '--template',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  signoff: { option: '--signoff' },
  noSignoff: { option: '--no-signoff' },
  noVerify: { option: '--no-verify' },
  allowEmpty: { option: '--allow-empty' },
  allowEmptyMessage: { option: '--allow-empty-message' },
  cleanup: {
    option: '--cleanup',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  edit: { option: '--edit' },
  noEdit: { option: '--no-edit' },
  ammend: { option: '--ammend' },
  noPostRewrite: { option: '--no-post-rewrite' },
  include: { option: '--include' },
  only: { option: '--only' },
  pathspecFromFile: {
    option: '--pathspec-from-file',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  pathspecFileNul: { option: '--pathspec-file-nul' },
  untrackedFiles: {
    option: '--untracked-files',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Optional,
  },
  verbose: { option: '--verbose' },
  quiet: { option: '--quiet' },
  dryRun: { option: '--dry-run' },
  status: { option: '--status' },
  noStatus: { option: '--no-status' },
  gpgSign: {
    option: '--gpg-sign',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Optional,
  },
  noGpgSign: { option: '--no-gpg-sign' },
};

/**
 * @see GitCommitDocumentation {@link https://git-scm.com/docs/git-commit}
 */
export class GitCommitCommand extends CommandBuilder {
  public readonly command = {
    git: GitCommitCommand.commandAccessorFactory<
      typeof gitCommandOptions,
      GitCommitCommand
    >('git', 'git', gitCommandOptions, this),
    commit: GitCommitCommand.commandAccessorFactory<
      typeof gitCommitCommandOptions,
      GitCommitCommand
    >('commit', 'commit', gitCommitCommandOptions, this),
  };

  public readonly option = this.command.commit.option;

  protected readonly commandIndex = ['git', 'commit'];
}
