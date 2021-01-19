import {
  CommandBuilder,
  OptionArgumentRequirement,
  OptionArgumentSeparator,
  OptionOccurrence,
} from '../../command-builder';

import { dockerCommandOptions } from './docker';

/**
 * @see DockerBuildDocumentation {@link https://docs.docker.com/engine/reference/commandline/build/}
 */
const dockerBuildCommandOptions = {
  addHost: {
    option: '--add-host',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
    occurrence: OptionOccurrence.Multiple,
  },
  buildArg: {
    option: '--build-arg',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
    occurrence: OptionOccurrence.Multiple,
  },
  cacheFrom: {
    option: '--cache-from',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
    occurrence: OptionOccurrence.Multiple,
  },
  disableContentTrust: { option: '--disable-content-trust' },
  file: {
    option: '--file',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
  },
  iidfile: {
    option: '--iidfile',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
  },
  isolation: {
    option: '--isolation',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
  },
  label: {
    option: '--label',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
    occurrence: OptionOccurrence.Multiple,
  },
  network: {
    option: '--network',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
  },
  noCache: { option: '--no-cache' },
  output: {
    option: '--output',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
  },
  platform: {
    option: '--platform',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
  },
  progress: {
    option: '--progress',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
  },
  pull: { option: '--pull' },
  quiet: { option: '--quiet' },
  secret: {
    option: '--secret',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
  },
  ssh: {
    option: '--ssh',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
  },
  tag: {
    option: '--tag',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
    occurrence: OptionOccurrence.Multiple,
  },
  target: {
    option: '--target',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
  },
};

/**
 * @see DockerBuildDocumentation {@link https://docs.docker.com/engine/reference/commandline/build/}
 */
export class DockerBuildCommand extends CommandBuilder {
  public readonly command = {
    docker: DockerBuildCommand.commandAccessorFactory<
      typeof dockerCommandOptions,
      DockerBuildCommand
    >('docker', 'docker', dockerCommandOptions, this),
    build: DockerBuildCommand.commandAccessorFactory<
      typeof dockerBuildCommandOptions,
      DockerBuildCommand
    >('build', 'build', dockerBuildCommandOptions, this),
  };

  public readonly option = this.command.build.option;

  protected readonly commandIndex = ['docker', 'build'];
}