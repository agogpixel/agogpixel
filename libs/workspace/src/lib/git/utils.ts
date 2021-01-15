/**
 * Git utilities.
 * @copyright Copyright © 2021, AgogPixel - All rights reserved.
 * @author Tristan Bonsor <kidthales@agogpixel.com>
 * @packageDocumentation
 * @module workspace/git/utils
 */
import { maxBufferSize as maxBuffer } from '../shared';
import {
  GitDiffCommand,
  GitDiffIndexCommand,
  GitLsFilesCommand,
  GitMergeBaseCommand,
  GitRevParseCommand,
  GitShowRefCommand,
} from './commands';

/**
 * Get git hash options.
 * @see {gitGetHash} {@link gitGetHash}
 */
export interface GitGetHashOptions {
  /**
   * Get git hash only if repo is not dirty.
   * @defaultValue false
   * @see gitRepoDirty {@link gitRepoDirty}
   */
  cleanOnly?: boolean;

  /**
   * Output short git hash.
   * @defaultValue false
   */
  short?: boolean;
}

/**
 * Get git hash.
 * @param options Options.
 * @returns Git hash according to specified options.
 * @see GitGetHashOptions {@link GitGetHashOptions}
 * @see gitRepoDirty {@link gitRepoDirty}
 */
export function gitGetHash(options: GitGetHashOptions): string {
  const { cleanOnly, short } = options;

  if (cleanOnly && gitRepoDirty()) {
    return undefined;
  }

  const revParseCommand = new GitRevParseCommand();

  if (short) {
    revParseCommand.option.short();
  }

  return revParseCommand
    .parameter('HEAD')
    .spawnSync({ maxBuffer })
    .sanitizedStdout.find((v) => v.match(/\b[0-9a-f]{5,40}\b/));
}

/**
 * Test if git repo is dirty. A repos is considered dirty if it has any
 * untracked, uncommitted, or staged files.
 * @returns True if git repo is dirty.
 * @see gitInsideWorkTree {@link gitInsideWorkTree}
 * @see gitHasRefs {@link gitHasRefs}
 * @see gitGetUntrackedFiles {@link gitGetUntrackedFiles}
 * @see gitHasUncommittedFiles {@link gitHasUncommittedFiles}
 * @see gitHasStagedFiles {@link gitHasStagedFiles}
 */
export function gitRepoDirty(): boolean {
  return (
    gitInsideWorkTree() &&
    gitHasRefs() &&
    (gitHasUntrackedFiles() || gitHasUncommittedFiles() || gitHasStagedFiles())
  );
}

/**
 * Test if inside git work tree.
 * @returns True if inside git work tree.
 */
export function gitInsideWorkTree(): boolean {
  return new GitRevParseCommand().option
    .isInsideWorkTree()
    .spawnSync({ maxBuffer })
    .sanitizedStdout.some((s) => s === 'true');
}

/**
 * Test if git refs exist.
 * @returns True if inside git refs exist.
 * @see gitGetRefs {@link gitGetRefs}
 */
export function gitHasRefs(): boolean {
  return !!gitGetRefs().length;
}

/**
 * Get git refs.
 * @returns Git refs as array of trimmed, non-empty strings.
 * @see gitHasRefs {@link gitHasRefs}
 */
export function gitGetRefs(): string[] {
  return new GitShowRefCommand().spawnSync({ maxBuffer }).sanitizedStdout;
}

/**
 * Test if git has untracked files.
 * @returns True if git has untracked files.
 * @see gitGetUntrackedFiles {@link gitGetUntrackedFiles}
 */
export function gitHasUntrackedFiles(): boolean {
  return !!gitGetUntrackedFiles().length;
}

/**
 * Get untracked git files.
 * @returns Untracked git files as array of trimmed, non-empty strings.
 * @see gitGetUntrackedFiles {@link gitGetUntrackedFiles}
 */
export function gitGetUntrackedFiles(): string[] {
  return new GitLsFilesCommand().option
    .other()
    .option.excludeStandard()
    .spawnSync({ maxBuffer }).sanitizedStdout;
}

/**
 * Test if git has uncommitted files.
 * @returns True if git as uncommitted files.
 * @see gitGetUncommittedFiles {@link gitGetUncommittedFiles}
 */
export function gitHasUncommittedFiles(): boolean {
  return !!gitGetUncommittedFiles().length;
}

/**
 * Get uncommitted git files.
 * @returns Uncommented git files as array of trimmed, non-empty strings.
 * @see gitHasUncommittedFiles {@link gitHasUncommittedFiles}
 */
export function gitGetUncommittedFiles(): string[] {
  return new GitDiffCommand().option
    .nameOnly()
    .option.relative()
    .parameter('HEAD')
    .spawnSync({ maxBuffer }).sanitizedStdout;
}

/**
 * Test if git has staged files.
 * @returns True if git has staged files.
 * @see gitGetStagedFiles {@link gitGetStagedFiles}
 */
export function gitHasStagedFiles(): boolean {
  return !!gitGetStagedFiles().length;
}

/**
 * Get staged git files.
 * @returns Staged git files as array of trimmed, non-empty strings.
 * @see gitHasStagedFiles {@link gitHasStagedFiles}
 */
export function gitGetStagedFiles(): string[] {
  return new GitDiffIndexCommand().option
    .nameOnly()
    .option.cached()
    .parameter('HEAD')
    .spawnSync({ maxBuffer }).sanitizedStdout;
}

/**
 * Test if git has changed files across commits.
 * @param base Base commit-ish.
 * @param head Head commit-ish.
 * @returns True if git has changed files across commits.
 * @see gitGetChangedFiles {@link gitGetChangedFiles}
 */
export function gitHasChangedFiles(base: string, head: string): boolean {
  return !!gitGetChangedFiles(base, head).length;
}

/**
 * Get changed files across git commits.
 * @param base Base commit-ish.
 * @param head Head commit-ish.
 * @returns Changed git files as array of trimmed, non-empty strings.
 * @see gitHasChangedFiles {@link gitHasChangedFiles}
 */
export function gitGetChangedFiles(base: string, head: string): string[] {
  const mergeBase = new GitMergeBaseCommand()
    .parameter(base)
    .parameter(head)
    .spawnSync({ maxBuffer })
    .stdout.toString('utf-8')
    .trim();

  return new GitDiffCommand().option
    .nameOnly()
    .option.relative()
    .parameter(mergeBase)
    .parameter(head)
    .spawnSync({ maxBuffer }).sanitizedStdout;
}
