import { chain, Rule } from '@angular-devkit/schematics';
import { names } from '@nrwl/workspace';

import { createFiles } from '../../workspace';

import { addProjectToWorkspaceJsonInTree } from './add-project-to-workspace-json-in-tree';
import { GeneratorConfig, Project } from './models';

export function generate(config: GeneratorConfig): Rule {
  const {
    imageName,
    projectName,
    projectPathFromWorkspaceRoot,
    templateSource,
  } = config;

  const templateConfig = {
    ...config,
    ...names(imageName),
    templateSource: undefined,
  };

  const project: Project = { root: projectPathFromWorkspaceRoot };

  return chain([
    createFiles(templateSource, projectPathFromWorkspaceRoot, templateConfig),
    addProjectToWorkspaceJsonInTree(projectName, project),
  ]);
}
