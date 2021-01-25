import {
  CommandBuilder,
  OptionArgumentRequirement,
  OptionArgumentSeparator,
  OptionOccurrence,
} from '../../command-builder';

/**
 * @see DockerDocumentation {@link https://docs.docker.com/engine/reference/commandline/cli/}
 * @internal
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
 * Docker command.
 * @see DockerDocumentation {@link https://docs.docker.com/engine/reference/commandline/cli/}
 */
export class DockerCommand extends CommandBuilder {
  /**
   * Command accessor map.
   */
  public readonly command = {
    /**
     * Docker command accessor.
     */
    docker: DockerCommand.commandAccessorFactory<
      typeof dockerCommandOptions,
      DockerCommand
    >('docker', 'docker', dockerCommandOptions, this),
  };

  /**
   * Docker command option accessor.
   */
  public readonly option = this.command.docker.option;

  /**
   * Command name order.
   */
  protected readonly commandIndex = ['docker'];
}
