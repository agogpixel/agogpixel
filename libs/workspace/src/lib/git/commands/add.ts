import {
  Command,
  OptionArgumentRequirement,
  OptionArgumentSeparator,
} from '../../command';

import { gitCommandConfig, gitCommandOptions } from './git';

/**
 * @see GitAddDocumentation {@link https://git-scm.com/docs/git-add}
 */
export const gitAddCommandOptions = {
  /**
   * @see dry-run {@link https://git-scm.com/docs/git-add#Documentation/git-add.txt---dry-run}
   */
  dryRun: { option: '--dry-run' },

  /**
   * @see verbose {@link https://git-scm.com/docs/git-add#Documentation/git-add.txt---verbose}
   */
  verbose: { option: '--verbose' },

  /**
   * @see force {@link https://git-scm.com/docs/git-add#Documentation/git-add.txt---force}
   */
  force: { option: '--force' },

  /**
   * @see interactive {@link https://git-scm.com/docs/git-add#Documentation/git-add.txt---interactive}
   */
  interactive: { option: '--interactive' },

  /**
   * @see patch {@link https://git-scm.com/docs/git-add#Documentation/git-add.txt---patch}
   */
  patch: { option: '--patch' },

  /**
   * @see edit {@link https://git-scm.com/docs/git-add#Documentation/git-add.txt---edit}
   */
  edit: { option: '--edit' },

  /**
   * @see update {@link https://git-scm.com/docs/git-add#Documentation/git-add.txt---update}
   */
  update: { option: '--update' },

  /**
   * @see all {@link https://git-scm.com/docs/git-add#Documentation/git-add.txt---all}
   */
  all: { option: '--all' },

  /**
   * @see no-all {@link https://git-scm.com/docs/git-add#Documentation/git-add.txt---no-all}
   */
  noAll: { option: '--no-all' },

  /**
   * @see intent-to-add {@link https://git-scm.com/docs/git-add#Documentation/git-add.txt---intent-to-add}
   */
  intentToAdd: { option: '--intent-to-add' },

  /**
   * @see refresh {@link https://git-scm.com/docs/git-add#Documentation/git-add.txt---refresh}
   */
  refresh: { option: '--refresh' },

  /**
   * @see ignore-errors {@link https://git-scm.com/docs/git-add#Documentation/git-add.txt---ignore-errors}
   */
  ignoreErrors: { option: '--ignore-errors' },

  /**
   * @see ignore-missing {@link https://git-scm.com/docs/git-add#Documentation/git-add.txt---ignore-missing}
   */
  ignoreMissing: { option: '--ignore-missing' },

  /**
   * @see no-warn-embedded-repo {@link https://git-scm.com/docs/git-add#Documentation/git-add.txt---no-warn-embedded-repo}
   */
  noWarnEmbeddedRepo: { option: '--no-warn-embedded-repo' },

  /**
   * @see renormalize {@link https://git-scm.com/docs/git-add#Documentation/git-add.txt---renormalize}
   */
  renormalize: { option: '--renormalize' },

  /**
   * @see chmod {@link https://git-scm.com/docs/git-add#Documentation/git-add.txt---chmod-x}
   */
  chmod: {
    option: '--chmod',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },

  /**
   * @see pathspec-from-file {@link https://git-scm.com/docs/git-add#Documentation/git-add.txt---pathspec-from-fileltfilegt}
   */
  pathspecFromFile: {
    option: '--pathspec-from-file',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },

  /**
   * @see pathspec-file-nul {@link https://git-scm.com/docs/git-add#Documentation/git-add.txt---pathspec-file-nul}
   */
  pathspecFileNul: { option: '--pathspec-file-nul' },
};

/**
 *
 */
export const gitAddCommandConfig = {
  /**
   *
   */
  command: 'add',

  /**
   * @see gitAddCommandOptions {@link gitAddCommandOptions}
   */
  options: gitAddCommandOptions,
};

/**
 * @see GitAddDocumentation {@link https://git-scm.com/docs/git-add}
 */
export class GitAddCommand extends Command<
  typeof gitCommandOptions,
  typeof gitAddCommandOptions
> {
  /**
   *
   */
  public constructor() {
    super(gitCommandConfig, gitAddCommandConfig);
  }
}
