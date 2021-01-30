/**
 * Gam build library.
 * @copyright Copyright © 2021, AgogPixel - All rights reserved.
 * @author Tristan Bonsor <kidthales@agogpixel.com>
 * @packageDocumentation
 * @module gam/build
 */
import { dockerBuild } from '@agogpixel/workspace';
import { Tree } from '@nrwl/devkit';

import { normalize } from 'path';

import { ProjectVariantManifest } from './models';

import { getProjectMetadata, parseVariants } from './shared';

/**
 * Build Gam project.
 * @param host Virtual file system tree.
 * @param projectName Gam project name.
 * @param variants Variants to build. Specifying a boolean value will build all or
 * none.
 * @returns Build results.
 * @throws Error
 */
export function build(
  host: Tree,
  projectName: string,
  variants: boolean | string[] = false
): {
  result: number;
  variants: Record<string, number>;
} {
  const { workspace, manifest } = getProjectMetadata(host, projectName);
  const variantsToBuild = parseVariants(manifest, variants);

  const basePath = normalize(
    `${host.root}/${workspace.projects[projectName].root}`
  );

  console.info(`Start Project: ${projectName}\n`);

  const variantResults = buildVariants(basePath, variantsToBuild);

  console.info(`\nStart Default\n`);
  const result = buildImage(basePath, manifest);
  console.info(`\nFinish Default\n`);

  console.info(`\nFinish Project: ${projectName}\n`);

  return {
    result,
    variants: variantResults,
  };
}

/**
 * Build variants.
 * @param basePath Base project path.
 * @param variants Variant manifests.
 * @returns Variant name to build result map.
 * @internal
 */
function buildVariants(
  basePath: string,
  variants: Record<string, ProjectVariantManifest>
): Record<string, number> {
  const results: Record<string, number> = {};

  Object.entries(variants).forEach(([name, manifest]) => {
    console.info(`\nStart Variant: ${name}\n`);
    results[name] = buildImage(basePath, manifest);
    console.info(`Finish Variant: ${name}\n`);
  });

  return results;
}

/**
 * Build image.
 * @param basePath Base project path.
 * @param manifest Variant manifest.
 * @returns Build result.
 * @internal
 */
function buildImage(
  basePath: string,
  manifest: ProjectVariantManifest
): number {
  const context = normalize(`${basePath}/${manifest.build.context}`);
  const result = dockerBuild(context, manifest.build.options);

  result.sanitizedStdout.forEach((line) => console.info(line));

  return result.status;
}
