// Shared step scale for Box/Stack spacing props, backed by the
// density-reactive `--density-spacing-dynamic-*` tokens (packages/tokens)
// rather than a component-tier token bucket -- these are generic layout
// primitives with no Figma-authored component to resolve through.
export const SPACING_SCALE = [
  'none',
  'xx-small',
  'x-small',
  'small',
  'med',
  'large',
  'x-large',
  'xx-large',
] as const;

export type Spacing = (typeof SPACING_SCALE)[number];
