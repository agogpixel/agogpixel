import { Tree } from '@nrwl/devkit';

import { build } from './build';

export function buildAffected(
  host: Tree,
  projects: Record<string, string[]>
): Promise<Record<string, Record<string, boolean>>> {
  const projectEntries = Object.entries(projects);

  const buildResults = projectEntries.reduce((results, [projectName]) => {
    results[projectName] = {};
    return results;
  }, {} as Record<string, Record<string, boolean>>);

  let projectIndex = 0;

  function projectRunner(
    resolve: (value: Record<string, Record<string, boolean>>) => void
  ) {
    const [projectName, variants] = projectEntries[projectIndex];

    let variantIndex = 0;

    function variantRunner(
      resolve: (value: Record<string, Record<string, boolean>>) => void
    ) {
      const variant = variants[variantIndex];

      function builderResultHandler(result = () => false): void {
        buildResults[projectName][variant] = result();

        if (++variantIndex >= variants.length) {
          if (++projectIndex >= projectEntries.length) {
            resolve(buildResults);
            return;
          }

          projectRunner(resolve);
          return;
        }

        variantRunner(resolve);
      }

      build({ projectName, variant, buildArgs: {}, host }).then(
        (result) => builderResultHandler(result),
        () => builderResultHandler()
      );
    }

    variantRunner(resolve);
  }

  return new Promise<Record<string, Record<string, boolean>>>((resolve) =>
    projectRunner(resolve)
  );
}
