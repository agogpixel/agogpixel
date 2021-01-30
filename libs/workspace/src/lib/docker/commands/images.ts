import {
  CommandBuilder,
  OptionArgumentRequirement,
  OptionArgumentSeparator,
} from '../../command-builder';

import { dockerCommandOptions } from './docker';

/**
 * @see DockerImagesDocumentation {@link https://docs.docker.com/engine/reference/commandline/images/}
 * @internal
 */
const dockerImagesCommandOptions = {
  all: { option: '--all' },
  digests: { option: '--digests' },
  filter: {
    option: '--filter',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
  },
  format: {
    option: '--format',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
  },
  noTrunc: { option: '--no-trunc' },
  quiet: { option: '--quiet' },
};

/**
 * Docker images command.
 * @see DockerImagesDocumentation {@link https://docs.docker.com/engine/reference/commandline/images/}
 */
export class DockerImagesCommand extends CommandBuilder {
  /**
   * Command accessor map.
   */
  public readonly command = {
    /**
     * Docker command accessor.
     */
    docker: DockerImagesCommand.commandAccessorFactory<
      typeof dockerCommandOptions,
      DockerImagesCommand
    >('docker', 'docker', dockerCommandOptions, this),

    /**
     * Images sub-command accessor.
     */
    images: DockerImagesCommand.commandAccessorFactory<
      typeof dockerImagesCommandOptions,
      DockerImagesCommand
    >('images', 'images', dockerImagesCommandOptions, this),
  };

  /**
   * Images sub-command option accessor.
   */
  public readonly option = this.command.images.option;

  /**
   * Command name order.
   */
  protected readonly commandIndex = ['docker', 'images'];
}
