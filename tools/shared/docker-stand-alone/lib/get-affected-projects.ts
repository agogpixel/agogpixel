import { Tree } from '@nrwl/devkit';

import { normalize } from 'path';

import { getGitFiles } from '../../workspace';

import { getManifest } from './get-manifest';
import { getVariantBuildConfigs } from './get-variant-build-configs';
import { getWorkspace } from './get-workspace';
import { AffectedConfig, dockerStandAloneScriptsPath } from './models';

export function getAffectedProjects(host: Tree, config: AffectedConfig): Record<string, string[]> {
  const {
    affected: { defaultBase },
    projects,
  } = getWorkspace(host);

  const { files: affectedFiles } = getGitFiles({
    base: config.base || defaultBase,
    head: config.head,
  });

  const affectedSourceScripts = affectedFiles.filter((file) =>
    file.includes(dockerStandAloneScriptsPath)
  );

  const affectedProjects: Record<string, string[]> = {};

  function addToAffectedProjects(name: string, key: string): void {
    if (!affectedProjects[name]) {
      affectedProjects[name] = [key];
    } else {
      affectedProjects[name].push(key);
    }
  }

  Object.entries(projects).forEach(([projectName, { root }]) => {
    if (config.filter.length && !config.filter.includes(projectName)) {
      return;
    }

    const manifest = getManifest(host, projectName);
    const variants = getVariantBuildConfigs(manifest);

    variants.forEach((variant) => {
      const variantHasAffectedSourceScript =
        affectedSourceScripts.some(
          (file) =>
            file.includes('shared-lib') ||
            file.includes(`shared-${manifest.family}-lib`)
        ) ||
        variant.scripts.some((scriptName) =>
          affectedSourceScripts.some((file) => file.includes(scriptName))
        );

      if (variantHasAffectedSourceScript) {
        addToAffectedProjects(projectName, variant.key);
        return;
      }

      // Variant paths are relative ie. they could point anywhere.

      const scriptsDestinationPath = normalize(
        `${root}/${variant.scriptsDestination}`
      ).replace(host.root, '');

      const dockerfile = normalize(`${root}/${variant.dockerfile}`).replace(
        host.root,
        ''
      );

      const context = normalize(`${root}/${variant.context}`).replace(
        host.root,
        ''
      );

      const variantHasAffectedFiles = affectedFiles.some(
        (file) =>
          file.includes(`${root}/manifest.json`) ||
          file.includes(scriptsDestinationPath) ||
          file.includes(dockerfile) ||
          file.includes(context)
      );

      if (variantHasAffectedFiles) {
        addToAffectedProjects(projectName, variant.key);
      }
    });
  });

  return affectedProjects;
}
