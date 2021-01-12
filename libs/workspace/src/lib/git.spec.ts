import {
  getChangedFiles,
  getHash,
  getRefs,
  getStagedFiles,
  getUncommittedFiles,
  getUntrackedFiles,
  hasChangedFiles,
  hasRefs,
  hasStagedFiles,
  hasUncommittedFiles,
  hasUntrackedFiles,
  insideWorkTree,
  isRepoDirty,
} from './git';

describe('git', () => {
  describe('getHash', () => {
    it('should exist', () => {
      expect(getHash).toBeDefined();
    });
  });

  describe('isRepoDirty', () => {
    it('should exist', () => {
      expect(isRepoDirty).toBeDefined();
    });
  });

  describe('insideWorkTree', () => {
    it('should exist', () => {
      expect(insideWorkTree).toBeDefined();
    });
  });

  describe('hasRefs', () => {
    it('should exist', () => {
      expect(hasRefs).toBeDefined();
    });
  });

  describe('getRefs', () => {
    it('should exist', () => {
      expect(getRefs).toBeDefined();
    });
  });

  describe('hasUntrackedFiles', () => {
    it('should exist', () => {
      expect(hasUntrackedFiles).toBeDefined();
    });
  });

  describe('getUntrackedFiles', () => {
    it('should exist', () => {
      expect(getUntrackedFiles).toBeDefined();
    });
  });

  describe('hasUncommittedFiles', () => {
    it('should exist', () => {
      expect(hasUncommittedFiles).toBeDefined();
    });
  });

  describe('getUncommittedFiles', () => {
    it('should exist', () => {
      expect(getUncommittedFiles).toBeDefined();
    });
  });

  describe('hasStagedFiles', () => {
    it('should exist', () => {
      expect(hasStagedFiles).toBeDefined();
    });
  });

  describe('getStagedFiles', () => {
    it('should exist', () => {
      expect(getStagedFiles).toBeDefined();
    });
  });

  describe('hasChangedFiles', () => {
    it('should exist', () => {
      expect(hasChangedFiles).toBeDefined();
    });
  });

  describe('getChangedFiles', () => {
    it('should exist', () => {
      expect(getChangedFiles).toBeDefined();
    });
  });
});
