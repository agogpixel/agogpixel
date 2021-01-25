import {
  CommandBuilder,
  OptionArgumentRequirement,
  OptionArgumentSeparator,
} from '../../command-builder';

import { gitCommandOptions } from './git';

/**
 * @see GitShowRefDocumentation {@link https://git-scm.com/docs/git-show-ref}
 * @internal
 */
const gitShowRefCommandOptions = {
  head: { option: '--head' },
  heads: { option: '--heads' },
  tags: { option: '--tags' },
  dereference: { option: '--dereference' },
  hash: {
    option: '--hash',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Optional,
  },
  verify: { option: '--verify' },
  abbrev: {
    option: '--abbrev',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Optional,
  },
  quiet: { option: '--quiet' },
  excludeExisting: {
    option: '--exclude-existing',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Optional,
  },
};

/**
 * Git show-ref command.
 * @see GitShowRefDocumentation {@link https://git-scm.com/docs/git-show-ref}
 */
export class GitShowRefCommand extends CommandBuilder {
  /**
   * Command accessor map.
   */
  public readonly command = {
    /**
     * Git command accessor.
     */
    git: GitShowRefCommand.commandAccessorFactory<
      typeof gitCommandOptions,
      GitShowRefCommand
    >('git', 'git', gitCommandOptions, this),

    /**
     * Show-ref sub-command accessor.
     */
    showRef: GitShowRefCommand.commandAccessorFactory<
      typeof gitShowRefCommandOptions,
      GitShowRefCommand
    >('show-ref', 'showRef', gitShowRefCommandOptions, this),
  };

  /**
   * Show-ref sub-command option accessor.
   */
  public readonly option = this.command.showRef.option;

  /**
   * Command name order.
   */
  protected readonly commandIndex = ['git', 'showRef'];
}
