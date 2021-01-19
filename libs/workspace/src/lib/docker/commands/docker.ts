import {
  CommandBuilder,
  OptionArgumentRequirement,
  OptionArgumentSeparator,
  OptionOccurrence,
} from '../../command-builder';

/**
 * @see DockerDocumentation {@link https://docs.docker.com/engine/reference/commandline/cli/}
 */
export const dockerCommandOptions = {
  config: {
    option: '--config',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
  },
  context: {
    option: '--context',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
  },
  debug: { option: '--debug' },
  help: { option: '--help' },
  host: {
    option: '--host',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
    occurrence: OptionOccurrence.Multiple,
  },
  logLevel: {
    option: '--log-level',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
  },
  tls: { option: '--tls' },
  tlscacert: {
    option: '--tlscacert',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
  },
  tlscert: {
    option: '--tlscert',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
  },
  tlskey: {
    option: '--tlskey',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
  },
  tlsverify: { option: '--tlsverify' },
  version: { option: '--version' },
};

/**
 * @see DockerDocumentation {@link https://docs.docker.com/engine/reference/commandline/cli/}
 */
export class DockerCommand extends CommandBuilder {
  public readonly command = {
    docker: DockerCommand.commandAccessorFactory<
      typeof dockerCommandOptions,
      DockerCommand
    >('docker', 'docker', dockerCommandOptions, this),
  };

  public readonly option = this.command.docker.option;

  protected readonly commandIndex = ['docker'];
}
