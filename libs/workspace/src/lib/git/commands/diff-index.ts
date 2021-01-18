import {
  CommandBuilder,
  OptionArgumentRequirement,
  OptionArgumentSeparator,
} from '../../command-builder';

import { gitCommandOptions } from './git';

/**
 * @see GitDiffIndexDocumentation {@link https://git-scm.com/docs/git-diff-index}
 */
export const gitDiffIndexCommandOptions = {
  patch: { option: '--patch' },
  noPatch: { option: '--no-patch' },
  unified: {
    option: '--unified',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  output: {
    option: '--output',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  outputIndicatorNew: {
    option: '--output-indicator-new',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  outputIndicatorOld: {
    option: '--output-indicator-old',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  outputIndicatorContext: {
    option: '--output-indicator-context',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  raw: { option: '--raw' },
  patchWithRaw: { option: '--patch-with-raw' },
  indentHeuristic: { option: '--indent-heuristic' },
  noIndentHeuristic: { option: '--no-indent-heuristic' },
  minimal: { option: '--minimal' },
  patience: { option: '--patience' },
  histogram: { option: '--histogram' },
  anchored: {
    option: '--anchored',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  diffAlgorithm: {
    option: '--diff-algorithm',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  stat: {
    option: '--stat',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  compactSummary: { option: '--compact-summary' },
  numstat: { option: '--numstat' },
  shortstat: { option: '--shortstat' },
  dirstat: {
    option: '--dirstat',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Optional,
  },
  cumulative: { option: '--cumulative' },
  dirstatByFile: {
    option: '--dirstat-by-file',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Optional,
  },
  summary: { option: '--summary' },
  patchWithStat: { option: '--patch-with-stat' },
  noMunge: { option: '-z' },
  nameOnly: { option: '--name-only' },
  nameStatus: { option: '--name-status' },
  submodule: {
    option: '--submodule',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Optional,
  },
  color: {
    option: '--color',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Optional,
  },
  noColor: { option: '--no-color' },
  colorMoved: {
    option: '--color-moved',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Optional,
  },
  noColorMoved: { option: '--no-color-moved' },
  colorMovedWs: {
    option: '--color-moved-ws',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  noColorMovedWs: { option: '--no-color-moved-ws' },
  wordDiff: {
    option: '--word-diff',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Optional,
  },
  wordDiffRegex: {
    option: '--word-diff-regex',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  colorWords: {
    option: '--color-words',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Optional,
  },
  noRenames: { option: '--no-renames' },
  renameEmpty: { option: '--rename-empty' },
  noRenameEmpty: { option: '--no-rename-empty' },
  check: { option: '--check' },
  wsErrorHighlight: {
    option: '--ws-error-highlight',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  fullIndex: { option: '--full-index' },
  binary: { option: '--binary' },
  abbrev: {
    option: '--bbrev',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Optional,
  },
  breakRewrites: {
    option: '--break-rewrites',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Optional,
  },
  findRenames: {
    option: '--find-renames',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Optional,
  },
  findCopies: {
    option: '--find-copies',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Optional,
  },
  findCopiesHarder: { option: '--find-copies-harder' },
  irreversibleDelete: { option: '--irreversible-delete' },
  preventIfExcedes: {
    option: '-l',
    seperator: OptionArgumentSeparator.None,
    argRequired: OptionArgumentRequirement.Required,
  },
  diffFilter: {
    option: '--diff-filter',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Optional,
  },
  string: {
    option: '-S',
    seperator: OptionArgumentSeparator.None,
    argRequired: OptionArgumentRequirement.Required,
  },
  regex: {
    option: '-G',
    seperator: OptionArgumentSeparator.None,
    argRequired: OptionArgumentRequirement.Required,
  },
  findObject: {
    option: '--find-object',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  pickaxeAll: { option: '--pickaxe-all' },
  pickaxeRegex: { option: '--pickaxe-regex' },
  orderfile: {
    option: '-O',
    seperator: OptionArgumentSeparator.None,
    argRequired: OptionArgumentRequirement.Required,
  },
  swapInputs: { option: '-R' },
  relative: {
    option: '--relative',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Optional,
  },
  noRelative: { option: '--no-relative' },
  text: { option: '--text' },
  ignoreCrAtEol: { option: '--ignore-cr-at-eol' },
  ignoreSpaceAtEol: { option: '--ignore-space-at-eol' },
  ignoreSpaceChange: { option: '--ignore-space-change' },
  ignoreAllSpace: { option: '--ignora-all-space' },
  ignoreBlankLines: { option: '--ignore-blank-lines' },
  ignoreMatchingLines: {
    option: '--ignore-matching-lines',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  interHunkContext: {
    option: '--inter-hunk-context',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  functionContext: { option: '--function-context' },
  exitCode: { option: '--exit-code' },
  quiet: { option: '--quiet' },
  extDiff: { option: '--ext-diff' },
  noExtDiff: { option: '--no-ext-diff' },
  textconv: { option: '--textconv' },
  noTextconv: { option: '--no-textconv' },
  ignoreSubmodules: {
    option: '--ignore-submodules',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Optional,
  },
  srcPrefix: {
    option: '--src-prefix',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  dstPrefix: {
    option: '--dst-prefix',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  noPrefix: { option: '--no-prefix' },
  linePrefix: {
    option: '--line-prefix',
    seperator: OptionArgumentSeparator.Equals,
    argRequired: OptionArgumentRequirement.Required,
  },
  itaInvisibleInIndex: { option: '--ita-invisible-in-index' },
  cached: { option: '--cached' },
  mergeBase: { option: '--merge-base' },
  nonCheckedOutUpToDate: { option: '-m' },
};

/**
 * @see GitDiffIndexDocumentation {@link https://git-scm.com/docs/git-diff-index}
 */
export class GitDiffIndexCommand extends CommandBuilder {
  public readonly command = {
    git: GitDiffIndexCommand.commandAccessorFactory<
      typeof gitCommandOptions,
      GitDiffIndexCommand
    >('git', 'git', gitCommandOptions, this),
    diffIndex: GitDiffIndexCommand.commandAccessorFactory<
      typeof gitDiffIndexCommandOptions,
      GitDiffIndexCommand
    >('diff-index', 'diffIndex', gitDiffIndexCommandOptions, this),
  };

  public readonly option = this.command.diffIndex.option;

  protected readonly commandIndex = ['git', 'diffIndex'];
}
