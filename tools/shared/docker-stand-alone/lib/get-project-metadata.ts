import { Tree } from '@nrwl/devkit';

import { getManifest } from './get-manifest';
import { getWorkspace } from './get-workspace';
import { ProjectMetadata } from './models';

export function getProjectMetadata(
  host: Tree,
  projectName: string
): ProjectMetadata {
  return {
    workspace: getWorkspace(host).projects[projectName],
    manifest: getManifest(host, projectName),
  };
}
