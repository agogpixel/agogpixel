import { chain, Rule, SchematicContext, Tree, url } from '@angular-devkit/schematics';
import { names, toFileName } from '@nrwl/workspace';

import { basename, dirname } from 'path';

import { createFiles } from '../../shared/workspace';

import { Schema } from './schema';

/**
 * Normalized options schema.
 */
interface NormalizedSchema extends Schema {
  /**
   * Script directory.
   */
  scriptDirectory: string;
}

/**
 * Normalize user provided options.
 *
 * @param host Host tree.
 * @param options Generator options.
 */
function normalizeOptions(host: Tree, options: Schema): NormalizedSchema {
  const name = toFileName(options.name);

  const scriptDirectory = options.directory
    ? `${toFileName(options.directory)}`
    :  dirname(name);

  const scriptName =  basename(name);

  return {
    ...options,
    name: scriptName,
    scriptDirectory,
  };
}

/**
 * Generate a bash script.
 *
 * @param options Options.
 */
export default function (options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const normalizedOptions = normalizeOptions(host, options);

    const nameMap = names(normalizedOptions.name);

    return chain([
      createFiles(
        url('./files'),
        normalizedOptions.scriptDirectory,
        {
          ...normalizedOptions,
          ...nameMap,
          tpl: '',
          snakeCaseName: nameMap.constantName.toLowerCase(),
        }
      )
    ])(host, context);
  };
}
