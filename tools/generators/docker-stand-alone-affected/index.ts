import { Tree } from '@nrwl/devkit';

import { affected } from '../../shared/docker-stand-alone';

export default async function (host: Tree, schema: any): Promise<() => void> {
  return affected(host);
}
