import { updateWorkspaceInTree } from '@nrwl/workspace';

import { WorkspaceJsonProjectConfig } from './models';

/**
 * Add project to workspace JSON in tree.
 *
 * @param projectName Project name.
 * @param config Project configuration.
 */
export function addProjectToWorkspaceJsonInTree(
  name: string,
  config: WorkspaceJsonProjectConfig
) {
  return updateWorkspaceInTree((json: Record<string, unknown>) => {
    if (json.projects[name]) {
      throw new Error(`'${name}' already exists.`);
    }

    json.projects[name] = config;

    return json;
  });
}
