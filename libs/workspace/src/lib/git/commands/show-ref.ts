import {
  CommandBuilder,
  OptionArgumentRequirement,
  OptionArgumentSeparator,
} from '../../command-builder';

import { gitCommandOptions } from './git';

/**
 * @see GitShowRefDocumentation {@link https://git-scm.com/docs/git-show-ref}
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
 * @see GitShowRefDocumentation {@link https://git-scm.com/docs/git-show-ref}
 */
export class GitShowRefCommand extends CommandBuilder {
  public readonly command = {
    git: GitShowRefCommand.commandAccessorFactory<
      typeof gitCommandOptions,
      GitShowRefCommand
    >('git', 'git', gitCommandOptions, this),
    showRef: GitShowRefCommand.commandAccessorFactory<
      typeof gitShowRefCommandOptions,
      GitShowRefCommand
    >('show-ref', 'showRef', gitShowRefCommandOptions, this),
  };

  public readonly option = this.command.showRef.option;

  protected readonly commandIndex = ['git', 'showRef'];
}
