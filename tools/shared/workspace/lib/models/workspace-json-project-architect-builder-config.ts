/**
 * Docker stand-alone project architect builder metadata.
 */
export interface WorkspaceJsonProjectArchitectBuilderConfig {
  /**
   * Builder package name or path.
   */
  builder: string;

  /**
   * Builder specific options.
   */
  options: Record<string, unknown>;
}
