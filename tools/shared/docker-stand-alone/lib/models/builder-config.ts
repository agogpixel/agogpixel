import { Tree } from '@nrwl/devkit';

/**
 * Builder configuration.
 */
export interface BuilderConfig {
  /**
   * Project name.
   */
  projectName: string;

  /**
   * Specific variant to build.
   */
  variant: string;

  /**
   * Docker custom build arguments.
   */
  buildArgs: Record<string, string>;

  /**
   * Virtual file system tree.
   */
  host: Tree;
}
