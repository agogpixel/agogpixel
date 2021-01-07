import { Tree, readJson } from '@nrwl/devkit';

import { getWorkspace } from './get-workspace';
import { Manifest } from './models';

/**
 * Get docker stand-alone project manifest.
 *
 * @param host Virtual file system tree.
 * @param projectName Project name.
 */
export function getManifest(host: Tree, projectName: string): Manifest {
  const workspace = getWorkspace(host);

  const project = workspace.projects[projectName];

  if (!project) {
    throw new Error(`Project not found: ${projectName}`);
  }

  return readJson(host, `${project.root}/manifest.json`);
}
