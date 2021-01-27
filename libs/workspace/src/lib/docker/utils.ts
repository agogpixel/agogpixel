/**
 * Docker utilities.
 * @copyright Copyright © 2021, AgogPixel - All rights reserved.
 * @author Tristan Bonsor <kidthales@agogpixel.com>
 * @packageDocumentation
 * @module workspace/docker/utils
 */
import { CommandProcess, CommandProcessSnapshot } from '../command-builder';
import { maxBufferSize as maxBuffer } from '../shared';

import { DockerBuildCommand } from './commands';

/**
 * Docker build options.
 * @see dockerBuild {@link dockerBuild}
 * @see dockerBuildAsync {@link dockerBuildAsync}
 */
export interface DockerBuildOptions {
  addHost?: string[];
  buildArg?: string[];
  cacheFrom?: string[];
  disableContentTrust?: boolean;
  file?: string;
  iidfile?: string;
  isolation?: string;
  label?: string[];
  network?: string;
  noCache?: boolean;
  output?: string;
  platform?: string;
  progress?: string;
  pull?: boolean;
  quiet?: boolean;
  secret?: string;
  ssh?: string;
  tag?: string[];
  target?: string;
}

/**
 * Build docker image (synchronous).
 *
 * @param context Build context.
 * @param options Build options.
 */
export function dockerBuild(
  context: string,
  options: DockerBuildOptions = {}
): CommandProcessSnapshot {
  return buildDockerBuildCommand(context, options).spawnSync({ maxBuffer });
}

/**
 * Build docker image (asynchronous).
 *
 * @param context Build context.
 * @param options Build options.
 */
export function dockerBuildAsync(
  context: string,
  options: DockerBuildOptions = {}
): CommandProcess {
  return buildDockerBuildCommand(context, options).spawn({});
}

/**
 * Build docker build command from context & options.
 *
 * @param context Build context.
 * @param options Build options.
 */
function buildDockerBuildCommand(
  context: string,
  options: DockerBuildOptions
): DockerBuildCommand {
  const buildCommand = new DockerBuildCommand();
  buildCommand.parameter(context);

  const addHost = options.addHost || [];
  addHost.forEach((host) => buildCommand.option.addHost(host));

  const buildArg = options.buildArg || [];
  buildArg.forEach((arg) => buildCommand.option.buildArg(arg));

  const cacheFrom = options.cacheFrom || [];
  cacheFrom.forEach((cache) => buildCommand.option.cacheFrom(cache));

  if (options.disableContentTrust) {
    buildCommand.option.disableContentTrust();
  }

  if (options.file) {
    buildCommand.option.file(options.file);
  }

  if (options.iidfile) {
    buildCommand.option.iidfile(options.iidfile);
  }

  if (options.isolation) {
    buildCommand.option.isolation(options.isolation);
  }

  const label = options.label || [];
  label.forEach((l) => buildCommand.option.label(l));

  if (options.network) {
    buildCommand.option.network(options.network);
  }

  if (options.noCache) {
    buildCommand.option.noCache();
  }

  if (options.output) {
    buildCommand.option.output(options.output);
  }

  if (options.platform) {
    buildCommand.option.platform(options.platform);
  }

  if (options.progress) {
    buildCommand.option.progress(options.progress);
  }

  if (options.pull) {
    buildCommand.option.pull();
  }

  if (options.quiet) {
    buildCommand.option.quiet();
  }

  if (options.secret) {
    buildCommand.option.secret(options.secret);
  }

  if (options.ssh) {
    buildCommand.option.ssh(options.ssh);
  }

  const tag = options.tag || [];
  tag.forEach((t) => buildCommand.option.tag(t));

  if (options.target) {
    buildCommand.option.target(options.target);
  }

  return buildCommand;
}
