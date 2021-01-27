import { dockerBuild, dockerBuildAsync  } from './utils';

describe('docker utils', () => {
  describe('dockerBuild', () => {
    it('should exist', () => {
      expect(dockerBuild).toBeDefined();
    });
  });

  describe('dockerBuildAsync', () => {
    it('should exist', () => {
      expect(dockerBuildAsync).toBeDefined();
    });
  });
});
