/**
 * Bash script generator options schema.
 */
export interface Schema {
  /**
   * Bash script name.
   */
  name: string;

  /**
   * Directory to generate script in.
   */
  directory?: string;
}
