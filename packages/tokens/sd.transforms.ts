import StyleDictionary from 'style-dictionary';
import type { TransformedToken } from 'style-dictionary/types';

/**
 * The Figma export tags almost every non-color token as the generic DTCG
 * type "number" (see docs/PLAN.md §1.2 / the tokens-json-review skill).
 * "number" is true but useless for output purposes -- a border-radius, a
 * font-weight, and an opacity are all numbers, but only one of them should
 * get a "px" suffix in CSS. Rather than trust the declared $type, these
 * transforms infer the *purpose* of a token from its path (the token's
 * position in the primitives/semantic/component tree) and pick the
 * matching CSS behavior.
 *
 * If a future export starts emitting correct DTCG types ($type: dimension,
 * $type: fontWeight, etc. -- see https://tr.designtokens.org/format/), the
 * `filter`s below should switch to checking `token.type`/`token.$type`
 * first and fall back to the path heuristic only where it's still wrong.
 *
 * Side-effect module: registers transforms/transformGroup on import.
 * Shared by sd.config.ts (single-mode reference build) and
 * scripts/build-tokens.ts (the multi-mode build).
 */

const DIMENSION_PATH_KEYWORDS = [
  'borderRadius',
  'borderWidth',
  'padding',
  'margin',
  'gap',
  'spacing',
  'sizing',
  'size',
  'fontSize',
  'lineHeight',
  'minWidth',
  'minHeight',
  'maxWidth',
  'maxHeight',
  'width',
  'height',
];

/** Tokens whose value should NEVER move between tokens.css and density.css
 * even though their path might otherwise match a dimension keyword (e.g.
 * "size" appearing in a color-scale primitive name is not a dimension). */
function pathIncludes(token: TransformedToken, keywords: string[]): boolean {
  const lowerPath = token.path.map((p) => p.toLowerCase());
  return keywords.some((kw) => lowerPath.some((seg) => seg === kw.toLowerCase()));
}

function isDimension(token: TransformedToken): boolean {
  return typeof token.value === 'number' && pathIncludes(token, DIMENSION_PATH_KEYWORDS);
}

function isUnitlessNumber(token: TransformedToken): boolean {
  return typeof token.value === 'number' && !isDimension(token);
}

StyleDictionary.registerTransform({
  name: 'purpose/dimension-px',
  type: 'value',
  transitive: true,
  filter: (token) => isDimension(token),
  transform: (token) => `${token.value}px`,
});

StyleDictionary.registerTransform({
  name: 'purpose/unitless-number',
  type: 'value',
  transitive: true,
  filter: (token) => isUnitlessNumber(token),
  transform: (token) => token.value,
});

/** CSS custom property names: join the token path with dashes, converting
 * each camelCase path segment to kebab-case (`buttonBorderRadius` ->
 * `button-border-radius`), matching the `--color-bg-primary` style
 * PLAN.md §1.2 specifies for slash-delimited Figma names. Exported so
 * anything deriving a token name outside the transform pipeline (e.g. the
 * multi-mode build script's canonical mode-collection passthrough
 * variables) stays byte-identical with what this transform produces. */
export function kebabPath(path: string[]): string {
  return path.map((seg) => seg.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()).join('-');
}

StyleDictionary.registerTransform({
  name: 'purpose/name-kebab',
  type: 'name',
  transform: (token) => kebabPath(token.path),
});

StyleDictionary.registerTransformGroup({
  name: 'purpose/css',
  transforms: ['purpose/name-kebab', 'purpose/dimension-px', 'purpose/unitless-number'],
});
