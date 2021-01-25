import {
  CommandBuilder,
  OptionArgumentRequirement,
  OptionArgumentSeparator,
} from '../../command-builder';

import { gitCommandOptions } from './git';

/**
 * @see GitRevParseDocumentation {@link https://git-scm.com/docs/git-rev-parse}
 * @internal
 */
const gitRevParseCommandOptions = {
  parseopt: { option: '--parseopt' },
  sqQuote: { option: '--sq-quote' },
  keepDashdash: { option: '--keep-dashdash' },
  stopAtNonOption: { option: '--stop-at-non-option' },
  stuckLong: { option: '--stuck-long' },
  revsOnly: { option: '--revs-only' },
  noRevs: { option: '--no-revs' },
  flags: { option: '--flags' },
  noFlags: { option: '--no-flags' },
  default: {
    option: '--default',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
  },
  prefix: {
    option: '--prefix',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
  },
  verify: { option: '--verify' },
  quiet: { option: '--quiet' },
  shellQuote: { option: '--sq' },
  short: {
    option: '--short',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Optional,
  },
  not: { option: '--not' },
  abbrevRef: {
    option: '--abbrev-ref',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Optional,
  },
  symbolic: { option: '--symbolic' },
  symbolicFullName: { option: '--symbolic-full-name' },
  all: { option: '--all' },
  branches: {
    option: '--branches',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Optional,
  },
  tags: {
    option: '--tags',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Optional,
  },
  remotes: {
    option: '--remotes',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Optional,
  },
  glob: {
    option: '--glob',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  exclude: {
    option: '--exclude',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  disambiguate: {
    option: '--disambiguate',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  localEnvVars: { option: '--local-env-vars' },
  gitDir: { option: '--git-dir' },
  absoluteGitDir: { option: '--absolute-git-dir' },
  gitCommonDir: { option: '--git-common-dir' },
  isInsideGitDir: { option: '--is-inside-git-dir' },
  isInsideWorkTree: { option: '--is-inside-work-tree' },
  isBareRepository: { option: '--is-bare-repository' },
  isShallowRepository: { option: '--is-shallow-repository' },
  resolveGitDir: {
    option: '--resolve-git-dir',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
  },
  gitPath: {
    option: '--git-path',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
  },
  showCdup: { option: '--show-cdup' },
  showPrefix: { option: '--show-prefix' },
  showToplevel: { option: '--show-toplevel' },
  showSuperprojectWorkingTree: { option: '--show-superproject-working-tree' },
  sharedIndexPath: { option: '--shared-index-path' },
  showObjectFormat: {
    option: '--show-object-format',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  since: {
    option: '--since',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  after: {
    option: '--after',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  until: {
    option: '--until',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  before: {
    option: '--before',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
};

/**
 * Git rev-parse command.
 * @see GitRevParseDocumentation {@link https://git-scm.com/docs/git-rev-parse}
 */
export class GitRevParseCommand extends CommandBuilder {
  /**
   * Command accessor map.
   */
  public readonly command = {
    /**
     * Git command accessor.
     */
    git: GitRevParseCommand.commandAccessorFactory<
      typeof gitCommandOptions,
      GitRevParseCommand
    >('git', 'git', gitCommandOptions, this),

    /**
     * Rev-parse sub-command accessor.
     */
    revParse: GitRevParseCommand.commandAccessorFactory<
      typeof gitRevParseCommandOptions,
      GitRevParseCommand
    >('rev-parse', 'revParse', gitRevParseCommandOptions, this),
  };

  /**
   * Rev-parse sub-command option accessor.
   */
  public readonly option = this.command.revParse.option;

  /**
   * Command name order.
   */
  protected readonly commandIndex = ['git', 'revParse'];
}
