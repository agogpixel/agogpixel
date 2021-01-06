export interface Schema {
  base?: string;
  head?: string;
  project?: string[];
  build?: boolean;
  commit?: boolean;
  test?: boolean;
  tag?: boolean;
  push?: boolean;
}
