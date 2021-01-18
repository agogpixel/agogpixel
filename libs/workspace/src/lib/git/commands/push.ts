import {
  CommandBuilder,
  OptionArgumentRequirement,
  OptionArgumentSeparator,
} from '../../command-builder';

import { gitCommandOptions } from './git';

/**
 * @see GitPushDocumentation {@link https://git-scm.com/docs/git-push}
 */
const gitPushCommandOptions = {
  all: { option: '--all' },
  prune: { option: '--prune' },
  mirror: { option: '--mirror' },
  dryRun: { option: '--dry-run' },
  porcelain: { option: '--porcelain' },
  delete: { option: '--delete' },
  tags: { option: '--tags' },
  followTags: { option: '--follow-tags' },
  signed: {
    option: '--signed',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  noSigned: { option: '--no-signed' },
  atomic: { option: '--atomic' },
  noAtomic: { option: '--no-atomic' },
  pushOption: {
    option: '--push-option',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  receivePack: {
    option: '--receive-pack',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  exec: {
    option: '--exec',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  forceWithLease: {
    option: '--force-with-lease',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  noForceWithLease: { option: '--no-force-with-lease' },
  force: { option: '--force' },
  forceIfIncludes: { option: '--force-if-includes' },
  noForceIfIncludes: { option: '--no-force-if-includes' },
  repo: {
    option: '--repo',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  setUpstream: { option: '--set-upstream' },
  thin: { option: '--thin' },
  noThin: { option: '--no-thin' },
  quiet: { option: '--quiet' },
  verbose: { option: '--verbose' },
  progress: { option: '--progress' },
  recurseSubmodules: {
    option: '--recurse-submodules',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  noRecurseSubmodules: { option: '--no-recurse-submodules' },
  verify: { option: '--verify' },
  noVerify: { option: '--no-verify' },
  ipv4: { option: '--ipv4' },
  ipv6: { option: '--ipv6' },
};

/**
 * @see GitPushDocumentation {@link https://git-scm.com/docs/git-push}
 */
export class GitPushCommand extends CommandBuilder {
  public readonly command = {
    git: GitPushCommand.commandAccessorFactory<
      typeof gitCommandOptions,
      GitPushCommand
    >('git', 'git', gitCommandOptions, this),
    push: GitPushCommand.commandAccessorFactory<
      typeof gitPushCommandOptions,
      GitPushCommand
    >('push', 'push', gitPushCommandOptions, this),
  };

  public readonly option = this.command.push.option;

  protected readonly commandIndex = ['git', 'push'];
}
