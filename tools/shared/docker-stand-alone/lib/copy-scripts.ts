import { mkdirSync, promises } from 'fs';

import { Family } from './models';

/**
 * Asynchronously copy scripts to docker stand-alone project.
 *
 * @param scriptsSourcePath Absolute path to directory containing source scripts.
 * @param scriptsDestinationPath Absolute path to directory containing destination scripts.
 * @param family Image family.
 * @param scripts Script names.
 */
export async function copyScripts(scriptsSourcePath: string, scriptsDestinationPath: string, family: Family, scripts: string[]) {
  mkdirSync(scriptsDestinationPath, { recursive: true });

  return Promise.all(['shared-lib', `shared-${family}-lib`, ...scripts].map((name) => {
    const basename = `${name}.sh`;

    const src = `${scriptsSourcePath}/${basename}`;
    const dst = `${scriptsDestinationPath}/${basename}`;

    return promises.copyFile(src, dst);
  }));
}
