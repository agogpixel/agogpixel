/**
 * Options schema.
 */
export interface Schema {
  /**
   * Docker stand-alone project name.
   */
  name: string;

  /**
   * Directory to generate project in.
   */
  directory?: string;

  /**
   * Project tags.
   */
  tags?: string;
}
