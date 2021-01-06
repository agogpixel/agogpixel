import { Tree } from '@nrwl/devkit';

import { build as builder } from './build';
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

  const affectedProjectsEntries = Object.entries(affectedProjects);

  const buildResults = affectedProjectsEntries.reduce(
    (results, [projectName]) => {
      results[projectName] = {};
      return results;
    },
    {} as Record<string, Record<string, boolean>>
  );

  let projectIndex = 0;

  function projectRunner(resolve: (value?: () => void) => void) {
    const [projectName, variants] = affectedProjectsEntries[projectIndex];

    let variantIndex = 0;

    function variantRunner(resolve: (value?: () => void) => void) {
      const variant = variants[variantIndex];

      function builderResultHandler(result = () => false): void {
        buildResults[projectName][variant] = result();

        if (++variantIndex >= variants.length) {
          if (++projectIndex >= affectedProjectsEntries.length) {
            resolve();
            return;
          }

          projectRunner(resolve);
          return;
        }

        variantRunner(resolve);
      }

      builder({ projectName, variant, buildArgs: {}, host }).then(
        (result) => builderResultHandler(result),
        () => builderResultHandler()
      );
    }

    variantRunner(resolve);
  }

  await new Promise<() => void>((resolve) => projectRunner(resolve));

  console.log(`${JSON.stringify(buildResults, undefined, 2)}`);

  return () => undefined;
}
