import { Tree, readJson } from '@nrwl/devkit';

import { dockerStandAloneWorkspaceJsonFile, Workspace } from './models';

/**
 * Get docker stand-alone workspace metadata.
 *
 * @param host Virtual file system tree.
 */
export function getWorkspace(host: Tree): Workspace {
  return readJson(host, dockerStandAloneWorkspaceJsonFile);
}
