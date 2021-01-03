import { Manifest} from './manifest';
import { Project } from './project';

export interface ProjectMetadata {
  workspace: Project;
  manifest: Manifest;
}
