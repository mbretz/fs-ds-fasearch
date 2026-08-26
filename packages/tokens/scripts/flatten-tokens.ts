import { kebabPath } from '../sd.transforms.ts';
import type { FlatToken } from './mode-build.ts';

/**
 * Shared per-mode-combo flattening, used by every "one resolved set per
 * mode combo" output (build-dtcg.ts, build-js.ts, build-swift.ts,
 * build-kotlin.ts) -- as opposed to build-tokens.ts's CSS output, which
 * instead diffs across combos to produce a cascade-driven sparse
 * override file. See docs/PLAN.md's dated note on the multi-format token
 * pipeline for why CSS uses a different mechanism than these do.
 *
 * A leaf living inside `color.<mode>.*` or `density.<mode>.*` is only
 * kept when `<mode>` matches this combo's own mode (mirrors the
 * canonical-passthrough fix in build-tokens.ts) -- otherwise every
 * output would carry both light AND dark copies of every
 * mode-collection leaf, defeating the point of per-combo files.
 */
export function flattenForMode(
  tokens: FlatToken[],
  modeCollections: Set<string>,
  activeModes: Record<string, string>,
): FlatToken[] {
  const out: FlatToken[] = [];
  for (const token of tokens) {
    const [top, second, ...rest] = token.path;
    if (modeCollections.has(top)) {
      if (second !== activeModes[top]) continue; // not this combo's mode -- skip
      const path = [top, ...rest];
      out.push({ ...token, name: kebabPath(path), path });
    } else {
      out.push(token);
    }
  }
  return out;
}

/** kebab-case CSS var name -> camelCase identifier, valid in JS/Swift/Kotlin
 * alike (all three use camelCase for properties). */
export function toCamelCase(kebabName: string): string {
  return kebabName.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
}

export type NumericKind = 'dimension' | 'fontWeight' | 'number';

/**
 * Classify an already-resolved numeric token by what the CSS pipeline
 * actually did with it (does the value end in "px"?), not by
 * independently re-running the dimension-keyword heuristic against this
 * token's own path. Those can legitimately disagree:
 * `semantic.border.radius.default` aliases `semantic.border.radius.moderate`
 * aliases `{ref.size.02}` -- the *referencing* token's own path has no
 * dimension keyword ("border"/"radius" match nothing), but Style
 * Dictionary's transitive resolution correctly px-suffixes it based on the
 * terminal primitive's path ("size" matches). Re-deriving type from this
 * token's own path would misclassify it as a bare "number" and then fail to
 * parse "4px" as a number -- confirmed happening for 22 tokens before
 * switching to trusting the resolved value directly (see build-dtcg.ts's
 * git history for that original fix).
 */
export function classifyResolvedNumeric(token: FlatToken): NumericKind {
  if (token.value.endsWith('px')) return 'dimension';
  if (token.path.some((seg) => seg.toLowerCase() === 'fontweight'))
    return 'fontWeight';
  return 'number';
}
