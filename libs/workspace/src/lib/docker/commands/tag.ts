import { CommandBuilder } from '../../command-builder';

import { dockerCommandOptions } from './docker';

/**
 * @see DockerTagDocumentation {@link https://docs.docker.com/engine/reference/commandline/tag/}
 * @internal
 */
const dockerTagCommandOptions = {};

/**
 * Docker tag command.
 * @see DockerTagDocumentation {@link https://docs.docker.com/engine/reference/commandline/tag/}
 */
export class DockerTagCommand extends CommandBuilder {
  /**
   * Command accessor map.
   */
  public readonly command = {
    /**
     * Docker command accessor.
     */
    docker: DockerTagCommand.commandAccessorFactory<
      typeof dockerCommandOptions,
      DockerTagCommand
    >('docker', 'docker', dockerCommandOptions, this),

    /**
     * Tag sub-command accessor.
     */
    tag: DockerTagCommand.commandAccessorFactory<
      typeof dockerTagCommandOptions,
      DockerTagCommand
    >('tag', 'tag', dockerTagCommandOptions, this),
  };

  /**
   * Tag sub-command option accessor.
   */
  public readonly option = this.command.tag.option;

  /**
   * Command name order.
   */
  protected readonly commandIndex = ['docker', 'tag'];
}
