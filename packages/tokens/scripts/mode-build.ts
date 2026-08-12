import StyleDictionary from 'style-dictionary';
import '../sd.transforms.ts';
import {
  aliasPathRemapPreprocessor,
  renameValueGroupsPreprocessor,
  type AliasContext,
} from '../sd.preprocessors.ts';

/**
 * Shared mode-aware build helper -- used by both scripts/build-tokens.ts
 * (multi-mode CSS) and scripts/build-dtcg.ts (resolved DTCG JSON per
 * mode combo), so both consume identical resolution/rename/type logic.
 */

let hooksRegistered = false;
function registerHooksOnce() {
  if (hooksRegistered) return;
  StyleDictionary.registerPreprocessor(renameValueGroupsPreprocessor);
  StyleDictionary.registerPreprocessor(aliasPathRemapPreprocessor);
  hooksRegistered = true;
}

export interface FlatToken {
  name: string;
  path: string[];
  value: string;
  /** Declared source $type: only ever "color", "fontFamily", or "number"
   * in this export (see sd.transforms.ts module doc). */
  declaredType: string;
}

export async function buildModeTokens(
  context: AliasContext,
): Promise<FlatToken[]> {
  registerHooksOnce();
  const sd = new StyleDictionary({
    source: ['source/tokens.json'],
    platforms: {
      css: {
        preprocessors: [
          'purpose/rename-value-groups',
          'purpose/alias-path-remap',
        ],
        context,
        transformGroup: 'purpose/css',
      },
    },
  } as never);
  const { allTokens } = await sd.getPlatformTokens('css');
  return allTokens.map((t) => ({
    name: t.name,
    path: t.path,
    value: String(t.value),
    declaredType: t.type,
  }));
}
