/**
 * Gam shared library.
 * @copyright Copyright © 2021, AgogPixel - All rights reserved.
 * @author Tristan Bonsor <kidthales@agogpixel.com>
 * @packageDocumentation
 * @module gam/shared
 */
import { Tree, readJson } from '@nrwl/devkit';

import {
  ProjectManifest,
  ProjectMetadata,
  ProjectVariantManifest,
  Workspace,
} from './models';

/**
 * Workspace JSON file.
 */
export const workspaceJsonFile = 'gam.json';

/**
 * Project manifest JSON file.
 */
export const projectManifestJsonFile = 'gam-manifest.json';

/**
 * Get workspace metadata.
 * @param host Virtual file system tree.
 * @returns Workspace metadata.
 * @throws Error
 */
export function getWorkspaceMetadata(host: Tree): Workspace {
  return readJson(host, workspaceJsonFile);
}

/**
 * Get project manifest.
 * @param host Virtual file system tree.
 * @param projectName Project name.
 * @returns Project manifest.
 * @throws Error
 */
export function getProjectManifest(
  host: Tree,
  projectName: string
): ProjectManifest {
  const workspace = getWorkspaceMetadata(host);
  const project = workspace.projects[projectName];

  if (!project) {
    throw new Error(`Project not found: ${projectName}`);
  }

  return readJson(host, `${project.root}/${projectManifestJsonFile}`);
}

/**
 * Get project metadata.
 * @param host Virtual file system tree.
 * @param projectName Project name.
 * @returns Project metadata.
 * @throws Error
 */
export function getProjectMetadata(
  host: Tree,
  projectName: string
): ProjectMetadata {
  return {
    workspace: getWorkspaceMetadata(host),
    manifest: getProjectManifest(host, projectName),
  };
}

/**
 * Get project variant names.
 * @param manifest Gam project manifest data.
 * @returns Variant names.
 */
export function getProjectVariantNames(manifest: ProjectManifest): string[] {
  const variants = manifest.variants;
  return variants ? Object.keys(variants) : [];
}

/**
 * Get project variant manifests.
 * @param manifest Gam project manifest data.
 * @param variants Variant names.
 * @returns Variant manifest map.
 */
export function getProjectVariantManifests(
  manifest: ProjectManifest,
  variants: string[]
): Record<string, ProjectVariantManifest> {
  const variantManifests = {};
  variants.forEach(
    (variant) => (variantManifests[variant] = manifest.variants[variant])
  );
  return variantManifests;
}

/**
 * Parse variants.
 * @param manifest Gam project manifest data.
 * @param variants Variant names. Specifying a boolean value will build all or
 * none.
 * @returns Variant manifests.
 * @throws Error
 */
export function parseVariants(
  manifest: ProjectManifest,
  variants: boolean | string[]
): Record<string, ProjectVariantManifest> {
  const availableVariants = getProjectVariantNames(manifest);
  let parsedVariants: string[] = [];

  if (Array.isArray(variants)) {
    variants.forEach((variant) => {
      if (!availableVariants.includes(variant)) {
        throw new Error(`Variant: ${variant} not found`);
      }

      parsedVariants.push(variant);
    });
  } else if (variants) {
    parsedVariants = availableVariants;
  }

  return getProjectVariantManifests(manifest, parsedVariants);
}
