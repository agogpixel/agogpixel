import { Manifest } from './models';

/**
 * Get variants to build.
 *
 * @param manifest Manifest.
 * @param variant Specified variant.
 */
export function getVariantsToBuild(manifest: Manifest, variant: string): string[] {
  const availableVariants = Object.keys(manifest.variants || {});
  availableVariants.push('default'); // Always build default last if building all (for latest tag).

  const variantsToBuild: string[] = [];

  if (variant) {
    if (!availableVariants.includes(variant)) {
      throw new Error(`Invalid variant specified: ${variant}. Available variants are: ${JSON.stringify(availableVariants, null, 2)}`)
    }

    variantsToBuild.push(variant);
  } else {
    variantsToBuild.push(...availableVariants);
  }

  return variantsToBuild;
}
