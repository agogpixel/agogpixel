import { NxJsonProjectConfig } from '@nrwl/workspace/src/core/shared-interfaces';
import { WorkspaceJsonProjectConfig } from './workspace-json-project-config';

/**
 * Project metadata.
 */
export interface ProjectMetadata {
  /**
   * Workspace JSON project configuration.
   */
  workspace: WorkspaceJsonProjectConfig;

  /**
   * NX JSON project configuration.
   */
  nx: NxJsonProjectConfig;
}
