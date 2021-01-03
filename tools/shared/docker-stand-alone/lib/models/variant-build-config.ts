/**
 * Variant build configuration.
 */
export interface VariantBuildConfig {
  /**
   * Variant name.
   */
  name: string;

  /**
   * Path to dockerfile, relative to manifest location.
   */
  dockerfile: string;

  /**
   * Path to context, relative to manifest location.
   */
  context: string;

  /**
   * Build arguments resulting from merge of image default, variant default, &
   * custom build arguments.
   */
  buildArgs: Record<string, string>;

  /**
   * Scripts to be copied. Results from merge of image default & variant
   * scripts.
   */
  scripts: string[];

  /**
   * Destination for copied scripts, relative to manifest location.
   */
  scriptsDestination: string;
}
