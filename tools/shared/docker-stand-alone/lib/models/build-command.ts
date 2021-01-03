/**
 * Build command suitable for `child_process.spawn`.
 */
export interface BuildCommand {
  /**
   * Command.
   */
  command: string;

  /**
   * Arguments.
   */
  args: string[];
}
