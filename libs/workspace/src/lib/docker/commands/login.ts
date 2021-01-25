import {
  CommandBuilder,
  OptionArgumentRequirement,
  OptionArgumentSeparator,
} from '../../command-builder';

import { dockerCommandOptions } from './docker';

/**
 * @see DockerLoginDocumentation {@link https://docs.docker.com/engine/reference/commandline/login/}
 * @internal
 */
const dockerLoginCommandOptions = {
  password: {
    option: '--password',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
  },
  passwordStdin: { option: '--password-stdin' },
  username: {
    option: '--username',
    seperator: OptionArgumentSeparator.Space,
    argRequired: OptionArgumentRequirement.Required,
  },
};

/**
 * Docker login command.
 * @see DockerLoginDocumentation {@link https://docs.docker.com/engine/reference/commandline/login/}
 */
export class DockerLoginCommand extends CommandBuilder {
  /**
   * Command accessor map.
   */
  public readonly command = {
    /**
     * Docker command accessor.
     */
    docker: DockerLoginCommand.commandAccessorFactory<
      typeof dockerCommandOptions,
      DockerLoginCommand
    >('docker', 'docker', dockerCommandOptions, this),

    /**
     * Login sub-command accessor.
     */
    login: DockerLoginCommand.commandAccessorFactory<
      typeof dockerLoginCommandOptions,
      DockerLoginCommand
    >('login', 'login', dockerLoginCommandOptions, this),
  };

  /**
   * Login sub-command option accessor.
   */
  public readonly option = this.command.login.option;

  /**
   * Command name order.
   */
  protected readonly commandIndex = ['docker', 'login'];
}
