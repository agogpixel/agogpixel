import { Manifest} from './manifest';
import { Project } from './project';

/**
 * Docker stand-alone project metadata.
 */
export interface ProjectMetadata {
  /**
   * Project workspace metadata.
   */
  workspace: Project;

  /**
   * Project manifest metadata.
   */
  manifest: Manifest;
}
