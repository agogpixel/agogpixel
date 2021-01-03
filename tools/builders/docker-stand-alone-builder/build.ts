import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { json } from '@angular-devkit/core';

import { Observable } from 'rxjs';

import { build } from '../../shared/docker-stand-alone';

/**
 * Options.
 */
interface Options extends json.JsonObject {
  /**
   * Specific variant to build.
   */
  variant: string;

  /**
   * Docker custom build arguments.
   */
  buildArgs: string[];
}

/**
 * Normalized options.
 */
interface NormalizedOptions extends json.JsonObject {
  /**
   * Specific variant to build.
   */
  variant: string;

  /**
   * Docker custom build arguments.
   */
  buildArgs: Record<string, string>;
}

/**
 * Normalize options.
 *
 * @param options Options.
 */
function normalizeOptions(options: Options): NormalizedOptions {
  const buildArgs = {};

  options.buildArgs.forEach((arg) => {
    const [key, value] = arg.split(/=(.+)/);

    if (!key) {
      throw new Error(`Docker requires a non-empty build-arg name. Provided build-args were: ${JSON.stringify(options.buildArgs, null, 2)}`);
    }

    buildArgs[key] = value || '';
  });

  return { variant: options.variant, buildArgs };
}

/**
 * Builder handler.
 *
 * @param options Options.
 * @param context Builder context.
 */
function builderHandler(options: Options, context: BuilderContext): Observable<BuilderOutput> {
  if (!context.target) {
    throw new Error('The builder requires a target.');
  }

  const { variant, buildArgs } = normalizeOptions(options);

  return build(context, variant, buildArgs);
}

/**
 * Builder for docker stand-alone build target.
 */
export default createBuilder((options: Options, context: BuilderContext) => builderHandler(options, context));
