import { Tree } from '@nrwl/devkit';

import { build, BuilderConfig } from '../../shared/docker-stand-alone';

import { Schema } from './schema';

/**
 * Normalize options.
 *
 * @param host Virtual file system tree.
 * @param schema Schema.
 */
function normalizeOptions(host: Tree, schema: Schema): BuilderConfig {
  const buildArgs = {};

  schema.buildArgs?.forEach((arg) => {
    const [key, value] = arg.split(/=(.+)/);

    if (!key) {
      throw new Error(`Docker requires a non-empty build-arg name. Provided build-args were: ${JSON.stringify(schema.buildArgs, null, 2)}`);
    }

    buildArgs[key] = value || '';
  });

  return { projectName: schema.name, variant: schema.variant, buildArgs, host };
}

/**
 * Build docker stand-alone project.
 *
 * @param host Virtual file system tree.
 * @param schema Schema.
 */
export default async function (host: Tree, schema: Schema): Promise<() => void> {
  return build(normalizeOptions(host, schema));
}
