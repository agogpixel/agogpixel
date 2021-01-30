/**
 * Gam affected library.
 * @copyright Copyright © 2021, AgogPixel - All rights reserved.
 * @author Tristan Bonsor <kidthales@agogpixel.com>
 * @packageDocumentation
 * @module gam/affected
 */
import { gitGetChangedFiles } from '@agogpixel/workspace';
import { Tree } from '@nrwl/devkit';
import { normalize } from 'path';

import { getProjectManifest, getWorkspaceMetadata } from './shared';

/**
 * Get affected Gam projects.
 * @param host Virtual file system tree.
 * @param base Git base.
 * @param head Git head.
 * @returns Affected projects with variants.
 * @throws Error
 */
export function affected(
  host: Tree,
  base?: string,
  head?: string
): Record<
  string,
  {
    sync: boolean;
    variants: string[];
  }
> {
  const workspace = getWorkspaceMetadata(host);

  const changedFiles = gitGetChangedFiles(
    base || workspace.affected.defaultBase,
    head || 'HEAD'
  );

  const affectedArtifacts = getAffectedArtifacts(
    workspace.artifacts,
    changedFiles
  );

  const affectedProjects: Record<
    string,
    { sync: boolean; variants: string[] }
  > = {};

  /**
   * Test if project is affected by artifact changes.
   * @param artifacts Artifacts.
   * @returns True if affected, false otherwise.
   * @internal
   */
  function isProjectAffectedByArtifacts(
    artifacts: Record<string, string>
  ): boolean {
    return Object.keys(artifacts).some((artifact) =>
      affectedArtifacts.includes(artifact)
    );
  }

  /**
   * Add a project affected by artifact changes.
   * @param projectName Project name.
   * @returns void
   * @internal
   */
  function addProjectAffectedByArtifacts(projectName: string): void {
    if (!affectedProjects[projectName]) {
      affectedProjects[projectName] = {
        sync: true,
        variants: [],
      };
    }

    affectedProjects[projectName].sync = true;
  }

  /**
   * Test if project affected by context or dockerfile changes.
   * @param projectName Project name.
   * @param context Docker context.
   * @param dockerfile Dockerfile.
   * @returns True if affected, false otherwise.
   * @internal
   */
  function isProjectAffected(
    projectName: string,
    context: string,
    dockerfile?: string
  ): boolean {
    const contextPath = normalize(
      `${workspace.projects[projectName].root}/${context}`
    );

    if (changedFiles.some((changed) => changed.includes(contextPath))) {
      return true;
    }

    if (dockerfile) {
      const dockerfilePath = normalize(
        `${workspace.projects[projectName].root}/${dockerfile}`
      );
      return changedFiles.some((changed) => changed.includes(dockerfilePath));
    }

    return false;
  }

  /**
   * Add project affected by context or dockerfile changes.
   * @param projectName Project name.
   * @returns void
   * @internal
   */
  function addProjectAffected(projectName: string): void {
    if (!affectedProjects[projectName]) {
      affectedProjects[projectName] = {
        sync: false,
        variants: [],
      };
    }
  }

  Object.keys(workspace.projects).forEach((projectName) => {
    const manifest = getProjectManifest(host, projectName);

    if (isProjectAffectedByArtifacts(manifest.artifacts)) {
      addProjectAffectedByArtifacts(projectName);
    } else if (
      isProjectAffected(
        projectName,
        manifest.build.context,
        manifest.build.options.file
      )
    ) {
      addProjectAffected(projectName);
    }

    Object.entries(manifest.variants || {}).forEach(
      ([variantName, variantManifest]) => {
        if (isProjectAffectedByArtifacts(variantManifest.artifacts)) {
          addProjectAffectedByArtifacts(projectName);
          affectedProjects[projectName].variants.push(variantName);
        } else if (
          isProjectAffected(
            projectName,
            variantManifest.build.context,
            variantManifest.build.options.file
          )
        ) {
          addProjectAffected(projectName);
          affectedProjects[projectName].variants.push(variantName);
        }
      }
    );
  });

  return affectedProjects;
}

/**
 * Get affected artifacts.
 * @param artifacts Workspace artifact metadata.
 * @param changedFiles Changed files.
 * @returns Affected artifacts.
 * @internal
 */
function getAffectedArtifacts(
  artifacts: Record<string, string[]>,
  changedFiles: string[]
): string[] {
  return Object.entries(artifacts)
    .map(([name, paths]) => {
      for (let i = 0; i < paths.length; ++i) {
        const path = paths[i];

        if (changedFiles.some((changed) => changed.includes(path))) {
          return name;
        }
      }
    })
    .filter(Boolean);
}
