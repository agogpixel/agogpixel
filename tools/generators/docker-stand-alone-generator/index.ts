import { Rule, SchematicContext, Tree, url } from '@angular-devkit/schematics';
import { toFileName } from '@nrwl/workspace';

import {
  dockerStandAloneRootDir,
  Family,
  generate,
  GeneratorConfig,
} from '../../shared/docker-stand-alone';

import { Schema } from './schema';

/**
 * Normalize user provided options.
 *
 * @param options Generator options.
 */
function normalizeOptions(options: Schema): GeneratorConfig {
  const name = toFileName(options.name);

  const projectDirectory = options.directory
    ? `${toFileName(options.directory)}/${name}`
    : name;

  const projectDirectoryParts = projectDirectory.split('/');

  return {
    projectName: projectDirectory.replace(new RegExp('/', 'g'), '-'),
    projectPathFromWorkspaceRoot: `${dockerStandAloneRootDir}/${projectDirectory}`,
    imageName: projectDirectoryParts[projectDirectoryParts.length - 1],
    imageFamily: Family.Alpine,
    templateSource: url(`./files`),
  };
}

/**
 * Generate a docker stand-alone project.
 *
 * @param options Generator options.
 */
export default function (options: Schema): Rule {
  return (host: Tree, context: SchematicContext) =>
    generate(normalizeOptions(options))(host, context);
}
