import {
  CommandBuilder,
  OptionArgumentRequirement,
  OptionArgumentSeparator,
} from '../../command-builder';

import { gitCommandOptions } from './git';

/**
 * @see GitBisectDocumentation {@link https://git-scm.com/docs/git-bisect}
 * @internal
 */
const gitBisectCommandOptions = {};

/**
 * @see GitBisectDocumentation {@link https://git-scm.com/docs/git-bisect}
 * @internal
 */
const gitBisectStartCommandOptions = {
  termNew: {
    option: '--term-new',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  termBad: {
    option: '--term-bad',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  termOld: {
    option: '--term-old',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  termGood: {
    option: '--term-good',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  noCheckout: { option: 'no-checkout' },
  firstParent: { option: '--first-parent' },
};

/**
 * @see GitBisectDocumentation {@link https://git-scm.com/docs/git-bisect}
 * @internal
 */
const gitBisectTermsCommandOptions = {
  termGood: { option: '--term-good' },
  termBad: { option: '--term-bad' },
};

/**
 * Git bisect command.
 * @see GitBisectDocumentation {@link https://git-scm.com/docs/git-bisect}
 */
export class GitBisectCommand extends CommandBuilder {
  /**
   * Command accessor map.
   */
  public readonly command = {
    /**
     * Git command accessor.
     */
    git: GitBisectCommand.commandAccessorFactory<
      typeof gitCommandOptions,
      GitBisectCommand
    >('git', 'git', gitCommandOptions, this),

    /**
     * Bisect sub-command accessor.
     */
    bisect: GitBisectCommand.commandAccessorFactory<
      typeof gitBisectCommandOptions,
      GitBisectCommand
    >('bisect', 'bisect', gitBisectCommandOptions, this),
  };

  /**
   * Bisect sub-command option accessor.
   */
  public readonly option = this.command.bisect.option;

  /**
   * Command name order.
   */
  protected readonly commandIndex = ['git', 'bisect'];
}

/**
 * Git bisect start command.
 * @see GitBisectDocumentation {@link https://git-scm.com/docs/git-bisect}
 */
export class GitBisectStartCommand extends CommandBuilder {
  /**
   * Command accessor map.
   */
  public readonly command = {
    /**
     * Git command accessor.
     */
    git: GitBisectStartCommand.commandAccessorFactory<
      typeof gitCommandOptions,
      GitBisectStartCommand
    >('git', 'git', gitCommandOptions, this),

    /**
     * Bisect sub-command accessor.
     */
    bisect: GitBisectStartCommand.commandAccessorFactory<
      typeof gitBisectCommandOptions,
      GitBisectStartCommand
    >('bisect', 'bisect', gitBisectCommandOptions, this),

    /**
     * Start child sub-command accessor.
     */
    start: GitBisectStartCommand.commandAccessorFactory<
      typeof gitBisectStartCommandOptions,
      GitBisectStartCommand
    >('start', 'start', gitBisectStartCommandOptions, this),
  };

  /**
   * Start child sub-command option accessor.
   */
  public readonly option = this.command.start.option;

  /**
   * Command name order.
   */
  protected readonly commandIndex = ['git', 'bisect', 'start'];
}

/**
 * Git bisect terms command.
 * @see GitBisectDocumentation {@link https://git-scm.com/docs/git-bisect}
 */
export class GitBisectTermsCommand extends CommandBuilder {
  /**
   * Command accessor map.
   */
  public readonly command = {
    /**
     * Git command accessor.
     */
    git: GitBisectTermsCommand.commandAccessorFactory<
      typeof gitCommandOptions,
      GitBisectTermsCommand
    >('git', 'git', gitCommandOptions, this),

    /**
     * Bisect sub-command accessor.
     */
    bisect: GitBisectTermsCommand.commandAccessorFactory<
      typeof gitBisectCommandOptions,
      GitBisectTermsCommand
    >('bisect', 'bisect', gitBisectCommandOptions, this),

    /**
     * Terms child sub-command accessor.
     */
    terms: GitBisectTermsCommand.commandAccessorFactory<
      typeof gitBisectTermsCommandOptions,
      GitBisectTermsCommand
    >('terms', 'terms', gitBisectTermsCommandOptions, this),
  };

  /**
   * Terms child sub-command option accessor.
   */
  public readonly option = this.command.terms.option;

  /**
   * Command name order.
   */
  protected readonly commandIndex = ['git', 'bisect', 'terms'];
}
