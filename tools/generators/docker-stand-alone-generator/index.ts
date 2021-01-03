import { chain, Rule, SchematicContext, Tree, url } from '@angular-devkit/schematics';
import { names, toFileName } from '@nrwl/workspace';

import { dockerStandAloneRootDir, dockerString, Family } from '../../shared/docker-stand-alone';
import { addProjectToMetadataInTree, createFiles, NxJsonProjectConfig, WorkspaceJsonProjectConfig } from '../../shared/workspace';

import { Schema } from './schema';

/**
 * Normalized options.
 */
interface NormalizedOptions {
  /**
   * Image name.
   */
  imageName: string;

  /**
   * Image family.
   */
  imageFamily: Family;

  /**
   * Project name
   */
  projectName: string;

  /**
   * Project path from workspace root.
   */
  projectPathFromWorkspaceRoot: string;

  /**
   * Project tags.
   */
  projectTags: string[];
}

/**
 * Normalize user provided options.
 *
 * @param options Generator options.
 */
function normalizeOptions(options: Schema): NormalizedOptions {
  const name = toFileName(options.name);

  const projectDirectory = options.directory
    ? `${toFileName(options.directory)}/${name}`
    : name;

  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${dockerStandAloneRootDir}/${projectDirectory}`;

  const projectDirectoryParts = projectDirectory.split('/');

  const imageName = projectDirectoryParts[projectDirectoryParts.length - 1];
  const imageFamily = projectDirectoryParts[0] as Family;

  const families = Object.values(Family);

  if (!families.includes(imageFamily)) {
    throw new Error(`Invalid image family '${imageFamily}' derived from path. Expected one of ${JSON.stringify(families, undefined, 2)}`)
  }

  const projectTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    imageName,
    imageFamily,
    projectName,
    projectPathFromWorkspaceRoot: projectRoot,
    projectTags,
  };
}

/**
 * Generate a docker stand-alone project.
 *
 * @param options Generator options.
 */
export default function (options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const config = normalizeOptions(options);

    const workspaceJsonProjectConfig: WorkspaceJsonProjectConfig = {
      root: config.projectPathFromWorkspaceRoot,
      sourceRoot: undefined,
      projectType: dockerString,
      prefix: undefined,
      architect: {
        build: {
          builder: './dist/out-tsc/tools/builders/docker-stand-alone-builder:build',
          options: {},
        },
        test: {
          builder: './dist/out-tsc/tools/builders/docker-stand-alone-builder:test',
          options: {},
        },
        tag: {
          builder: './dist/out-tsc/tools/builders/docker-stand-alone-builder:tag',
          options: {},
        },
        push: {
          builder: './dist/out-tsc/tools/builders/docker-stand-alone-builder:push',
          options: {},
        }
      },
    };

    const nxJsonProjectConfig: NxJsonProjectConfig = {
      tags: config.projectTags,
      implicitDependencies: [],
    };

    return chain([
      createFiles(url(`./files`), config.projectPathFromWorkspaceRoot, { ...config, ...names(config.imageName)}),
      addProjectToMetadataInTree(config.projectName, workspaceJsonProjectConfig, nxJsonProjectConfig),
    ])(host, context);
  };
}
