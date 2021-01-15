import {
  gitGetChangedFiles,
  gitGetHash,
  gitGetRefs,
  gitGetStagedFiles,
  gitGetUncommittedFiles,
  gitGetUntrackedFiles,
  gitHasChangedFiles,
  gitHasRefs,
  gitHasStagedFiles,
  gitHasUncommittedFiles,
  gitHasUntrackedFiles,
  gitInsideWorkTree,
  gitRepoDirty,
} from './utils';

describe('git utils', () => {
  describe('gitGetHash', () => {
    it('should exist', () => {
      expect(gitGetHash).toBeDefined();
    });
  });

  describe('gitRepoDirty', () => {
    it('should exist', () => {
      expect(gitRepoDirty).toBeDefined();
    });
  });

  describe('gitInsideWorkTree', () => {
    it('should exist', () => {
      expect(gitInsideWorkTree).toBeDefined();
    });
  });

  describe('gitHasRefs', () => {
    it('should exist', () => {
      expect(gitHasRefs).toBeDefined();
    });
  });

  describe('gitGetRefs', () => {
    it('should exist', () => {
      expect(gitGetRefs).toBeDefined();
    });
  });

  describe('gitHasUntrackedFiles', () => {
    it('should exist', () => {
      expect(gitHasUntrackedFiles).toBeDefined();
    });
  });

  describe('gitGetUntrackedFiles', () => {
    it('should exist', () => {
      expect(gitGetUntrackedFiles).toBeDefined();
    });
  });

  describe('gitHasUncommittedFiles', () => {
    it('should exist', () => {
      expect(gitHasUncommittedFiles).toBeDefined();
    });
  });

  describe('gitGetUncommittedFiles', () => {
    it('should exist', () => {
      expect(gitGetUncommittedFiles).toBeDefined();
    });
  });

  describe('gitHasStagedFiles', () => {
    it('should exist', () => {
      expect(gitHasStagedFiles).toBeDefined();
    });
  });

  describe('gitGetStagedFiles', () => {
    it('should exist', () => {
      expect(gitGetStagedFiles).toBeDefined();
    });
  });

  describe('gitHasChangedFiles', () => {
    it('should exist', () => {
      expect(gitHasChangedFiles).toBeDefined();
    });
  });

  describe('gitGetChangedFiles', () => {
    it('should exist', () => {
      expect(gitGetChangedFiles).toBeDefined();
    });
  });
});
