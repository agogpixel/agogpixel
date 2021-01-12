/**
 * @file Angular schematic utilities.
 * @copyright Copyright © 2021, AgogPixel - All rights reserved.
 * @author Tristan Bonsor <kidthales@agogpixel.com>
 * @packageDocumentation
 * @module workspace/schematics
 */
import {
  apply,
  mergeWith,
  move,
  Rule,
  Source,
  template,
} from '@angular-devkit/schematics';

/**
 * Create files with resolved template values.
 * @param source Source file tree.
 * @param destination Destination path, relative to workspace root.
 * @param templateConfig Template configuration (key, value mappings).
 * @typeParam T Template configuration type.
 * @returns Angular schematic rule.
 * @category Rules
 */
export function createFiles<T>(
  source: Source,
  destination: string,
  templateConfig: T
): Rule {
  return mergeWith(
    apply(source, [template(templateConfig), move(destination)])
  );
}
