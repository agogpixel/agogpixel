import { CommandBuilder } from '../../command-builder';

import { dockerCommandOptions } from './docker';

/**
 * @see DockerPushDocumentation {@link https://docs.docker.com/engine/reference/commandline/push/}
 * @internal
 */
const dockerPushCommandOptions = {
  allTags: { option: '--all-tags' },
  disableContentTrust: { option: '--disable-content-trust' },
  quiet: { option: '--quiet' },
};

/**
 * Docker push command.
 * @see DockerPushDocumentation {@link https://docs.docker.com/engine/reference/commandline/push/}
 */
export class DockerPushCommand extends CommandBuilder {
  /**
   * Command accessor map.
   */
  public readonly command = {
    /**
     * Docker command accessor.
     */
    docker: DockerPushCommand.commandAccessorFactory<
      typeof dockerCommandOptions,
      DockerPushCommand
    >('docker', 'docker', dockerCommandOptions, this),

    /**
     * Push sub-command accessor.
     */
    push: DockerPushCommand.commandAccessorFactory<
      typeof dockerPushCommandOptions,
      DockerPushCommand
    >('push', 'push', dockerPushCommandOptions, this),
  };

  /**
   * Push sub-command option accessor.
   */
  public readonly option = this.command.push.option;

  /**
   * Command name order.
   */
  protected readonly commandIndex = ['docker', 'push'];
}
