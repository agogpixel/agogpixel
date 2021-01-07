/**
 * Docker stand-alone affected options schema.
 */
export interface Schema {
  /**
   * Project filter.
   */
  project?: string[];

  /**
   * Diff base.
   */
  base?: string;

  /**
   * Diff head.
   */
  head?: string;

  /**
   * Build image flag.
   */
  build?: boolean;

  /**
   * Commit & push flag.
   */
  commit?: boolean;

  /**
   * Test image flag.
   */
  test?: boolean;

  /**
   * Tag image flag.
   */
  tag?: boolean;

  /**
   * Push image flag.
   */
  push?: boolean;
}
