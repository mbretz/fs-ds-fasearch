import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { detectModeCollections, type TokenTree } from '../sd.preprocessors.ts';
import { buildModeTokens, type FlatToken } from './mode-build.ts';
import { classifyResolvedNumeric } from './flatten-tokens.ts';

/**
 * Emits fully-resolved, W3C Design Tokens Community Group (DTCG,
 * https://tr.designtokens.org/format/) -compliant JSON -- one file per
 * color x density mode combination -- so the token set is directly
 * consumable by any DTCG-aware tool, or by a human/agent reading the
 * file without needing to understand this project's alias-resolution or
 * mode-selection logic.
 *
 * Scope decisions (asked and confirmed, not guessed):
 * - Modes are represented as fully-resolved separate files (tokens.
 *   {color}-{density}.json), not as a single file with unresolved
 *   references + mode metadata. The DTCG spec has no ratified multi-mode
 *   mechanism yet, and a resolved file needs no consumer-side logic.
 * - $description is auto-generated from each token's path/collection,
 *   not hand-authored -- consistent and cheap to regenerate across
 *   ~700+ tokens, at the cost of being generic rather than carrying
 *   design rationale.
 *
 * $type inference: the source only ever declares "color", "fontFamily",
 * or "number" (see sd.transforms.ts). "color" and "fontFamily" map
 * directly to their DTCG equivalents. "number" is split further into
 * "dimension" (px-suffixed string, per DTCG's dimension type requiring a
 * unit), "fontWeight", or "number" via `classifyResolvedNumeric`
 * (flatten-tokens.ts, shared with the JS/Swift/Kotlin outputs -- see its
 * doc comment for why this is derived from the resolved value rather than
 * the token's own path).
 *
 * Mode-collection handling mirrors the canonical-passthrough fix in
 * build-tokens.ts: a leaf living inside `color.<mode>.*` or
 * `density.<mode>.*` is only included when `<mode>` matches the file's
 * own mode (its path is emitted with the mode segment stripped) --
 * otherwise every file would carry both light AND dark copies of every
 * color-collection leaf, defeating the point of per-mode files.
 */

type DtcgTree = { [key: string]: DtcgTree | DtcgLeaf };

interface DtcgLeaf {
  $value: string | number;
  $type: 'color' | 'fontFamily' | 'dimension' | 'fontWeight' | 'number';
  $description: string;
}

function humanize(path: string[]): string {
  return path
    .map((seg) =>
      seg
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/-/g, ' ')
        .toLowerCase(),
    )
    .join(' ');
}

function describe(
  topLevel: string,
  modeInfo: { collection: string; mode: string } | null,
  restPath: string[],
): string {
  const words = humanize(restPath);
  if (modeInfo) {
    const kind = modeInfo.collection === 'color' ? 'color' : 'density';
    return `${modeInfo.mode.charAt(0).toUpperCase()}${modeInfo.mode.slice(1)}-mode ${kind} value for ${words}.`;
  }
  if (topLevel === 'primitives') return `Primitive value for ${words}.`;
  if (topLevel === 'semantic') return `Semantic token for ${words}.`;
  if (topLevel === 'component') return `Component token for ${words}.`;
  return `Token for ${[topLevel, ...restPath].join(' ')}.`;
}

function toLeaf(
  token: FlatToken,
  modeInfo: { collection: string; mode: string } | null,
  restPath: string[],
): DtcgLeaf {
  const topLevel = token.path[0];
  if (token.declaredType === 'color') {
    return {
      $value: token.value,
      $type: 'color',
      $description: describe(topLevel, modeInfo, restPath),
    };
  }
  if (token.declaredType === 'fontFamily') {
    return {
      $value: token.value,
      $type: 'fontFamily',
      $description: describe(topLevel, modeInfo, restPath),
    };
  }
  const numericType = classifyResolvedNumeric(token);
  const value = numericType === 'dimension' ? token.value : Number(token.value);
  return {
    $value: value,
    $type: numericType,
    $description: describe(topLevel, modeInfo, restPath),
  };
}

function setPath(tree: DtcgTree, path: string[], leaf: DtcgLeaf) {
  let cur = tree;
  for (let i = 0; i < path.length - 1; i++) {
    const seg = path[i];
    if (!(seg in cur)) cur[seg] = {};
    cur = cur[seg] as DtcgTree;
  }
  cur[path[path.length - 1]] = leaf;
}

function buildDtcgTree(
  tokens: FlatToken[],
  modeCollections: Set<string>,
  activeModes: Record<string, string>,
): DtcgTree {
  const tree: DtcgTree = {};
  for (const token of tokens) {
    const [top, second, ...rest] = token.path;
    if (modeCollections.has(top)) {
      if (second !== activeModes[top]) continue; // not this file's mode -- skip
      const outputPath = [top, ...rest];
      setPath(
        tree,
        outputPath,
        toLeaf(token, { collection: top, mode: second }, rest),
      );
    } else {
      setPath(tree, token.path, toLeaf(token, null, token.path.slice(1)));
    }
  }
  return tree;
}

async function main() {
  const sourceTree = JSON.parse(
    readFileSync(resolve('source/tokens.json'), 'utf8'),
  ) as TokenTree;
  const modeCollections = detectModeCollections(sourceTree);

  const colorModes = Object.keys(sourceTree.color as TokenTree);
  const densityModes = Object.keys(sourceTree.density as TokenTree);

  const buildDir = resolve(
    dirname(fileURLToPath(import.meta.url)),
    '../build/dtcg',
  );
  mkdirSync(buildDir, { recursive: true });

  for (const color of colorModes) {
    for (const density of densityModes) {
      console.log(`Building DTCG JSON for ${color}+${density}...`);
      const tokens = await buildModeTokens({ color, density });
      const tree = buildDtcgTree(tokens, modeCollections, { color, density });
      const filename = `tokens.${color}-${density}.json`;
      writeFileSync(
        resolve(buildDir, filename),
        JSON.stringify(tree, null, 2) + '\n',
      );
      console.log(`  wrote ${filename}`);
    }
  }
}

main();
