import { Tree } from '@nrwl/devkit';

/**
 * Affected configuration.
 */
export interface AffectedConfig {
  /**
   * Virtual file system tree.
   */
  host: Tree;

  /**
   * Project filter.
   */
  filter: string[];

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
