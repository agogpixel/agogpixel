import {
  CommandBuilder,
  OptionArgumentRequirement,
  OptionArgumentSeparator,
  OptionOccurrence,
} from '../../command-builder';

import { dockerCommandOptions } from './docker';

/**
 * @see DockerPullDocumentation {@link https://docs.docker.com/engine/reference/commandline/pull/}
 * @internal
 */
const dockerPullCommandOptions = {
  allTags: { option: '--all-tags' },
  disableContentTrust: { option: '--disable-content-trust' },
  platform: {
    option: '--platform',
    seperator: OptionArgumentSeparator.Space,
    occurrence: OptionOccurrence.Single,
    argRequirement: OptionArgumentRequirement.Required,
  },
  quiet: { option: '--quiet' },
};

/**
 * Docker pull command.
 * @see DockerPullDocumentation {@link https://docs.docker.com/engine/reference/commandline/pull/}
 */
export class DockerPullCommand extends CommandBuilder {
  /**
   * Command accessor map.
   */
  public readonly command = {
    /**
     * Docker command accessor.
     */
    docker: DockerPullCommand.commandAccessorFactory<
      typeof dockerCommandOptions,
      DockerPullCommand
    >('docker', 'docker', dockerCommandOptions, this),

    /**
     * Pull sub-command accessor.
     */
    pull: DockerPullCommand.commandAccessorFactory<
      typeof dockerPullCommandOptions,
      DockerPullCommand
    >('pull', 'pull', dockerPullCommandOptions, this),
  };

  /**
   * Pull sub-command option accessor.
   */
  public readonly option = this.command.pull.option;

  /**
   * Command name order.
   */
  protected readonly commandIndex = ['docker', 'pull'];
}
