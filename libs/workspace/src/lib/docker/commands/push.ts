import { CommandBuilder } from '../../command-builder';

import { dockerCommandOptions } from './docker';

/**
 * @see DockerPushDocumentation {@link https://docs.docker.com/engine/reference/commandline/push/}
 */
const dockerPushCommandOptions = {
  allTags: { option: '--all-tags' },
  disableContentTrust: { option: '--disable-content-trust' },
  quiet: { option: '--quiet' },
};

/**
 * @see DockerPushDocumentation {@link https://docs.docker.com/engine/reference/commandline/push/}
 */
export class DockerPushCommand extends CommandBuilder {
  public readonly command = {
    docker: DockerPushCommand.commandAccessorFactory<
      typeof dockerCommandOptions,
      DockerPushCommand
    >('docker', 'docker', dockerCommandOptions, this),
    push: DockerPushCommand.commandAccessorFactory<
      typeof dockerPushCommandOptions,
      DockerPushCommand
    >('push', 'push', dockerPushCommandOptions, this),
  };

  public readonly option = this.command.push.option;

  protected readonly commandIndex = ['docker', 'push'];
}
