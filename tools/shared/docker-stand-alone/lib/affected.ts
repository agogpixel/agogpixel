import { Tree } from '@nrwl/devkit';

import { build as builder } from './build';
import { buildAffected } from './build-affected';
import { getAffectedProjects } from './get-affected-projects';
import { AffectedConfig } from './models';

export async function affected(
  host: Tree,
  config: AffectedConfig
): Promise<() => boolean> {
  const affectedProjects = getAffectedProjects(host, config);

  const { build, commit, test, tag, push } = config;

  if (!build) {
    return () => {
      console.log(`${JSON.stringify(affectedProjects, undefined, 2)}`);
      return true;
    };
  }

  if (!Object.keys(affectedProjects).length) {
    return () => true;
  }

  const buildResults = await buildAffected(host, affectedProjects);

  console.log(`${JSON.stringify(buildResults, undefined, 2)}`);

  // TODO if error-exit option enabled, bail...

  // TODO commit copied scripts & push (without triggering ci)...

  // TODO run container tests for successfully built images...

  // TODO tag images that have been tested successfully....

  // TODO push tagged images...

  return () => true;
}
