import {
  CommandBuilder,
  OptionArgumentRequirement,
  OptionArgumentSeparator,
} from '../../command-builder';

import { dockerCommandOptions } from './docker';

/**
 * @see DockerLoginDocumentation {@link https://docs.docker.com/engine/reference/commandline/login/}
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
 * @see DockerLoginDocumentation {@link https://docs.docker.com/engine/reference/commandline/login/}
 */
export class DockerLoginCommand extends CommandBuilder {
  public readonly command = {
    docker: DockerLoginCommand.commandAccessorFactory<
      typeof dockerCommandOptions,
      DockerLoginCommand
    >('docker', 'docker', dockerCommandOptions, this),
    login: DockerLoginCommand.commandAccessorFactory<
      typeof dockerLoginCommandOptions,
      DockerLoginCommand
    >('login', 'login', dockerLoginCommandOptions, this),
  };

  public readonly option = this.command.login.option;

  protected readonly commandIndex = ['docker', 'login'];
}
