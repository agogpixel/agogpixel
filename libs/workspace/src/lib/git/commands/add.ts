import {
  CommandBuilder,
  OptionArgumentRequirement,
  OptionArgumentSeparator,
} from '../../command-builder';

import { gitCommandOptions } from './git';

/**
 * @see GitAddDocumentation {@link https://git-scm.com/docs/git-add}
 * @internal
 */
const gitAddCommandOptions = {
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
 * Git add command.
 * @see GitAddDocumentation {@link https://git-scm.com/docs/git-add}
 */
export class GitAddCommand extends CommandBuilder {
  /**
   * Command accessor map.
   */
  public readonly command = {
    /**
     * Git command accessor.
     */
    git: GitAddCommand.commandAccessorFactory<
      typeof gitCommandOptions,
      GitAddCommand
    >('git', 'git', gitCommandOptions, this),

    /**
     * Add sub-command accessor.
     */
    add: GitAddCommand.commandAccessorFactory<
      typeof gitAddCommandOptions,
      GitAddCommand
    >('add', 'add', gitAddCommandOptions, this),
  };

  /**
   * Add sub-command option accessor.
   */
  public readonly option = this.command.add.option;

  /**
   * Command name order.
   */
  protected readonly commandIndex = ['git', 'add'];
}
