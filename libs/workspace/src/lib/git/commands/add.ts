import {
  CommandBuilder,
  OptionArgumentRequirement,
  OptionArgumentSeparator,
} from '../../command-builder';

import { gitCommandOptions } from './git';

/**
 * @see GitAddDocumentation {@link https://git-scm.com/docs/git-add}
 */
export const gitAddCommandOptions = {
  dryRun: { option: '--dry-run' },
  verbose: { option: '--verbose' },
  force: { option: '--force' },
  interactive: { option: '--interactive' },
  patch: { option: '--patch' },
  edit: { option: '--edit' },
  update: { option: '--update' },
  all: { option: '--all' },
  noAll: { option: '--no-all' },
  intentToAdd: { option: '--intent-to-add' },
  refresh: { option: '--refresh' },
  ignoreErrors: { option: '--ignore-errors' },
  ignoreMissing: { option: '--ignore-missing' },
  noWarnEmbeddedRepo: { option: '--no-warn-embedded-repo' },
  renormalize: { option: '--renormalize' },
  chmod: {
    option: '--chmod',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  pathspecFromFile: {
    option: '--pathspec-from-file',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  pathspecFileNul: { option: '--pathspec-file-nul' },
};

/**
 * @see GitAddDocumentation {@link https://git-scm.com/docs/git-add}
 */
export class GitAddCommand extends CommandBuilder {
  public readonly command = {
    git: GitAddCommand.commandAccessorFactory<
      typeof gitCommandOptions,
      GitAddCommand
    >('git', 'git', gitCommandOptions, this),
    add: GitAddCommand.commandAccessorFactory<
      typeof gitAddCommandOptions,
      GitAddCommand
    >('add', 'add', gitAddCommandOptions, this),
  };

  public readonly option = this.command.add.option;

  protected readonly commandIndex = ['git', 'add'];
}
