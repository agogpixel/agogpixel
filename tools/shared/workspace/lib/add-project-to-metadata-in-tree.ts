import { chain, Rule } from '@angular-devkit/schematics';
import { addProjectToNxJsonInTree } from '@nrwl/workspace';

import { addProjectToWorkspaceJsonInTree } from './add-project-to-workspace-json-in-tree';
import { NxJsonProjectConfig, WorkspaceJsonProjectConfig } from './models';

/**
 * Add project to metadata files in tree.
 *
 * @param name Project name.
 * @param workspaceJsonProjectConfig Workspace JSON project configuration.
 * @param nxJsonProjectConfig NX JSON project configuration.
 */
export function addProjectToMetadataInTree(
  name: string,
  workspaceJsonProjectConfig: WorkspaceJsonProjectConfig,
  nxJsonProjectConfig: NxJsonProjectConfig
): Rule {
  return chain([
    addProjectToWorkspaceJsonInTree(name, workspaceJsonProjectConfig),
    addProjectToNxJsonInTree(name, nxJsonProjectConfig),
  ]);
}
