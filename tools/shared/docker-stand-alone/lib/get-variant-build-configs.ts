import { getVariantKeys } from './get-variant-keys';
import { Manifest, Variant, VariantBuildConfig } from './models';

/**
 * Get variant build configurations.
 *
 * @param manifest Manifest.
 * @param variant Specific variant to build.
 * @param buildArgs Custom build arguments.
 */
export function getVariantBuildConfigs(
  manifest: Manifest,
  variant?: string,
  buildArgs: Record<string, string> = {}
): VariantBuildConfig[] {
  const availableVariants = getVariantKeys(manifest);
  const variants: string[] = [];

  if (variant) {
    if (!availableVariants.includes(variant)) {
      throw new Error(
        `Invalid variant specified: ${variant}. Available variants are: ${JSON.stringify(
          availableVariants,
          null,
          2
        )}`
      );
    }

    variants.push(variant);
  } else {
    variants.push(...availableVariants);
  }

  const defaultDockerfile = manifest.dockerfile || './Dockerfile';
  const defaultContext = manifest.context || '.';
  const defaultBuildArgs = manifest.buildArgs || {};
  const defaultScripts = manifest.scripts || [];
  const defaultScriptsDestination = manifest.scriptsDestination || './scripts';

  const variantsMap = manifest.variants || {};

  return variants.map((name) => {
    const config: Variant =
      name !== 'default' ? variantsMap[name] : { ...manifest, name };

    const variantBuildArgs = config.buildArgs || {};
    const variantScripts = config.scripts || [];

    return {
      key: name,
      name: config.name,
      dockerfile: config.dockerfile || defaultDockerfile,
      context: config.context || defaultContext,
      buildArgs: { ...defaultBuildArgs, ...variantBuildArgs, ...buildArgs },
      scripts: [...new Set([...defaultScripts, ...variantScripts])],
      scriptsDestination:
        config.scriptsDestination || defaultScriptsDestination,
    };
  });
}
