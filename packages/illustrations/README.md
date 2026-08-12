# illustrations

Mirrors the Figma "Financial Services DS - Assets" file's **Illustrations** page. One-way pipeline: Figma → SVG → React components. See [docs/PLAN.md §1.2](../../docs/PLAN.md) and [§1.3a](../../docs/PLAN.md) for the full spec this package implements.

Sibling package to [`icons`](../icons), with a pipeline that's identical except for the one thing that matters most here: **colors are never touched.**

## Structure

```
source/*.svg           Raw SVG export from Figma, flat, kebab-cased
svgr.config.cjs         SVGR + SVGO transform config (no color-normalization pass)
src/generated/*.tsx     One React component per illustration (generated — do not hand-edit)
src/generated/index.ts  Barrel of every generated illustration (generated — do not hand-edit)
src/index.ts            Public barrel: re-exports every illustration
```

There is no category manifest for this package — grouping is optional on this Figma page and, per PLAN.md §1.2/§1.3a, is ignored by this pipeline even if present (22 illustrations doesn't need a taxonomy).

## Refreshing illustrations from Figma

Two manual steps, run whenever the Figma Illustrations page changes:

1. **Export SVGs from Figma.** Same mechanism as `icons` — Figma Dev Mode MCP server preferred, batch export / community plugin as fallback — targeting the Illustrations page instead. Component names in Figma are `Illustrations/<Title Case Name>` (e.g. `Illustrations/Living Debt Free`); strip the `Illustrations/` prefix and kebab-case the rest (`living-debt-free`) when naming the file in `source/`. SVGR PascalCases from there (`LivingDebtFree`), same as icons.
2. **Run the build:** `pnpm illustrations:build` (from repo root) or `pnpm --filter illustrations build`.

`pnpm --filter illustrations typecheck` verifies the generated output compiles.

## Multicolor is intentional — do not add a `currentColor` pass

Unlike `icons`, illustrations keep every authored fill/stroke exactly as exported. Confirmed via export: each illustration uses 7-8 distinct hex fills plus white highlights — coercing any of that to `currentColor` would flatten the artwork. If you're tempted to copy `icons/svgr.config.cjs`'s `replaceAttrValues` currentColor swap into this package's config, don't — that's the one deliberate difference between the two pipelines.

## Frame size

All 22 illustrations are authored at a uniform 104×104 frame (one is 105×104 in the current export — a one-pixel Figma export artifact, treated as noise, not worth hand-fixing). Illustrations are not icon-scale; don't add a `size` shorthand prop expecting icon-like usage — consumers set `width`/`height` directly if they need to scale one down.

## Consuming

```tsx
import { LivingDebtFree, Vacation } from 'illustrations';

<LivingDebtFree className="h-26 w-26" />;
```
