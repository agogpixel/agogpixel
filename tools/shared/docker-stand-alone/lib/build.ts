import { ChildProcess, spawn } from 'child_process';
import { normalize } from 'path';

import { copyScripts } from './copy-scripts';
import { getBuildCommand } from './get-build-command';
import { getProjectMetadata } from './get-project-metadata';
import { getVariantBuildConfigs } from './get-variant-build-configs';
import { getVariantsToBuild } from './get-variants-to-build';
import { BuilderConfig, dockerStandAloneScriptsPath } from './models';

/**
 * Asynchronously build docker stand-alone images.
 *
 * @param config Builder configuration.
 */
export async function build(config: BuilderConfig): Promise<() => void> {
  const { buildArgs, host, projectName, variant } = config;

  const { workspace, manifest } = getProjectMetadata(host, projectName);

  const projectPath = `${host.root}/${workspace.root}`;

  const imageName = manifest.name;
  const imageFamily = manifest.family;

  const scriptsSourcePath = `${host.root}/${dockerStandAloneScriptsPath}`;

  console.info(`Gathering variant configurations for ${manifest.name}...\n`);

  const variantsToBuild = getVariantsToBuild(manifest, variant);
  const variantBuildConfigs = getVariantBuildConfigs(manifest, variantsToBuild, buildArgs);

  const runs: { process: ChildProcess; code: number; }[] = []

  let runIndex = 0;

  /**
   * Copies scripts & runs builds synchronously within an async context via
   * recursive closure.
   *
   * @param resolve Subscriber from workspace generator cli context. Invoked
   * with builder output that is a success only if all builds where successful.
   */
  async function runner(resolve: (value?: () => void) => void, reject: (reason?: any) => void): Promise<void> {
    const variantBuildConfig = variantBuildConfigs[runIndex];

    console.info(`################################################################################\n# Variant: ${variantBuildConfig.name}\n################################################################################\n`);

    const scriptsDestinationPath = normalize(`${projectPath}/${variantBuildConfig.scriptsDestination}`);
    const scripts = variantBuildConfig.scripts;

    console.info(`Copying scripts: ${JSON.stringify(scripts, undefined, 2)}\n`);

    await copyScripts(scriptsSourcePath, scriptsDestinationPath, imageFamily, scripts);

    const { command, args } = getBuildCommand(imageName, projectPath, variantBuildConfig);

    console.info(`Running: ${command} ${args.join(' ')}\n`);

    // Track docker build execution state & output from child process.
    const run = runs[runIndex] = { process: spawn(command, args), code: undefined };

    run.process.stdout.on('data', (data) => {
      console.info(data.toString());
    });

    run.process.stderr.on('data', (data) => {
      console.log(data.toString());
    });

    run.process.on('close', (code) => {
      // Process for docker build closed, track exit code.
      run.code = code;

      if (++runIndex >= variantsToBuild.length) {
        // All build runs complete.
        const success = runs.every(({ code }) => code === 0);

        if (!success) {
          reject(`Error occured during a build run: ${JSON.stringify(runs.map(({ code }) => ({ code })), undefined, 2)}`)
          return;
        }

        console.info('OK');

        resolve(() => undefined);
        return;
      }

      // Run the next build.
      runner(resolve, reject);
    });
  }

  return new Promise<() => void>((resolve, reject) => runner(resolve, reject));
}
