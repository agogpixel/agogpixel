import { Tree } from '@nrwl/devkit';

import { affected, AffectedConfig } from '../../shared/docker-stand-alone';

import { Schema } from './schema';

/**
 * Normalize options.
 *
 * @param schema Schema.
 */
function normalizeOptions(schema: Schema): AffectedConfig {
  const { base, head, project, build, commit, test, tag, push } = schema;

  return {
    base,
    head,
    build,
    commit,
    test,
    tag,
    push,
    filter: project ? [...project] : [],
  };
}

export default async function (
  host: Tree,
  schema: Schema
): Promise<() => void> {
  return affected(host, normalizeOptions(schema));
}
