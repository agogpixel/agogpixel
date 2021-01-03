import { apply, mergeWith, move, Rule, Source, template } from '@angular-devkit/schematics';

/**
 * Create files with resolved template values.
 *
 * @param source Source file tree.
 * @param destination Destination path, relative to workspace root.
 * @param templateConfig Template key, value mappings.
 */
export function createFiles<T>(source: Source, destination: string, templateConfig: T): Rule {
  return mergeWith(apply(source, [template(templateConfig), move(destination)]));
}
