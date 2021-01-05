import { normalize } from 'path';

import { BuildCommand, VariantBuildConfig } from './models';

/**
 * Get docker build command for use with `child_process.spawn`.
 *
 * @param imageName Image name.
 * @param projectPath Absolute project path
 * @param config Variant build configuration.
 */
export function getBuildCommand(
  imageName: string,
  projectPath: string,
  config: VariantBuildConfig
): BuildCommand {
  const cliContext = normalize(`${projectPath}/${config.context}`);
  const cliDockerfile = [
    '-f',
    normalize(`${projectPath}/${config.dockerfile}`),
  ];

  const variantName = config.name;
  const variantTag = `${imageName}:${variantName}`;

  const cliTags = [
    ...(variantName !== 'default'
      ? ['-t', variantTag, '-t', `${variantTag}-latest`]
      : ['-t', `${imageName}:latest`]),
  ];

  const cliBuildArgs = Object.entries(config.buildArgs).reduce<string[]>(
    (previous, [key, value]) => [...previous, '--build-arg', `${key}=${value}`],
    []
  );

  return {
    command: 'docker',
    args: ['build', ...cliDockerfile, ...cliTags, ...cliBuildArgs, cliContext],
  };
}
