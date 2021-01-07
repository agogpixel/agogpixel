/**
 * Docker stand-alone builder options schema.
 */
export interface Schema {
  /**
   * Project name.
   */
  name: string;

  /**
   * Image variant name.
   */
  variant?: string;

  /**
   * Build arguments.
   */
  buildArgs?: string[];
}
