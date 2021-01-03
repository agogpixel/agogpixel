import { Rule } from '@angular-devkit/schematics';

import { Project, Workspace } from './models';
import { updateWorkspaceInTree } from './update-workspace-in-tree';

export function addProjectToWorkspaceJsonInTree(name: string, project: Project): Rule {
  return updateWorkspaceInTree((json: Workspace) => {
    if (json.projects[name]) {
      throw new Error(`'${name}' already exists.`);
    }

    json.projects[name] = project;

    return json;
  });
}
