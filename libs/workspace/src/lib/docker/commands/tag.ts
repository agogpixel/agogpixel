import { CommandBuilder } from '../../command-builder';

import { dockerCommandOptions } from './docker';

/**
 * @see DockerTagDocumentation {@link https://docs.docker.com/engine/reference/commandline/tag/}
 */
const dockerTagCommandOptions = {};

/**
 * @see DockerTagDocumentation {@link https://docs.docker.com/engine/reference/commandline/tag/}
 */
export class DockerTagCommand extends CommandBuilder {
  public readonly command = {
    docker: DockerTagCommand.commandAccessorFactory<
      typeof dockerCommandOptions,
      DockerTagCommand
    >('docker', 'docker', dockerCommandOptions, this),
    tag: DockerTagCommand.commandAccessorFactory<
      typeof dockerTagCommandOptions,
      DockerTagCommand
    >('tag', 'tag', dockerTagCommandOptions, this),
  };

  public readonly option = this.command.tag.option;

  protected readonly commandIndex = ['docker', 'tag'];
}
