/**
 * Docker stand-alone project image variant.
 */
export interface Variant {
  /**
   * Variant name.
   */
  name: string;

  /**
   * Path to dockerfile, relative to manifest location.
   */
  dockerfile?: string;

  /**
   * Path to context, relative to manifest location.
   */
  context?: string;

  /**
   * Build arguments.
   */
  buildArgs?: Record<string, string>;

  /**
   * Script names from shared source.
   */
  scripts?: string[];

  /**
   * Scripts destination, relative to manifest location.
   */
  scriptsDestination?: string;
}
