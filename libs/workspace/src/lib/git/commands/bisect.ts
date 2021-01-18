import {
  CommandBuilder,
  OptionArgumentRequirement,
  OptionArgumentSeparator,
} from '../../command-builder';

import { gitCommandOptions } from './git';

/**
 * @see GitBisectDocumentation {@link https://git-scm.com/docs/git-bisect}
 */
const gitBisectCommandOptions = {};

/**
 * @see GitBisectDocumentation {@link https://git-scm.com/docs/git-bisect}
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
 */
const gitBisectTermsCommandOptions = {
  termGood: { option: '--term-good' },
  termBad: { option: '--term-bad' },
};

/**
 * @see GitBisectDocumentation {@link https://git-scm.com/docs/git-bisect}
 */
export class GitBisectCommand extends CommandBuilder {
  public readonly command = {
    git: GitBisectCommand.commandAccessorFactory<
      typeof gitCommandOptions,
      GitBisectCommand
    >('git', 'git', gitCommandOptions, this),
    bisect: GitBisectCommand.commandAccessorFactory<
      typeof gitBisectCommandOptions,
      GitBisectCommand
    >('bisect', 'bisect', gitBisectCommandOptions, this),
  };

  public readonly option = this.command.bisect.option;

  protected readonly commandIndex = ['git', 'bisect'];
}

/**
 * @see GitBisectDocumentation {@link https://git-scm.com/docs/git-bisect}
 */
export class GitBisectStartCommand extends CommandBuilder {
  public readonly command = {
    git: GitBisectStartCommand.commandAccessorFactory<
      typeof gitCommandOptions,
      GitBisectStartCommand
    >('git', 'git', gitCommandOptions, this),
    bisect: GitBisectStartCommand.commandAccessorFactory<
      typeof gitBisectCommandOptions,
      GitBisectStartCommand
    >('bisect', 'bisect', gitBisectCommandOptions, this),
    start: GitBisectStartCommand.commandAccessorFactory<
      typeof gitBisectStartCommandOptions,
      GitBisectStartCommand
    >('start', 'start', gitBisectStartCommandOptions, this),
  };

  public readonly option = this.command.start.option;

  protected readonly commandIndex = ['git', 'bisect', 'start'];
}

/**
 * @see GitBisectDocumentation {@link https://git-scm.com/docs/git-bisect}
 */
export class GitBisectTermsCommand extends CommandBuilder {
  public readonly command = {
    git: GitBisectTermsCommand.commandAccessorFactory<
      typeof gitCommandOptions,
      GitBisectTermsCommand
    >('git', 'git', gitCommandOptions, this),
    bisect: GitBisectTermsCommand.commandAccessorFactory<
      typeof gitBisectCommandOptions,
      GitBisectTermsCommand
    >('bisect', 'bisect', gitBisectCommandOptions, this),
    terms: GitBisectTermsCommand.commandAccessorFactory<
      typeof gitBisectTermsCommandOptions,
      GitBisectTermsCommand
    >('terms', 'terms', gitBisectTermsCommandOptions, this),
  };

  public readonly option = this.command.terms.option;

  protected readonly commandIndex = ['git', 'bisect', 'terms'];
}
