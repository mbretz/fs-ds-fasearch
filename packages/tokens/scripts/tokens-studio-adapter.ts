import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Merges the multi-file Tokens Studio Pro export
 * (source/tokens-studio/*.json + $themes.json + $metadata.json) into a
 * single tree with the same shape the rest of this pipeline already
 * expects: { primitives, semantic, component, color: {light, dark},
 * density: {condensed, roomy} }, with each leaf normalized from DTCG's
 * `$value`/`$type`/`$description` to this project's `value`/`type`/
 * `description` (see sd.preprocessors.ts -- isLeaf(), the value-key
 * collision rename, and alias remapping all key off bare `value`/`type`,
 * not `$`-prefixed ones). `$extensions` (Figma-internal bookkeeping) is
 * dropped.
 *
 * The group -> mode -> set mapping is read from $themes.json rather than
 * hardcoded to the current 7 file paths, so a differently-named set
 * still merges correctly. Each Theme Group with exactly one enabled-set
 * mode (primitives, semantic, component) is merged directly under its
 * own top-level key; a group with multiple modes (color, density) is
 * nested under that key per mode, exactly matching the shape
 * detectModeCollections() in sd.preprocessors.ts already knows how to
 * recognize.
 *
 * This is intentionally a one-time-import adapter, not a live sync --
 * per the project's own framing, this Tokens Studio export replaces
 * packages/tokens/source/tokens.json outright.
 */

const TOKENS_STUDIO_DIR = resolve('source/tokens-studio');
const OUTPUT_PATH = resolve('source/tokens.json');

interface Theme {
  id: string;
  name: string;
  group: string;
  selectedTokenSets: Record<string, string>;
}

type RawTree = { [key: string]: RawTree | RawLeaf };
interface RawLeaf {
  $value: unknown;
  $type: string;
  $description?: string;
  $extensions?: unknown;
}

type NormalizedTree = { [key: string]: NormalizedTree | NormalizedLeaf };
interface NormalizedLeaf {
  value: unknown;
  type: string;
  description?: string;
}

function isRawLeaf(node: unknown): node is RawLeaf {
  return typeof node === 'object' && node !== null && '$value' in node;
}

/** Tokens Studio's own type vocabulary mostly maps 1:1 to what
 * sd.transforms.ts / build-dtcg.ts already handle (they don't gate
 * dimension-vs-fontWeight-vs-number on the declared label at all, only
 * on the resolved value/path -- see build-dtcg.ts's module doc). The one
 * declared type those DO check for is "fontFamily" (singular); Tokens
 * Studio exports "fontFamilies" (plural), so that's the one translation
 * that actually matters -- everything else passes through unchanged. */
function normalizeType(type: string): string {
  if (type === 'fontFamilies') return 'fontFamily';
  return type;
}

function normalizeTree(node: RawTree): NormalizedTree {
  const out: NormalizedTree = {};
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    if (isRawLeaf(child)) {
      const leaf: NormalizedLeaf = {
        value: child.$value,
        type: normalizeType(child.$type),
      };
      if (child.$description) leaf.description = child.$description;
      out[key] = leaf;
    } else {
      out[key] = normalizeTree(child as RawTree);
    }
  }
  return out;
}

function loadSet(setName: string): RawTree {
  const path = resolve(TOKENS_STUDIO_DIR, `${setName}.json`);
  return JSON.parse(readFileSync(path, 'utf8'));
}

function main() {
  const themes: Theme[] = JSON.parse(
    readFileSync(resolve(TOKENS_STUDIO_DIR, '$themes.json'), 'utf8'),
  );

  const groupToModeSets = new Map<string, Map<string, string>>();
  for (const theme of themes) {
    const enabled = Object.entries(theme.selectedTokenSets)
      .filter(([, state]) => state === 'enabled')
      .map(([setName]) => setName);
    if (enabled.length !== 1) {
      console.warn(
        `WARNING: theme '${theme.id}' (group '${theme.group}') has ${enabled.length} enabled sets, expected exactly 1: ${enabled.join(', ')}. Using the first.`,
      );
    }
    if (!groupToModeSets.has(theme.group))
      groupToModeSets.set(theme.group, new Map());
    groupToModeSets.get(theme.group)!.set(theme.name, enabled[0]);
  }

  const merged: NormalizedTree = {};
  for (const [group, modeSets] of groupToModeSets) {
    if (modeSets.size === 1) {
      const [[, setName]] = modeSets;
      merged[group] = normalizeTree(loadSet(setName));
      console.log(`  ${group} <- ${setName} (single mode)`);
    } else {
      const groupTree: NormalizedTree = {};
      for (const [modeName, setName] of modeSets) {
        groupTree[modeName] = normalizeTree(loadSet(setName));
        console.log(`  ${group}.${modeName} <- ${setName}`);
      }
      merged[group] = groupTree;
    }
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(merged, null, 2) + '\n');
  console.log(`\nWrote merged tree to ${OUTPUT_PATH}`);
}

main();
