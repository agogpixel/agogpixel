import { Source } from '@angular-devkit/schematics';

import { Family } from './family.enum';

/**
 * Docker stand-alone project generator configuration.
 */
export interface GeneratorConfig {
  /**
   * Project name
   */
  projectName: string;

  /**
   * Project path from workspace root.
   */
  projectPathFromWorkspaceRoot: string;

  /**
   * Image name.
   */
  imageName: string;

  /**
   * Image family.
   */
  imageFamily: Family;

  /**
   * Template source.
   */
  templateSource: Source;
}
