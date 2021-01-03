import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';

import { ChildProcess, spawn } from 'child_process';
import { normalize } from 'path';
import { from, Observable } from 'rxjs';

import { getProjectMetadata } from '../../workspace';

import { copyScripts } from './copy-scripts';
import { getBuildCommand } from './get-build-command';
import { getVariantBuildConfigs } from './get-variant-build-configs';
import { getVariantsToBuild } from './get-variants-to-build';
import { dockerStandAloneScriptsPath, Manifest } from './models';

/**
 * Asynchronously build docker stand-alone images.
 *
 * @param context Builder context.
 * @param variant Image variant.
 * @param buildArgs Custom build agruments.
 */
async function buildAsync(context: BuilderContext, variant: string, buildArgs: Record<string, string>): Promise<BuilderOutput> {
  const { workspace } = await getProjectMetadata(context);

  const projectPath = `${context.workspaceRoot}/${workspace.root}`;

  const manifest = require(`${projectPath}/manifest.json`) as Manifest;

  const imageName = manifest.name;
  const imageFamily = manifest.family;

  const scriptsSourcePath = `${context.workspaceRoot}/${dockerStandAloneScriptsPath}`;

  context.logger.info(`Gathering variant configurations for ${manifest.name}...\n`);

  const variantsToBuild = getVariantsToBuild(manifest, variant);
  const variantBuildConfigs = getVariantBuildConfigs(manifest, variantsToBuild, buildArgs);

  const runs: { process: ChildProcess; code: number; }[] = []

  let runIndex = 0;

  /**
   * Copies scripts & runs builds synchronously within an async context via
   * recursive closure.
   *
   * @param resolve Subscriber from cli builder context. Invoked with builder
   * output that is a success only if all builds where successful.
   */
  async function runner(resolve: (value?: BuilderOutput | PromiseLike<BuilderOutput>) => void): Promise<void> {
    const config = variantBuildConfigs[runIndex];

    context.logger.info(`################################################################################\n# Variant: ${config.name}\n################################################################################\n`);

    const scriptsDestinationPath = normalize(`${projectPath}/${config.scriptsDestination}`);
    const scripts = config.scripts;

    context.logger.info(`Copying scripts: ${JSON.stringify(scripts, undefined, 2)}\n`);

    await copyScripts(scriptsSourcePath, scriptsDestinationPath, imageFamily, scripts);

    const { command, args } = getBuildCommand(imageName, projectPath, config);

    context.logger.info(`Running: ${command} ${args.join(' ')}\n`);

    // Track docker build execution state & output from child process.
    const run = runs[runIndex] = { process: spawn(command, args), code: undefined };

    run.process.stdout.on('data', (data) => {
      context.logger.info(data.toString());
    });

    run.process.stderr.on('data', (data) => {
      context.logger.error(data.toString());
    });

    run.process.on('close', (code) => {
      // Process for docker build closed, track exit code.
      run.code = code;

      if (++runIndex >= variantsToBuild.length) {
        // All builds complete. Return control to builder cli with our success status.
        const success = runs.every(({ code }) => code === 0);

        if (success) {
          context.logger.info('OK');
        } else {
          context.logger.info('FAIL');
        }

        resolve({ success });

        return;
      }

      // Run the next build.
      runner(resolve);
    });
  }

  return new Promise<BuilderOutput>((resolve) => runner(resolve));
}

/**
 * Build docker stand-alone images.
 *
 * @param context Builder context.
 * @param variant Image variant.
 * @param buildArgs Custom build arguments.
 */
export function build(context: BuilderContext, variant?: string, buildArgs: Record<string, string> = {}): Observable<BuilderOutput> {
  return from(buildAsync(context, variant, buildArgs));
}
