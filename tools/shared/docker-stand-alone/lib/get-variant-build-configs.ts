import { Manifest, Variant, VariantBuildConfig } from './models';

/**
 * Get variant build configurations.
 *
 * @param manifest Manifest.
 * @param variants Variants to build.
 * @param buildArgs Custom build arguments.
 */
export function getVariantBuildConfigs(manifest: Manifest, variants: string[], buildArgs: Record<string, string>): VariantBuildConfig[] {
  const defaultDockerfile = manifest.dockerfile || './Dockerfile';
  const defaultContext = manifest.context || '.';
  const defaultBuildArgs = manifest.buildArgs || {};
  const defaultScripts = manifest.scripts || [];
  const defaultScriptsDestination = manifest.scriptsDestination || './scripts';

  const variantsMap = manifest.variants || {};

  return variants.map((name) => {
    const config: Variant = name !== 'default' ? (variantsMap[name] || { name }) : { ...manifest, name };

    const variantBuildArgs = config.buildArgs || {};
    const variantScripts = config.scripts || [];

    return {
      name: config.name,
      dockerfile: config.dockerfile || defaultDockerfile,
      context: config.context || defaultContext,
      buildArgs: { ...defaultBuildArgs, ...variantBuildArgs, ...buildArgs },
      scripts: [...new Set([...defaultScripts, ...variantScripts])],
      scriptsDestination: config.scriptsDestination || defaultScriptsDestination,
    };
  });
}
