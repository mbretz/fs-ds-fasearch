/**
 * Alias-path remapping preprocessor.
 *
 * The Figma export (see the tokens-json-review skill) writes DTCG-style
 * alias values as `{path.to.token}` where `path` is relative to whichever
 * collection sub-root the token lives under -- e.g. a component token
 * writes `{control.action.color.default}`, not
 * `{semantic.control.action.color.default}`. Style Dictionary's own
 * reference resolver expects the literal full merged path (the path you'd
 * get by joining every ancestor object key with '.'), so none of these
 * aliases resolve out of the box.
 *
 * This preprocessor rewrites every `{...}` alias to the real full path
 * before Style Dictionary's parser/resolver ever sees the tree, in two
 * passes:
 *
 * 1. Static namespace: `primitives`, `semantic`, and `component` each
 *    expose their immediate children (`ref`, `content`, `button`, ...) as
 *    de-facto namespace roots. These are collection-mode-independent, so
 *    resolution here is unambiguous.
 * 2. Mode-relative namespace: `density` and `color` are genuinely
 *    multi-mode collections (condensed/roomy, light/dark -- see
 *    docs/PLAN.md §1.2). A bare alias like `{sizing.fixed.hairline}` is
 *    meant to resolve *inside whichever mode is active*. Since this
 *    preprocessor doesn't yet run once per mode (that's the follow-up
 *    "multi-mode builds" scope), it resolves these against a single
 *    default context -- `color: 'light'`, `density: 'roomy'` -- matching
 *    the "primary"/"default" modes PLAN.md §1.1 calls out. This produces
 *    a correct light+roomy build today; dark/condensed variants need the
 *    preprocessor re-run with a different context once the multi-mode
 *    build step exists.
 *
 * Any alias that resolves in neither pass is left untouched and reported
 * as a warning (not a thrown error) so a single bad reference in Figma
 * doesn't block the whole build -- Style Dictionary will then fail loudly
 * on that specific token when it can't resolve the reference itself,
 * which is easier to act on than a preprocessor-level crash.
 *
 * BEFORE any of the above runs, this module also fixes a separate, more
 * dangerous problem: five components (checkbox, searchInput, selectInput,
 * textArea, textInput) use "value" as a legitimate *token name* -- a
 * sub-group for the input's displayed-value text style, e.g.
 * `checkbox.value.color`, `checkbox.value.fontSize` -- which collides with
 * DTCG's use of "value" as the leaf wrapper key. Style Dictionary's own
 * parser uses the same `'value' in node` convention to decide whether an
 * object is a token leaf, so it misidentifies the whole `checkbox` object
 * as a single leaf token (whose "value" is the nested group, an invalid
 * non-primitive) and silently drops every other real token under
 * `checkbox` -- `selectedColor`, `borderColor`, `textColor`,
 * `borderRadius`, `backgroundColor.*`, `checkmark.*` -- with no error,
 * since nothing else happens to reference most of them by alias.
 * Confirmed directly against a live Style Dictionary build: with the
 * collision present, `component.checkbox` flattens to exactly one broken
 * token instead of the ~11 real ones. `renameAmbiguousValueGroups` renames
 * every such colliding "value" key to "valueGroup" before anything else
 * touches the tree, which is safe because nothing in the export
 * references through a `*.value.*` path (verified: zero occurrences).
 */

export type TokenTree = {
  [key: string]: TokenTree | { value: unknown; [key: string]: unknown };
};

export interface AliasContext {
  color: string;
  density: string;
}

export const DEFAULT_ALIAS_CONTEXT: AliasContext = {
  color: 'light',
  density: 'roomy',
};

const MODE_SIMILARITY_THRESHOLD = 0.5;

/**
 * A handful of components (checkbox, searchInput, selectInput, textArea,
 * textInput) use "value" as a legitimate *token name* -- a sub-group for
 * the input's displayed-value text style -- not the DTCG value wrapper
 * (e.g. `checkbox.value.color`, `checkbox.value.fontSize`). That makes
 * the group object itself look like a leaf under a naive `'value' in
 * node` check, which causes the whole subtree to be treated as a
 * terminal leaf and silently skipped instead of recursed into --
 * confirmed against the real export: exactly those 5 components trip
 * this, and it explains every one of the 24 references that failed to
 * resolve on the first pass of this preprocessor.
 *
 * Every genuine leaf in this export also carries a sibling `type` key
 * (`{ value, type, prefix }`); the lookalike group objects don't. Require
 * both to disambiguate. */
function isLeaf(node: unknown): node is { value: unknown } {
  return (
    typeof node === 'object' &&
    node !== null &&
    'value' in node &&
    'type' in node
  );
}

export interface RenameResult {
  renamed: string[];
}

/** Walk the tree and rename any object key literally "value" whose child
 * is a plain group (has no sibling "type", i.e. fails isLeaf) to
 * "valueGroup", mutating in place. Must run before isLeaf-based traversal
 * (this module's own, and Style Dictionary's) or before Style Dictionary
 * parses the tree at all. */
export function renameAmbiguousValueGroups(root: TokenTree): RenameResult {
  const renamed: string[] = [];

  function walk(node: TokenTree, path: string[]) {
    for (const key of Object.keys(node)) {
      const child = node[key];
      if (!child || typeof child !== 'object') continue;
      const childPath = [...path, key];
      if (key === 'value' && !isLeaf(child)) {
        node['valueGroup'] = child;
        delete node[key];
        renamed.push(childPath.join('.'));
        walk(child as TokenTree, [...path, 'valueGroup']);
      } else if (!isLeaf(child)) {
        walk(child as TokenTree, childPath);
      }
    }
  }

  walk(root, []);
  return { renamed };
}

function collectLeafPaths(node: TokenTree, prefix: string[] = []): string[] {
  const out: string[] = [];
  for (const [key, child] of Object.entries(node)) {
    const path = [...prefix, key];
    if (isLeaf(child)) {
      out.push(path.join('.'));
    } else if (child && typeof child === 'object') {
      out.push(...collectLeafPaths(child as TokenTree, path));
    }
  }
  return out;
}

/** Same structural-similarity heuristic as the tokens-json-review skill's
 * check_tokens.py detect_modes(): a collection's children are genuine
 * parallel modes only if every pair overlaps heavily in leaf-path shape,
 * as opposed to unrelated category groupings (semantic.content vs
 * semantic.control) that happen to share a parent. */
export function detectModeCollections(root: TokenTree): Set<string> {
  const modeCollections = new Set<string>();
  for (const [collName, coll] of Object.entries(root)) {
    if (!coll || typeof coll !== 'object' || isLeaf(coll)) continue;
    const children = Object.entries(coll as TokenTree).filter(
      ([, v]) => v && typeof v === 'object' && !isLeaf(v),
    );
    if (children.length < 2) continue;
    const leafSets = children.map(
      ([, v]) => new Set(collectLeafPaths(v as TokenTree)),
    );
    let minOverlap = Infinity;
    for (let i = 0; i < leafSets.length; i++) {
      for (let j = i + 1; j < leafSets.length; j++) {
        const union = new Set([...leafSets[i], ...leafSets[j]]);
        if (union.size === 0) continue;
        const intersection = [...leafSets[i]].filter((p) => leafSets[j].has(p));
        minOverlap = Math.min(minOverlap, intersection.length / union.size);
      }
    }
    if (minOverlap >= MODE_SIMILARITY_THRESHOLD) modeCollections.add(collName);
  }
  return modeCollections;
}

function resolveInTree(tree: TokenTree, parts: string[]): boolean {
  let cur: unknown = tree;
  for (const part of parts) {
    if (
      typeof cur !== 'object' ||
      cur === null ||
      !(part in (cur as TokenTree))
    )
      return false;
    cur = (cur as TokenTree)[part];
  }
  return isLeaf(cur);
}

export interface RemapResult {
  rewritten: number;
  unresolved: { path: string; alias: string }[];
}

interface EnclosingMode {
  collection: string;
  mode: string;
}

export function remapAliasPaths(
  root: TokenTree,
  context: AliasContext = DEFAULT_ALIAS_CONTEXT,
): RemapResult {
  const modeCollections = detectModeCollections(root);

  // Static namespace: primitives/semantic/component children -> collection prefix.
  const staticRoots = new Map<string, string>();
  for (const [collName, coll] of Object.entries(root)) {
    if (modeCollections.has(collName)) continue;
    if (!coll || typeof coll !== 'object' || isLeaf(coll)) continue;
    for (const childKey of Object.keys(coll as TokenTree)) {
      staticRoots.set(childKey, collName);
    }
  }

  // Every mode of every mode-collection, keyed for self-mode lookup (a
  // leaf living inside density.condensed resolves its own bare aliases
  // against density.condensed, not whichever mode the build's `context`
  // happens to select -- see the module doc for why this matters: nearly
  // every leaf under density/color is itself a mode-relative alias, so
  // getting this wrong silently makes "condensed" and "roomy" (or
  // "light"/"dark") drift with build context instead of staying fixed).
  const allModeTrees = new Map<string, Map<string, TokenTree>>();
  for (const collName of modeCollections) {
    const modes = new Map<string, TokenTree>();
    for (const [modeName, tree] of Object.entries(
      root[collName] as TokenTree,
    )) {
      if (tree && typeof tree === 'object')
        modes.set(modeName, tree as TokenTree);
    }
    allModeTrees.set(collName, modes);
  }

  // Context-selected mode trees, used only as a fallback for leaves that
  // live OUTSIDE any mode collection (semantic/component tier tokens
  // referencing e.g. `{intent.primary.base}`), where "which mode" isn't
  // implied by the leaf's own location and must come from the build context.
  const contextModeTrees: { prefix: string; tree: TokenTree }[] = [];
  for (const collName of modeCollections) {
    const modeName = (context as unknown as Record<string, string>)[collName];
    const modeTree = modeName
      ? allModeTrees.get(collName)?.get(modeName)
      : undefined;
    if (modeTree) {
      contextModeTrees.push({
        prefix: `${collName}.${modeName}`,
        tree: modeTree,
      });
    }
  }

  const result: RemapResult = { rewritten: 0, unresolved: [] };

  function resolveAndRewrite(
    aliasPath: string,
    enclosingMode: EnclosingMode | null,
  ): string | null {
    const parts = aliasPath.split('.');

    const staticPrefix = staticRoots.get(parts[0]);
    if (staticPrefix && resolveInTree(root[staticPrefix] as TokenTree, parts)) {
      return `${staticPrefix}.${aliasPath}`;
    }

    if (enclosingMode) {
      const selfTree = allModeTrees
        .get(enclosingMode.collection)
        ?.get(enclosingMode.mode);
      if (selfTree && resolveInTree(selfTree, parts)) {
        return `${enclosingMode.collection}.${enclosingMode.mode}.${aliasPath}`;
      }
    }

    for (const { prefix, tree } of contextModeTrees) {
      if (resolveInTree(tree, parts)) {
        return `${prefix}.${aliasPath}`;
      }
    }
    return null;
  }

  function walk(
    node: TokenTree,
    path: string[],
    enclosingMode: EnclosingMode | null,
  ) {
    for (const [key, child] of Object.entries(node)) {
      const childPath = [...path, key];
      if (isLeaf(child)) {
        const value = (child as { value: unknown }).value;
        if (
          typeof value === 'string' &&
          value.startsWith('{') &&
          value.endsWith('}')
        ) {
          const aliasPath = value.slice(1, -1);
          const resolved = resolveAndRewrite(aliasPath, enclosingMode);
          if (resolved) {
            (child as { value: unknown }).value = `{${resolved}}`;
            result.rewritten += 1;
          } else {
            result.unresolved.push({ path: childPath.join('.'), alias: value });
          }
        }
      } else if (child && typeof child === 'object') {
        const nextEnclosingMode =
          path.length === 0 && modeCollections.has(key)
            ? null // entering a mode collection itself; mode picked at the next level
            : path.length === 1 && modeCollections.has(path[0])
              ? { collection: path[0], mode: key } // this level IS the mode name
              : enclosingMode;
        walk(child as TokenTree, childPath, nextEnclosingMode);
      }
    }
  }

  walk(root, [], null);
  return result;
}

/**
 * Registered as a *per-platform* preprocessor (not global) so each
 * platform can drive its own color/density context. Style Dictionary
 * clones the token tree per platform before applying platform-level
 * preprocessors and passes that platform's own config as the second
 * argument, so a platform-specific `context: AliasContext` field (read
 * off the platform config here) is how multi-mode builds select which
 * mode's aliases resolve -- see sd.config.ts / the multi-mode build
 * script for how each platform sets it. Falls back to
 * DEFAULT_ALIAS_CONTEXT if a platform doesn't set one.
 */
export const aliasPathRemapPreprocessor = {
  name: 'purpose/alias-path-remap',
  preprocessor: (
    dictionary: TokenTree,
    options?: { context?: AliasContext },
  ) => {
    const context = options?.context ?? DEFAULT_ALIAS_CONTEXT;
    const result = remapAliasPaths(dictionary, context);
    if (result.unresolved.length > 0) {
      console.warn(
        `[alias-path-remap] ${result.unresolved.length} alias(es) did not resolve ` +
          `against the static namespace or context ${JSON.stringify(context)}:`,
      );
      for (const { path, alias } of result.unresolved) {
        console.warn(`  ${path} -> ${alias}`);
      }
    }
    console.log(
      `[alias-path-remap] (context=${JSON.stringify(context)}) rewrote ${result.rewritten} alias path(s).`,
    );
    return dictionary;
  },
};

/** Global, mode-independent: renames the ambiguous "value" group keys
 * once, before any per-platform, context-specific preprocessing runs. */
export const renameValueGroupsPreprocessor = {
  name: 'purpose/rename-value-groups',
  preprocessor: (dictionary: TokenTree) => {
    const renameResult = renameAmbiguousValueGroups(dictionary);
    if (renameResult.renamed.length > 0) {
      console.log(
        `[rename-value-groups] renamed ${renameResult.renamed.length} ambiguous "value" ` +
          `group key(s) to "valueGroup": ${renameResult.renamed.join(', ')}`,
      );
    }
    return dictionary;
  },
};
