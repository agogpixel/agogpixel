export interface AffectedConfig {
  filter: string[];
  base?: string;
  head?: string;
  build?: boolean;
  commit?: boolean;
  test?: boolean;
  tag?: boolean;
  push?: boolean;
}
