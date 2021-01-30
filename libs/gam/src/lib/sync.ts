/**
 * Gam sync library.
 * @copyright Copyright © 2021, AgogPixel - All rights reserved.
 * @author Tristan Bonsor <kidthales@agogpixel.com>
 * @packageDocumentation
 * @module gam/sync
 */
import { Tree } from '@nrwl/devkit';

import { sync as md5 } from 'md5-file';
import { basename, normalize } from 'path';

import { ProjectManifest } from './models';

import { getProjectMetadata } from './shared';

/**
 * Sync Gam artifacts.
 * @param host Virtual file system tree.
 * @param projectName Gam project name.
 * @returns New or updated artifact destination paths.
 * @throws Error
 */
export function sync(host: Tree, projectName: string): string[] {
  const { workspace, manifest } = getProjectMetadata(host, projectName);

  const basePath = workspace.projects[projectName].root;

  console.info(`Start Project: ${projectName}\n\n`);

  const destinations = getProjectArtifactDestinations(basePath, manifest);
  const artifactMap = getProjectArtifactMap(workspace.artifacts, destinations);
  const filteredArtifactMap = filterProjectArtifactMap(host, artifactMap);

  syncArtifacts(host, filteredArtifactMap);

  console.info(`\nFinish Project: ${projectName}\n`);

  return Object.values(filteredArtifactMap).reduce(
    (changes, paths) => changes.concat(Array.from(paths)),
    [] as string[]
  );
}

/**
 * Get artifact destinations for Gam project.
 * @param basePath Path to Gam project root.
 * @param manifest Gam project manifest.
 * @returns Map of artifact names to destination directory path sets.
 * @internal
 */
function getProjectArtifactDestinations(
  basePath: string,
  manifest: ProjectManifest
): Record<string, Set<string>> {
  const destinations: Record<string, Set<string>> = {};

  function mapArtifact(name: string, path: string) {
    if (!destinations[name]) {
      destinations[name] = new Set<string>();
    }

    destinations[name].add(normalize(`${basePath}/${path}`));
  }

  Object.entries(manifest.artifacts).forEach(([name, path]) =>
    mapArtifact(name, path)
  );

  Object.values(manifest.variants || {}).forEach((variantManifest) =>
    Object.entries(variantManifest.artifacts).forEach(([name, path]) =>
      mapArtifact(name, path)
    )
  );

  return destinations;
}

/**
 * Get artifact map for Gam project.
 * @param sources Artifact name to file paths map.
 * @param destinations Map of artifact names to destination directory path sets.
 * @returns Map of artifact file paths to destination file path sets.
 * @throws Error
 * @internal
 */
function getProjectArtifactMap(
  sources: Record<string, string[]>,
  destinations: Record<string, Set<string>>
): Record<string, Set<string>> {
  const artifactMap: Record<string, Set<string>> = {};

  Object.entries(destinations).forEach(([name, destinationPaths]) => {
    if (!sources[name]) {
      throw new Error(`Artifact: ${name} not found`);
    }

    sources[name].forEach((source) => {
      if (!artifactMap[source]) {
        artifactMap[source] = new Set<string>();
      }

      const filename = basename(source);

      destinationPaths.forEach((destinationPath) =>
        artifactMap[source].add(normalize(`${destinationPath}/${filename}`))
      );
    });
  });

  return artifactMap;
}

/**
 * Filter artifact map for Gam project.
 * @param host Virtual file system tree.
 * @param artifactMap Map of artifact file paths to destination file path sets.
 * @returns Filtered map of artifact file paths to destination file path sets.
 * @throws Error
 * @internal
 */
function filterProjectArtifactMap(
  host: Tree,
  artifactMap: Record<string, Set<string>>
): Record<string, Set<string>> {
  const filteredArtifactMap: Record<string, Set<string>> = {};

  Object.entries(artifactMap).forEach(([source, destinations]) => {
    if (!host.exists(source)) {
      throw new Error(`Artifact Source Path: ${source} not found`);
    }

    const sourceMd5 = md5(normalize(`${host.root}/${source}`));

    destinations.forEach((destination) => {
      if (
        !host.exists(destination) ||
        sourceMd5 !== md5(normalize(`${host.root}/${destination}`))
      ) {
        if (!filteredArtifactMap[source]) {
          filteredArtifactMap[source] = new Set<string>();
        }

        filteredArtifactMap[source].add(destination);
      }
    });
  });

  return filteredArtifactMap;
}

/**
 * Sync artifacts for Gam project.
 * @param host Virtual file system tree.
 * @param artifactMap Map of artifact file paths to destination file path sets.
 * @returns void
 * @throws Error
 * @internal
 */
function syncArtifacts(
  host: Tree,
  artifactMap: Record<string, Set<string>>
): void {
  Object.entries(artifactMap).forEach(([source, destinations]) => {
    destinations.forEach((destination) =>
      syncArtifact(host, source, destination)
    );
  });
}

/**
 * Sync artifact for Gam project.
 * @param host Virtual file system tree.
 * @param source Artifact source path.
 * @param destination Artifact destination path.
 * @returns void
 * @throws Error
 * @internal
 */
function syncArtifact(host: Tree, source: string, destination: string): void {
  console.log(`Syncing: ${source} to ${destination}\n`);
  host.write(destination, host.read(source));
}
