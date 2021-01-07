import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { readJsonInTree, serializeJson } from '@nrwl/workspace';

import { dockerStandAloneWorkspaceJsonFile } from './models';

/**
 * Update docker stand-alone workspace in project tree.
 *
 * @param callback Data transform.
 */
export function updateWorkspaceInTree<T = unknown, O = T>(
  callback: (json: T, context: SchematicContext, host: Tree) => O
): Rule {
  return (host: Tree, context: SchematicContext = undefined): Tree => {
    const path = `/${dockerStandAloneWorkspaceJsonFile}`;

    host.overwrite(
      path,
      serializeJson(callback(readJsonInTree(host, path), context, host))
    );

    return host;
  };
}
