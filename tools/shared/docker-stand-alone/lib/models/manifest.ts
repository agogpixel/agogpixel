import { Family } from './family.enum';
import { Variant } from './variant';

/**
 * Docker stand-alone project manifest.
 */
export interface Manifest extends Variant {
  /**
   * Image name.
   */
  name: string;

  /**
   * Image family.
   */
  family: Family;

  /**
   * Image variants.
   */
  variants?: Record<string, Variant>;
}
