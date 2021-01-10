import { WorkspaceJsonProjectArchitectConfig } from './workspace-json-project-architect-config';

/**
 * Workspace JSON project configuration.
 */
export interface WorkspaceJsonProjectConfig {
  /**
   * Project root path from workspace root.
   */
  root: string;

  /**
   * Project type.
   */
  projectType: string;

  /**
   * Project source root path from workspace root.
   */
  sourceRoot: string;

  /**
   * Project prefix (for components, selectors, etc).
   */
  prefix: string;

  /**
   * Architect configuration.
   */
  architect: WorkspaceJsonProjectArchitectConfig;
}
