import { BuilderContext } from '@angular-devkit/architect';

import { NxJsonProjectConfig, ProjectMetadata, WorkspaceJsonProjectConfig } from './models';

/**
 * Get project metadata from builder context.
 *
 * @param context Builder context.
 */
export async function getProjectMetadata(context: BuilderContext): Promise<ProjectMetadata> {
  const projectName = context.target?.project || '';

  const workspace = (await context.getProjectMetadata(projectName)) as unknown as WorkspaceJsonProjectConfig;
  const nx = require(`${context.workspaceRoot}/nx.json`)[projectName] as NxJsonProjectConfig;

  return { workspace, nx };
}
