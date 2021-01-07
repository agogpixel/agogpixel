import { Tree } from '@nrwl/devkit';

import { affected, AffectedConfig } from '../../shared/docker-stand-alone';

import { Schema } from './schema';

/**
 * Normalize options.
 *
 * @param schema Schema.
 */
function normalizeOptions(host: Tree, schema: Schema): AffectedConfig {
  const { base, head, project, build, commit, test, tag, push } = schema;

  return {
    base,
    head,
    build,
    commit,
    test,
    tag,
    push,
    host,
    filter: project ? [...project] : [],
  };
}

/**
 * Process affected docker stand-alone projects.
 *
 * @param host Virtual file system tree.
 * @param schema Schema.
 */
export default async function (
  host: Tree,
  schema: Schema
): Promise<() => void> {
  return affected(normalizeOptions(host, schema));
}
