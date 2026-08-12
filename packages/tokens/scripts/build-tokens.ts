import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { kebabPath } from '../sd.transforms.ts';
import { detectModeCollections, type TokenTree } from '../sd.preprocessors.ts';
import { buildModeTokens, type FlatToken } from './mode-build.ts';

/**
 * Multi-mode token build: produces the three CSS files PLAN.md §1.1
 * calls for, split by which axis (color vs density) actually affects
 * each token's resolved value -- not by declared type, which the export
 * doesn't reliably provide (see sd.transforms.ts).
 *
 * Design (this is a judgment call worth revisiting, not a spec PLAN.md
 * pins down precisely): color and density are meant to be fully
 * orthogonal (PLAN.md §1.4: "Density controls the physical scale... It
 * does not affect color, radius, font family, or font weight"). So the
 * membership of each output file is derived empirically by running the
 * SAME token set through three mode combinations and diffing:
 *
 *   light+roomy   (base)
 *   dark+roomy    (isolates color-only changes)
 *   light+condensed (isolates density-only changes)
 *
 * - A token whose value differs between light+roomy and dark+roomy is
 *   color-dependent -> lives in tokens.css (light/base value) and gets a
 *   sparse override entry in dark.css (only the delta, per PLAN.md
 *   §1.1's "sparse -- only tokens that differ from light").
 * - A token whose value differs between light+roomy and light+condensed
 *   is density-dependent -> moves entirely out of tokens.css and into
 *   density.css, with a full entry in both the roomy and condensed
 *   blocks (there's no single implicit default to diff against the way
 *   color has :root/light, so both blocks are complete).
 * - Everything else (doesn't vary on either axis) stays in tokens.css at
 *   its constant value.
 *
 * If any token varies on BOTH axes simultaneously, that contradicts
 * PLAN.md §1.4's orthogonality guarantee and is surfaced as a warning
 * rather than silently resolved one way or the other -- it means either
 * the Figma authoring or this script's assumptions need to be revisited.
 *
 * CANONICAL MODE-COLLECTION PASSTHROUGH:
 * Tokens living directly inside a mode collection (e.g.
 * `color.light.layout.backgroundColor.neutral.base`,
 * `color.dark.layout.backgroundColor.neutral.base`) only exist, by
 * default, as two permanently-coexisting, differently-named tokens --
 * because the mode name ("light"/"dark") is baked into their path, they
 * never collapse into a single mode-switching CSS variable the way a
 * *referenced* token does (e.g. a button aliasing `{intent.primary.base}`
 * gets ONE output name -- the button's own -- whose value flips with
 * context). That's fine for tokens some component already routes
 * through, but it silently strands any mode-collection token that
 * *nothing else references yet* -- e.g. `layout.*` colors, which are
 * meant to be consumed directly by product code, not necessarily via a
 * DS component. This step generates a canonical, mode-stripped variable
 * for every such leaf (`color-layout-background-color-neutral-base`,
 * `density-surface-padding-block`, ...) so they're usable the same way
 * as every other token, regardless of whether a component currently
 * aliases them. The raw mode-baked names are dropped from tokens.css in
 * favor of these canonical ones, to avoid shipping both the dead-end
 * duplicate and the real thing.
 */

function cssBlock(selector: string, entries: [string, string][]): string {
  const lines = entries
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, value]) => `  --${name}: ${value};`);
  return `${selector} {\n${lines.join('\n')}\n}\n`;
}

interface ColorPassthrough {
  name: string;
  light: string;
  dark: string;
}

interface DensityPassthrough {
  name: string;
  roomy: string;
  condensed: string;
}

/**
 * Derive canonical passthrough tokens directly from one build's raw
 * token list. Mode-resident leaves' own values don't depend on which
 * build context was used to generate them (that's the fix from the
 * self-mode-aware alias resolution), so a single build already contains
 * both the light AND dark (or roomy AND condensed) variants side by
 * side -- just under their raw, mode-baked path.
 */
function derivePassthrough(
  tokens: FlatToken[],
  modeCollections: Set<string>,
): {
  color: ColorPassthrough[];
  density: DensityPassthrough[];
  colorModes: [string, string];
  densityModes: [string, string];
} {
  const byCollection = new Map<string, Map<string, FlatToken[]>>();
  for (const collName of modeCollections) byCollection.set(collName, new Map());
  for (const token of tokens) {
    const [collName, modeName, ...rest] = token.path;
    if (!modeCollections.has(collName) || rest.length === 0) continue;
    const byMode = byCollection.get(collName)!;
    if (!byMode.has(modeName)) byMode.set(modeName, []);
    byMode.get(modeName)!.push({ ...token, path: rest });
  }

  function pairUp(collName: string, modeA: string, modeB: string) {
    const byMode = byCollection.get(collName);
    const a = byMode?.get(modeA) ?? [];
    const bByRest = new Map(
      (byMode?.get(modeB) ?? []).map((t) => [t.path.join('.'), t]),
    );
    const pairs: { name: string; a: string; b: string }[] = [];
    for (const tokenA of a) {
      const restKey = tokenA.path.join('.');
      const tokenB = bByRest.get(restKey);
      if (!tokenB) continue; // asymmetric mode structure -- shouldn't happen post detectModeCollections, skip defensively
      pairs.push({
        name: kebabPath([collName, ...tokenA.path]),
        a: tokenA.value,
        b: tokenB.value,
      });
    }
    return pairs;
  }

  const colorColl = [...modeCollections].find((c) =>
    byCollection.get(c)?.has('light'),
  );
  const densityColl = [...modeCollections].find((c) =>
    byCollection.get(c)?.has('roomy'),
  );

  const color: ColorPassthrough[] = colorColl
    ? pairUp(colorColl, 'light', 'dark').map((p) => ({
        name: p.name,
        light: p.a,
        dark: p.b,
      }))
    : [];
  const density: DensityPassthrough[] = densityColl
    ? pairUp(densityColl, 'roomy', 'condensed').map((p) => ({
        name: p.name,
        roomy: p.a,
        condensed: p.b,
      }))
    : [];

  return {
    color,
    density,
    colorModes: ['light', 'dark'],
    densityModes: ['roomy', 'condensed'],
  };
}

async function main() {
  const sourceTree = JSON.parse(
    readFileSync(resolve('source/tokens.json'), 'utf8'),
  ) as TokenTree;
  const modeCollections = detectModeCollections(sourceTree);

  console.log('Building light+roomy (base)...');
  const lightRoomyTokens = await buildModeTokens({
    color: 'light',
    density: 'roomy',
  });
  console.log('Building dark+roomy...');
  const darkRoomyTokens = await buildModeTokens({
    color: 'dark',
    density: 'roomy',
  });
  console.log('Building light+condensed...');
  const lightCondensedTokens = await buildModeTokens({
    color: 'light',
    density: 'condensed',
  });

  const lightRoomy = new Map(lightRoomyTokens.map((t) => [t.name, t.value]));
  const darkRoomy = new Map(darkRoomyTokens.map((t) => [t.name, t.value]));
  const lightCondensed = new Map(
    lightCondensedTokens.map((t) => [t.name, t.value]),
  );

  const { color: colorPassthrough, density: densityPassthrough } =
    derivePassthrough(lightRoomyTokens, modeCollections);

  // Raw mode-baked names (e.g. "color-light-layout-...", "density-roomy-...")
  // are superseded by their canonical passthrough counterpart above and
  // excluded from every output below, so we don't ship both.
  const isModeResidentRaw = (path: string[]) => modeCollections.has(path[0]);
  const allNames = new Set(
    lightRoomyTokens
      .filter((t) => !isModeResidentRaw(t.path))
      .map((t) => t.name),
  );

  const colorVarying = new Set<string>();
  const densityVarying = new Set<string>();
  for (const name of allNames) {
    if (lightRoomy.get(name) !== darkRoomy.get(name)) colorVarying.add(name);
    if (lightRoomy.get(name) !== lightCondensed.get(name))
      densityVarying.add(name);
  }

  const both = [...colorVarying].filter((n) => densityVarying.has(n));
  if (both.length > 0) {
    console.warn(
      `WARNING: ${both.length} token(s) vary on BOTH color and density axes, ` +
        `contradicting PLAN.md §1.4's orthogonality assumption. Left in ` +
        `tokens.css/dark.css (color wins) -- density.css does NOT include ` +
        `them. Needs a manual look:`,
    );
    for (const n of both) console.warn(`  ${n}`);
  }

  // Guard against a canonical passthrough name colliding with an
  // existing component/semantic/primitives-derived name -- shouldn't
  // happen (different top-level prefixes), but silent collisions would
  // be worse than a loud warning.
  const existingNameCollisions = [
    ...colorPassthrough,
    ...densityPassthrough,
  ].filter((p) => allNames.has(p.name));
  if (existingNameCollisions.length > 0) {
    console.warn(
      `WARNING: ${existingNameCollisions.length} canonical passthrough name(s) collide with an existing token name -- needs manual resolution:`,
    );
    for (const p of existingNameCollisions) console.warn(`  ${p.name}`);
  }

  const tokensCssEntries: [string, string][] = [
    ...[...allNames]
      .filter((n) => !densityVarying.has(n))
      .map((n) => [n, lightRoomy.get(n)!] as [string, string]),
    ...colorPassthrough.map((p) => [p.name, p.light] as [string, string]),
  ];
  const tokensCss = cssBlock(':root', tokensCssEntries);

  const darkCssEntries: [string, string][] = [
    ...[...colorVarying]
      .filter((n) => !densityVarying.has(n))
      .map((n) => [n, darkRoomy.get(n)!] as [string, string]),
    ...colorPassthrough
      .filter((p) => p.light !== p.dark)
      .map((p) => [p.name, p.dark] as [string, string]),
  ];
  const darkCss = cssBlock('[data-theme="dark"]', darkCssEntries);

  const densityCss =
    cssBlock('[data-density="roomy"]', [
      ...[...densityVarying].map(
        (n) => [n, lightRoomy.get(n)!] as [string, string],
      ),
      ...densityPassthrough.map((p) => [p.name, p.roomy] as [string, string]),
    ]) +
    '\n' +
    cssBlock('[data-density="condensed"]', [
      ...[...densityVarying].map(
        (n) => [n, lightCondensed.get(n)!] as [string, string],
      ),
      ...densityPassthrough.map(
        (p) => [p.name, p.condensed] as [string, string],
      ),
    ]);

  const buildDir = resolve(
    dirname(fileURLToPath(import.meta.url)),
    '../build/css',
  );
  mkdirSync(buildDir, { recursive: true });
  writeFileSync(resolve(buildDir, 'tokens.css'), tokensCss);
  writeFileSync(resolve(buildDir, 'dark.css'), darkCss);
  writeFileSync(resolve(buildDir, 'density.css'), densityCss);

  console.log(
    `\ntokens.css:  ${tokensCssEntries.length} tokens (incl. ${colorPassthrough.length} canonical color passthrough)`,
  );
  console.log(`dark.css:    ${darkCssEntries.length} sparse override(s)`);
  console.log(
    `density.css: ${densityVarying.size + densityPassthrough.length} density-dependent token(s) x 2 modes (incl. ${densityPassthrough.length} canonical density passthrough)`,
  );
}

main();
