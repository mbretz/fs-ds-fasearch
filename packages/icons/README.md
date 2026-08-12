# icons

Mirrors the Figma "Financial Services DS - Assets" file's **Icons** page. One-way pipeline: Figma → SVG → React components. See [docs/PLAN.md §1.2](../../docs/PLAN.md) and [§1.3](../../docs/PLAN.md) for the full spec this package implements.

## Structure

```
source/*.svg           Raw SVG export from Figma, flat (no folders)
source/categories.json Icon name -> category frame, captured from the Figma node tree
scripts/build-manifest.ts  Validates source/*.svg against categories.json, writes src/generated/manifest.ts
svgr.config.cjs         SVGR + SVGO transform config
src/generated/*.tsx     One React component per icon (generated — do not hand-edit)
src/generated/index.ts  Barrel of every generated icon (generated — do not hand-edit)
src/generated/manifest.ts  name -> { category } (generated — do not hand-edit)
src/index.ts            Public barrel: re-exports every icon + the manifest
```

## Refreshing icons from Figma

Two manual steps, run whenever the Figma Icons page changes:

1. **Export SVGs from Figma.** Preferred path: the Figma Dev Mode MCP server (`mcp__figma__get_figma_data` + `mcp__figma__download_figma_images`), pointed at the Icons page (`node-id=1-3` in the Assets file as of this writing). Walk each category frame, download every icon component as an SVG into `source/*.svg` (flat — see naming below), and update `source/categories.json` with `{ "icon-name": "Category Frame Name" }` for anything added, removed, or re-grouped. Fallback: Figma's built-in batch export or the free **SVG Export** community plugin, if MCP access isn't available.
2. **Run the build:** `pnpm icons:build` (from repo root) or `pnpm --filter icons build`. This runs `build-manifest.ts` (fails loudly if `categories.json` and `source/*.svg` disagree on membership) then SVGR.

`pnpm --filter icons typecheck` verifies the generated output compiles.

## Naming conventions (enforced in Figma, not in code)

- Icon names are kebab-case in Figma (`chevron-right`, `map-pin`); SVGR PascalCases them on export (`ChevronRight`, `MapPin`).
- Each icon is a single frame, uniform sizing (mostly 24×24, with some smaller `-sm` variants), no background/wrapper rectangles.
- Category is derived from each icon's parent frame/group name in Figma, not from folder structure — `source/` stays flat.

## `currentColor` — targeted, not blanket

Most icons in this library use a single hardcoded neutral fill, `#006DA3`, in the raw Figma export — not `currentColor`. `svgr.config.cjs` swaps **that exact hex value** to `currentColor` via `replaceAttrValues`, so icons inherit `color` from their CSS context.

A handful of icons carry _intentional_ semantic accent colors and are **not** touched by that swap — their authored hex stays as-is:

| Color            | Icons                                    |
| ---------------- | ---------------------------------------- |
| Red `#CB0B31`    | `trash`, `notice-error`, `data-vis-loss` |
| Green `#247E58`  | `checkmark-circle`, `data-vis-gain`      |
| Orange `#D13805` | `notice-warning`                         |
| Gray `#4B4D4E`   | `notice-info`                            |
| Gold `#C08D16`   | `rating-star-full`, `rating-star-half`   |
| Gray `#7D8082`   | `rating-star-empty`                      |

If a newly-exported icon is meant to be neutral (inherit `currentColor`) but comes out with a different hardcoded hex than `#006DA3`, either fix the fill color in Figma before re-exporting, or extend the `replaceAttrValues` map in `svgr.config.cjs` — don't switch to a blanket color-strip, or these semantic icons will silently lose their meaning.

## Known deviations from the original spec (see docs/PLAN.md §1.3 for details)

- **No `size` prop.** Generated components are typed `SVGProps<SVGSVGElement>` with plain prop spreading (`<ChevronRight width={16} height={16} />`), not a `size` shorthand. Revisit if a future `<Icon name="..." />` wrapper needs one.
- **Components use `React.forwardRef`, not React 19's ref-as-prop.** This is SVGR's default TS template (SVGR 8.1.0 predates React 19's stable release), not a deliberate choice. Works fine on React 19 today; low-priority TODO to swap to a custom template if that ever becomes a real problem.

## Consuming

```tsx
import { ChevronRight, MapPin, manifest } from 'icons';

<ChevronRight className="h-4 w-4 text-slate-500" />;
manifest['chevron-right'].category; // "Navigation"
```
