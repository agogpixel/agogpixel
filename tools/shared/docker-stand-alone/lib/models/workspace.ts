import { Project } from './project';

/**
 * Docker stand-alone workspace metadata.
 */
export interface Workspace {
  /**
   * Organization.
   */
  organization: string;

  /**
   * Affected project settings.
   */
  affected: { defaultBase: string };

  /**
   * Docker stand-alone projects.
   */
  projects: Record<string, { root: string; }>;
}
