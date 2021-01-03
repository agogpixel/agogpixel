import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { readJsonInTree, serializeJson } from '@nrwl/workspace';

import { dockerStandAloneWorkspaceJsonFile } from './models';

export function updateWorkspaceInTree<T = any, O = T>(
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
