import { Tree } from '@nrwl/devkit';

import { getManifest } from './get-manifest';
import { getWorkspace } from './get-workspace';
import { ProjectMetadata } from './models';

/**
 * Get docker stand-alone project metadata.
 *
 * @param host Virtual file system tree.
 * @param projectName Project name.
 */
export function getProjectMetadata(
  host: Tree,
  projectName: string
): ProjectMetadata {
  return {
    workspace: getWorkspace(host).projects[projectName],
    manifest: getManifest(host, projectName),
  };
}
