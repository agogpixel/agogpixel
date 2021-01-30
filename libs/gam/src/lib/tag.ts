/**
 * Gam tag library.
 * @copyright Copyright © 2021, AgogPixel - All rights reserved.
 * @author Tristan Bonsor <kidthales@agogpixel.com>
 * @packageDocumentation
 * @module gam/tag
 */
import { dockerImageExists, dockerTag } from '@agogpixel/workspace';
import { Tree } from '@nrwl/devkit';

import { ProjectVariantManifest } from './models';
import { getProjectMetadata, parseVariants } from './shared';

/**
 * Tag docker images in Gam project.
 * @param host Virtual file system tree.
 * @param tags Tags to apply.
 * @param projectName Gam project name.
 * @param variants Variants to tag. Specifying a boolean value will tag all or
 * none.
 * @returns Generated tags.
 * @throws Error
 */
export function tag(
  host: Tree,
  tags: string[],
  projectName: string,
  variants: boolean | string[] = false
): string[] {
  const { workspace, manifest } = getProjectMetadata(host, projectName);
  const variantsToTag = parseVariants(manifest, variants);

  console.info(`Start Project: ${projectName}\n\n`);

  const generatedTags = tagVariants(
    workspace.organization,
    tags,
    variantsToTag
  );

  console.info(`\nStart Default\n`);
  generatedTags.concat(tagImage(workspace.organization, tags, manifest));
  console.info(`\nFinish Default\n`);

  console.info(`\nFinish Project: ${projectName}\n`);

  return generatedTags;
}

/**
 * Tag variant images.
 * @param organization Organization.
 * @param tags Tags to apply.
 * @param variants Gam project variant manifest data.
 * @returns Generated tags.
 * @throws Error
 * @internal
 */
function tagVariants(
  organization: string,
  tags: string[],
  variants: Record<string, ProjectVariantManifest>
): string[] {
  const results: string[] = [];

  Object.entries(variants).forEach(([variantName, variantManifet]) => {
    console.info(`\nStart Variant: ${variantName}\n`);
    results.concat(tagImage(organization, tags, variantManifet, true));
    console.info(`Finish Variant: ${variantName}\n`);
  });

  return results;
}

/**
 * Tag image.
 * @param organization Organization.
 * @param tags Tags to apply.
 * @param manifest Gam project manifest data.
 * @param variant True if tagging variant, false otherwise.
 * @returns Generated tags.
 * @throws Error
 * @internal
 */
function tagImage(
  organization: string,
  tags: string[],
  manifest: ProjectVariantManifest,
  variant: boolean = false
): string[] {
  const sources = manifest.build.options.tag;

  if (!sources || !sources.length) {
    throw new Error('Source tags not found');
  }

  const results: string[] = [];

  sources.forEach((source) => {
    if (!dockerImageExists(source)) {
      throw new Error(`Source tag: ${source} not found`);
    }

    const targets = tags.map((t) => {
      const postfix = variant ? `-${t}` : `:${t}`;
      const name = variant ? source : source.split(':')[0];
      return `${organization}/${name}${postfix}`;
    });

    dockerTag(source, targets);

    results.concat(targets);
  });

  return results;
}
