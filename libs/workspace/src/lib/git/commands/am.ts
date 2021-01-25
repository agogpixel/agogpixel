import {
  CommandBuilder,
  OptionArgumentRequirement,
  OptionArgumentSeparator,
} from '../../command-builder';

import { gitCommandOptions } from './git';

/**
 * @see GitAmDocumentation {@link https://git-scm.com/docs/git-am}
 * @internal
 */
const gitAmCommandOptions = {
  signoff: { option: '--signoff' },
  keep: { option: '--keep' },
  keepNonPatch: { option: '--keep-non-patch' },
  keepCr: { option: '--keep-cr' },
  noKeepCr: { option: '--no-keep-cr' },
  scissors: { option: '--scissors' },
  noScissors: { option: '--no-scissors' },
  messageId: { option: '--message-id' },
  noMessageId: { option: '--no-message-id' },
  quiet: { option: '--quiet' },
  utf8: { option: '--utf8' },
  noUtf8: { option: '--no-utf8' },
  threeWay: { option: '--3way' },
  noThreeWay: { option: '--no-3way' },
  rerereAutoupdate: { option: '--rerere-autoupdate' },
  noRerereAutoupdate: { option: '--no-rerere-autoupdate' },
  ignoreSpaceChange: { option: '--ignore-space-change' },
  ignoreWhitespace: { option: '--ignore-whitespace' },
  whitespace: {
    option: '--whitespace',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  ensureN: {
    option: '-C',
    seperator: OptionArgumentSeparator.None,
    argRequired: OptionArgumentRequirement.Required,
  },
  removeN: {
    option: '-p',
    seperator: OptionArgumentSeparator.None,
    argRequired: OptionArgumentRequirement.Required,
  },
  directory: {
    option: '--directory',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  exclude: {
    option: '--exclude',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  include: {
    option: '--include',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  reject: { option: '--reject' },
  patchFormat: { option: '--patch-format' },
  interactive: { option: '--interactive' },
  committerDateIsAuthorDate: { option: '--committer-date-is-author-date' },
  ignoreDate: { option: '--ignore-date' },
  skip: { option: '--skip' },
  gpgSign: {
    option: '--gpg-sign',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Optional,
  },
  noGpgSign: { option: '--no-gpg-sign' },
  continue: { option: '--continue' },
  resolved: { option: '--resolved' },
  resolvemsg: {
    option: '--resolvemsg',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  abort: { option: '--abort' },
  quit: { option: '--quit' },
  showCurrentPatch: {
    option: '--show-current-patch',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Optional,
  },
};

/**
 * Git am command.
 * @see GitAmDocumentation {@link https://git-scm.com/docs/git-am}
 */
export class GitAmCommand extends CommandBuilder {
  /**
   * Command accessor map.
   */
  public readonly command = {
    /**
     * Git command accessor.
     */
    git: GitAmCommand.commandAccessorFactory<
      typeof gitCommandOptions,
      GitAmCommand
    >('git', 'git', gitCommandOptions, this),

    /**
     * Am sub-command accessor.
     */
    am: GitAmCommand.commandAccessorFactory<
      typeof gitAmCommandOptions,
      GitAmCommand
    >('am', 'am', gitAmCommandOptions, this),
  };

  /**
   * Am sub-command option accessor.
   */
  public readonly option = this.command.am.option;

  /**
   * Command name order.
   */
  protected readonly commandIndex = ['git', 'am'];
}
