import { WorkspaceJsonProjectArchitectBuilderConfig } from './workspace-json-project-architect-builder-config';

/**
 * Workspace JSON project architect configuration.
 */
export interface WorkspaceJsonProjectArchitectConfig {
  /**
   * Builder target.
   */
  [target: string]: WorkspaceJsonProjectArchitectBuilderConfig;
}
