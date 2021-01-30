/**
 * Gam models.
 * @copyright Copyright © 2021, AgogPixel - All rights reserved.
 * @author Tristan Bonsor <kidthales@agogpixel.com>
 * @packageDocumentation
 * @module gam/models
 */
import { DockerBuildOptions } from '@agogpixel/workspace';

/**
 * Gam workspace.
 */
export interface Workspace {
  /**
   * Organization name.
   */
  organization: string;

  /**
   * Affected Gam projects configuration.
   */
  affected: {
    /**
     * Default Git base.
     */
    defaultBase: string;
  };

  /**
   * Gam projects.
   */
  projects: Record<string, { root: string }>;

  /**
   * Map name to array of artifact paths.
   */
  artifacts: Record<string, string[]>;
}

/**
 * Gam project variant manifest.
 */
export interface ProjectVariantManifest {
  /**
   * Docker build configuration.
   */
  build: {
    /**
     * Docker build context.
     */
    context: string;

    /**
     * Docker build options.
     */
    options: DockerBuildOptions;
  };

  /**
   * Map name to destination directory path.
   */
  artifacts: Record<string, string>;
}

/**
 * Gam project manifest.
 */
export interface ProjectManifest extends ProjectVariantManifest {
  /**
   * Image variants.
   */
  variants?: Record<string, ProjectVariantManifest>;
}

/**
 * Gam project metadata.
 */
export interface ProjectMetadata {
  /**
   * Gam workspace.
   */
  workspace: Workspace;

  /**
   * Gam project manifest.
   */
  manifest: ProjectManifest;
}
