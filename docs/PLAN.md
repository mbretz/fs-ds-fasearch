# Monorepo: Design System + Store Locator — Portfolio Showcase

## Context

You want a public StackBlitz-hosted monorepo as a portfolio piece that demonstrates:

1. **Design-system engineering** — a Radix-style, fully composable component library driven by tokens authored in Figma.
2. **Product composition** — a store-locator app that consumes the DS both as off-the-shelf components and as primitives composed into new product-level components.

Constraint: the showcase has to boot quickly on StackBlitz WebContainers for reviewers clicking your link. That tips us away from heavyweight tooling and toward a clean, fast cold start. The DS is built in its entirety before the locator begins.

---

## Locked Decisions (from interview)

| Area | Choice |
|---|---|
| Framework | Vite + React + TypeScript |
| Styling | Tailwind + CSS custom properties (shadcn-style) |
| Primitives layer | Radix UI Primitives (the unstyled component lib) |
| Variant API | `class-variance-authority` (cva) + `tailwind-merge` + `clsx` |
| Token source | Native Figma Variables (Pro plan — no Variables REST API access) |
| Token export | Tokens Studio Pro, one-time multi-file DTCG export (superseded the original "free plugin only" decision — see §1.1) |
| Figma source structure | Three libraries: **Styles** (tokens), **Assets** (icons + illustrations), **Components**. The Assets library has two pages: **Icons** (single-color, grouped into category frames) and **Illustrations** (multicolor). Code splits Assets into two packages — see §1.3a. |
| Illustrations | Own package `packages/illustrations`, sibling to `packages/icons`, sourced from the Assets library's Illustrations page. Multicolor SVGs keep their authored fill/stroke colors (no `currentColor` coercion) — see §1.3a. |
| Icon categories | Figma groups icons into category frames on the Assets library's Icons page. Preserved in code as generated metadata (`manifest.ts`: name → category), not as folder structure — see §1.3. |
| Color theming | Light mode primary; partial dark mode already authored in Figma; full dark mode is additive later |
| Density theming | **Roomy** (default) and **Condensed** — two modes, per-element override supported |
| Monorepo | pnpm workspaces + Turborepo |
| DS docs | Storybook 8 |
| Locator UX | Map + list side-by-side, pin popovers, list↔map sync, search/filter |
| Map | MapLibre GL JS + free OSM raster tiles (no API key) |
| Plan file | `docs/PLAN.md` at repo root |

---

## Radix vs shadcn: Recommendation

**Use Radix Primitives directly as your foundation. Reference shadcn for recipes but do not install it.**

- **Radix UI Primitives** (`@radix-ui/react-*`) — unstyled, accessible, headless components (Dialog, DropdownMenu, Popover, Tabs, etc.). This is a real npm dependency you install.
- **shadcn/ui** — not a library. It's a registry of copy-paste component files built *on top of* Radix Primitives with Tailwind styling. You own the code.

For a **portfolio piece showcasing DS engineering**, copy-pasting shadcn undersells the work. Instead:
- Take Radix Primitives as the accessibility/behavior foundation.
- Use shadcn's source as a reference for proven patterns (`asChild`, slot composition, ref forwarding, variant cva recipes), but author each component yourself against your own tokens.
- This produces a real, ownable component library — not a wrapper around shadcn — and visibly demonstrates DS thinking (theming, slot APIs, composition primitives) rather than wiring skills.

Net: **Radix Primitives + cva + Tailwind + your tokens**, with shadcn as a reference book on the shelf.

---

## Monorepo Layout

```
fs-ds-fasearch/
├── apps/
│   ├── storybook/              # Storybook 8 host (consumes packages/ds + icons)
│   └── locator/                # Vite + React store-locator app
├── packages/
│   ├── tokens/                 # Mirrors Figma "Styles" library
│   │   ├── source/             # Raw export from Figma plugin
│   │   ├── build/              # Style Dictionary outputs (CSS, TS, Tailwind theme)
│   │   ├── sd.config.ts
│   │   └── package.json
│   ├── icons/                  # Mirrors Figma "Assets" library, Icons page
│   │   ├── source/             # Raw SVGs exported from Figma (single-color)
│   │   ├── src/
│   │   │   ├── generated/      # SVGR output: one .tsx per icon
│   │   │   │   └── manifest.ts # name -> category, derived from Figma frame grouping
│   │   │   ├── Icon.tsx        # Optional <Icon name="..." /> wrapper
│   │   │   └── index.ts        # Named exports: ChevronRight, MapPin, etc.
│   │   ├── svgr.config.cjs
│   │   └── package.json
│   ├── illustrations/          # Mirrors Figma "Assets" library, Illustrations page
│   │   ├── source/             # Raw SVGs exported from Figma (multicolor, colors preserved)
│   │   ├── src/
│   │   │   ├── generated/      # SVGR output: one .tsx per illustration
│   │   │   └── index.ts        # Named exports: EmptyState, Onboarding, etc.
│   │   ├── svgr.config.cjs     # Separate config: no currentColor/color-stripping pass
│   │   └── package.json
│   └── ds/                     # Mirrors Figma "Components" library
│       ├── src/
│       │   ├── components/     # Button, Input, Dialog, etc.
│       │   ├── primitives/     # Re-exports of selected Radix primitives
│       │   ├── utils/          # cn(), cva re-exports, slot helpers
│       │   └── index.ts
│       ├── tailwind.preset.ts  # Shared Tailwind preset reading CSS vars
│       └── package.json
├── docs/
│   └── PLAN.md                 # This file
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
└── README.md                   # Portfolio pitch + StackBlitz link
```

Two apps + four packages — one package per Figma library, except the Assets library (Icons + Illustrations pages) which splits into two packages since the two asset types have materially different color handling. This mirrors how the design source is organized, which is both a clarity win and a portfolio narrative ("code structure tracks design structure").

Workspace deps:
- `packages/ds` → `packages/tokens`, `packages/icons`
- `packages/icons` → `packages/tokens` (icons may reference color tokens for `currentColor` defaults / sizing)
- `packages/illustrations` → no workspace deps (multicolor SVGs carry their own fixed palette, not token-driven)
- `apps/locator` → `packages/ds` (and transitively `tokens` + `icons`), and optionally `packages/illustrations` directly (e.g. empty states)
- `apps/storybook` → `packages/ds`, `packages/illustrations`

Consumers import from each package directly (`@scope/tokens`, `@scope/icons`, `@scope/illustrations`, `@scope/ds`) — the DS does **not** re-export icons or illustrations. Keeping the packages separate preserves the Figma-mirror story and lets the locator pick icons or illustrations à la carte without dragging in the whole DS.

---

## Phase 1: Design System (`packages/ds`)

### 1.1 Token Pipeline (Figma "Styles" library → code)

Tokens are authored as native Figma Variables. The pipeline was originally scoped as free-plugin-only (see history note below), but is now a **one-time Tokens Studio Pro export**: Figma Variables were imported into Tokens Studio, cleaned up there (naming, typing, the `value`-as-token-name collision fixed — see §1.2), and exported once as a multi-file DTCG set. There is no live sync provider configured — re-syncing later means re-running the same manual export + adapter steps below, not an automatic pull.

1. **Author in Figma "Styles" library** — tokens live as native Figma variables, organized into collections (`color`, `density`), with names slash-delimited to match Figma's group separator (`color/bg/primary`, `density/padding/sm`). The `color` collection has two modes: `light` (primary) and `dark`. The `density` collection has two modes: `roomy` (default) and `condensed`. See §1.2 for naming conventions and §1.4 for the density system.
2. **Export from Tokens Studio Pro** — Figma Variables are imported into Tokens Studio, where each Figma Variable Collection becomes a Theme Group and each mode a Theme. Exporting via "Export file/folder" → "Multiple files" produces one JSON file per token set (`primitives/primitives.json`, `semantic/semantic.json`, `component/component.json`, `color/light.json`, `color/dark.json`, `density/condensed.json`, `density/roomy.json`), plus `$themes.json` (which sets compose into which Theme) and `$metadata.json` (`tokenSetOrder`, the merge precedence across sets). All committed as-is to `packages/tokens/source/tokens-studio/`.
3. **Merge with the Tokens Studio adapter** — `packages/tokens/scripts/tokens-studio-adapter.ts` reads `$themes.json`/`$metadata.json` to derive the group→mode→set mapping (not hardcoded to the current 7 file names), merges the sets into a single tree matching the collection/mode shape below, and normalizes each leaf from DTCG's `$value`/`$type`/`$description` to this project's `value`/`type`/`description` convention. Output replaces `packages/tokens/source/tokens.json`, which downstream tooling still consumes unchanged.
4. **Transform with Style Dictionary** — `packages/tokens/sd.preprocessors.ts` (rename the `value`-as-token-name collision, remap collection-relative aliases to full paths, resolving mode-relative references against each leaf's own enclosing mode) and `sd.transforms.ts` (path-based dimension/fontWeight/number classification, since even Tokens Studio's declared types don't fully disambiguate — see §1.2) feed into two build scripts:
   - `packages/tokens/scripts/build-tokens.ts` — multi-mode build (light+roomy / dark+roomy / light+condensed), diffed to produce:
     - `build/css/tokens.css` — base values on `:root` (light/roomy), including canonical mode-collection passthrough variables (e.g. `layout.*` colors, the raw density scale) that aren't yet referenced by any component
     - `build/css/dark.css` — sparse `[data-theme="dark"]` overrides (only tokens that actually differ from light)
     - `build/css/density.css` — `[data-density="roomy"]` and `[data-density="condensed"]` blocks, full in both (no single implicit default to diff against)
   - `packages/tokens/scripts/build-dtcg.ts` — `build/dtcg/tokens.{color}-{density}.json`, one fully-resolved, spec-compliant DTCG file per mode combination (no aliases, auto-generated `$description`s), for consumers outside this codebase (other tools, agents) that just need a self-contained token set.
   - `build/ts/tokens.ts` — typed token object (optional, for non-Tailwind consumers) — not yet built.
5. **Consume in DS** — `packages/ds/tailwind.preset.ts` imports the `build/css/*.css` files. Components reference Tailwind classes that resolve to CSS vars. Color classes use `hsl(var(--...))` syntax so dark mode lights up later with zero component changes.
6. **Validate** — the `tokens-json-review` skill (`.claude/skills/tokens-json-review/`) checks `packages/tokens/source/tokens.json` for double-encoding, unit-suffix correctness (type-aware: a unit is only wrong on a non-`dimension`-typed token), mode key-parity, and alias resolution before it's trusted as a build input.

**Pipeline history:** the original plan locked in "free Figma community plugin only, no Tokens Studio" to keep the showcase reproducible on a free plan. Several free plugins produced structurally broken exports (double-encoded JSON, no real aliasing, ambiguous `"value"`-as-token-name collisions, inconsistent unit handling), which is what motivated purchasing Tokens Studio Pro and doing a one-time, non-reproducible export instead — an explicit, conscious tradeoff for this proof-of-concept, not a reproducibility guarantee reviewers can expect to re-run from a fresh Figma file.

**Dark mode readiness without dark mode work:** The key decisions that make later dark-mode trivial are (a) the primitive/semantic split in §1.3, (b) CSS-var-based color references in Tailwind theme, and (c) component code that never hardcodes color values. The partial dark mode already authored in Figma is handled by the sparse `[data-theme="dark"]` block — only tokens with actual overrides appear there. As of the Tokens Studio export, that's exactly 12 tokens, all under `layout.backgroundColor.*`; no component currently references that part of the color tree, so dark mode is wired end-to-end but not yet visibly different from light for any shipped component.

### 1.2 Figma Hygiene: Layer & Prop Naming to Streamline Import

You'll normalize each of the three Figma libraries once, before its first export. Subsequent edits inherit the naming.

**In the Styles library (tokens):**
- **Variable names** — slash-delimited (Figma's native group separator), semantic-first: `color/bg/primary`, `color/text/muted`, `density/padding/sm`, `density/height/md`. Avoid spaces, ampersands, or marketing names. Style Dictionary transforms slashes to dashes in CSS output (`--color-bg-primary`, `--density-padding-sm`).
- **Collections & modes:**
  - `primitives` collection — single default mode. Raw values only: color scales (`blue.500`, `gray.100`), size, space, border-radius, font, and shadow primitives. Nothing in this collection is consumed directly by components.
  - `semantic` collection — single default mode. Role-based aliases onto primitives (`content.text-color.default` → `{primitives.color.neutral.100}`, typography and spacing roles, etc.). Not tied to any single component.
  - `component` collection — single default mode. Component-specific aliases onto semantic (and occasionally primitive) tokens, one group per component (`button.background-color.primary.default`, `card.border-radius`, etc.). Components should reference `component` tokens first, falling back to `semantic` where no component-specific override exists.
  - `color` collection — modes: `light` (primary), `dark`. Color-only tokens, referenced by the `semantic`/`component` tiers wherever a value needs to flip with the theme.
  - `density` collection — modes: `roomy` (default), `condensed`. Sizing/spacing-only tokens, referenced by the `semantic`/`component` tiers wherever a value needs to flip with density.
  - Mode names are lowercase bare words (no "Mode" suffix) so they map cleanly to `data-theme` and `data-density` attribute values.
- **Three-tier alias chain** — `primitives` → `semantic` → `component`. This is the load-bearing decision that makes future dark mode, density theming, and rebranding trivial: swapping a primitive or a `color`/`density` mode value cascades up through semantic and component aliases without touching component code.
- **Density values** — unitless numbers in Figma (px unit attached by Style Dictionary transform).

**In the Assets library, Icons page:**
- **Icon names** — kebab-case (`chevron-right`, `map-pin`). SVGR will PascalCase these on export (`ChevronRight`, `MapPin`).
- **Category frames** — icons are grouped into named frames/groups per category (e.g. a `Navigation` frame containing `chevron-right`, `chevron-left`, ...). The frame/group name becomes each icon's `category` in the generated manifest (§1.3) — keep frame names short, PascalCase or Title Case, one level deep. Don't nest category frames inside other category frames.
- **Single frame per icon** — uniform sizing (e.g. 24×24), centered, stroke-only or fill-only consistently. SVGR doesn't fix inconsistent source.
- **Use `currentColor`** — set icon strokes/fills to a single color in Figma and ensure the exported SVG uses `currentColor`. If Figma is exporting hex codes, run a post-export SVGO pass that swaps fills to `currentColor` (configured in SVGR).
- **No background frames** — flatten away wrapper rectangles before export, or the SVG will have a transparent square that breaks vertical alignment.

**In the Assets library, Illustrations page:**
- **Illustration names** — component names are `Illustrations/<Title Case Name>` (e.g. `Illustrations/Living Debt Free`) as currently authored, not kebab-case. The export script strips the `Illustrations/` prefix and kebab-cases the rest (`living-debt-free`); SVGR PascalCases from there, same as icons.
- **Multicolor is intentional** — do not flatten to `currentColor`; the SVGO/SVGR pipeline for this package skips the color-stripping pass entirely and preserves authored fills/strokes as-is. Confirmed via export: each illustration uses 7-8 distinct hex fills.
- **Uniform 104×104 frame** — confirmed via export: all 22 illustrations are 104×104 (one off-by-one at 105×104, treated as noise). Still flatten away background/wrapper frames before export.
- **Category frames optional** — grouping isn't required on this page; if present, it's ignored by the export pipeline (illustrations are few enough not to need a catalog taxonomy yet).

**Known inconsistencies as of the 2026-08-04 MCP export** (source of truth: the Figma file, not this list — re-check on every re-export):
- Icons use hardcoded `fill="#006DA3"`, not `currentColor` — the SVGO `currentColor` pass in `packages/icons/svgr.config.cjs` is load-bearing, not a defensive no-op.
- Not every icon is actually single-color: `trash`, `notice-error`, `data-vis-loss` use red `#CB0B31`; `checkmark-circle`/`data-vis-gain` use green `#247E58`; `notice-warning` uses orange `#D13805`; `notice-info` uses `#4B4D4E`; `rating-star-full`/`rating-star-half` use gold `#C08D16`; `rating-star-empty` uses gray `#7D8082` — these are intentional semantic accent colors, not the neutral default. The SVGR `replaceAttrValues` transform targets only the literal `#006DA3` string, leaving every other hex value untouched, so these icons keep their authored color instead of being flattened to `currentColor`.
- ~~`object-substract.svg` / `object_subtract.svg` naming drift~~ — fixed in Figma same day: renamed to `object-subtract` (24×24) and `object_subtract-sm` (16×16, underscore kept as authored).
- ~~`data-vis-heirarchy.svg` typo~~ — fixed in Figma same day: renamed to `data-vis-hierarchy`.
- ~~`building-institution.svg` exported at 26×26~~ — fixed in Figma same day: re-exports at 24×24, matching every other standard icon.

**In the Components library:**
- **Component property names must equal code prop names** — `intent`, `size`, `disabled`, not `Style`, `Size/Type`, `State`. Variant *values* must match too: `primary`, `ghost`, `sm`, `md` — not `Primary Button`, `Default`.
- **Slot/anatomy naming** — for compound components (Dialog, DropdownMenu, Card, etc.), Figma layers should match Radix anatomy: `Trigger`, `Content`, `Item`, `Separator`, `Label`, `Header`, `Body`, `Footer`. This makes the Figma file readable as a spec for the code.
- **Reference icons by name** — components that contain icons should reference the Icons library by name (`map-pin`), not contain inline SVG, so code can swap to `<MapPin />` deterministically.

### 1.3 Icons Pipeline (Figma "Assets" library, Icons page → code)

The Icons page gets its own package (`packages/icons`) and its own one-way pipeline. Export can go through the Figma Dev Mode MCP server (`mcp__figma__get_figma_data` + `download_figma_images` — available on this Pro plan with a Full seat) instead of a manual batch export, since the icons are all components on a single page.

1. **Export SVGs from Figma** — traverse the Icons page's category frames/groups (via MCP `get_figma_data`, or Figma's built-in batch export / the free **SVG Export** community plugin as a fallback), recording each icon's parent frame/group name as its category. Download SVGs into `packages/icons/source/*.svg` (flat — category isn't a folder split, see §1.2).
2. **Generate the category manifest** — a small script (run as part of `pnpm icons:build`, before SVGR) writes `packages/icons/src/generated/manifest.ts`: a `Record<string, { category: string }>` keyed by kebab-case icon name, sourced from the frame/group names captured in step 1. This is the only place category information is persisted — inspect the real MCP node tree first (frame nesting, naming) before writing the extraction logic, same lesson as the token pipeline: verify the export's actual shape, don't trust the docs.
3. **Transform with SVGR** — `svgr.config.cjs` configures:
   - Output to `packages/icons/src/generated/*.tsx`, one React component per icon, PascalCased.
   - Replace hardcoded fills/strokes with `currentColor` (via the `replaceAttrValues` config or an SVGO plugin) so icons inherit text color.
   - Spread incoming props to the root `<svg>` so consumers can pass `className`, `width`, `aria-label`, etc.
   - Type the props as `SVGProps<SVGSVGElement>` with an optional `size` shorthand.
4. **Barrel export** — `packages/icons/src/index.ts` re-exports every generated icon as a named export: `export { ChevronRight, MapPin, ... }`, plus the generated `manifest`. Tree-shaking handles dead-code elimination, so consumers only pay for what they import.
5. **Optional `<Icon name="..." />` wrapper** — a runtime-string API for cases where icon choice is data-driven (e.g. `location.category === 'cafe' ? 'coffee' : 'shop'`). Implemented as a lookup map over named exports. Skip if not needed.
6. **Refresh loop** — `pnpm icons:build` re-runs the manifest generator then SVGR. Two-step manual sync (`export from Figma` → `pnpm icons:build`).

**Why a separate package** (not bundled into `packages/ds`):
- Mirrors the Figma library split — clean conceptual story.
- The locator can import icons without dragging in the DS bundle.
- The icon pipeline (SVGR + SVGO) has no overlap with the DS build, so isolating it keeps `packages/ds`'s build config simple.

**Implementation notes / deviations from spec (2026-08-04 build), TODO for later:**
- **No `size` shorthand on generated components.** Step 3 above calls for one; it isn't implemented. Baking a dynamic `size` prop into SVGR's output requires a custom JS template (SVGR's template API builds the `<svg>` JSX from the source file's own static attributes, so merging in a runtime `size` variable means hand-rolling the AST rather than using SVGR's default template) — disproportionate complexity for 107 generated files when consumers can already do `<ChevronRight width={16} height={16} />` via prop spreading. TODO: if the locator (or a future `<Icon name="..." />` wrapper, step 5) ends up needing `size` in practice, implement it there instead of in every generated file.
- **Generated components use `forwardRef`, not React 19's ref-as-prop.** `svgr.config.cjs` sets `ref: true` for ref-forwarding support; SVGR's TypeScript template (last released 8.1.0, predates React 19's stable release) only knows how to implement that via `React.forwardRef`. This still works fine on React 19 (`forwardRef` isn't broken, just discouraged for new code per the React docs, which note a future release may deprecate it) — it's SVGR's default, not a deliberate choice. TODO: if SVGR ships React 19-native output, or if `forwardRef`'s deprecation becomes real, swap in a custom template using `function Icon({ ref, ...props })` instead. Low priority — no functional issue today. (Figma "Assets" library, Illustrations page → code)

The Illustrations page gets its own package (`packages/illustrations`), sibling to `packages/icons`, with a pipeline that mirrors the icons pipeline minus the color-normalization step:

1. **Export SVGs from Figma** — same mechanism as icons (MCP `get_figma_data`/`download_figma_images`, or manual batch export), targeting the Illustrations page instead. Category grouping is not extracted (§1.2 — optional and ignored on this page). Drop into `packages/illustrations/source/*.svg`.
2. **Transform with SVGR** — a separate `svgr.config.cjs` (not shared with `packages/icons`):
   - Output to `packages/illustrations/src/generated/*.tsx`, one React component per illustration, PascalCased.
   - **No `currentColor` replacement pass** — fills/strokes are left exactly as authored, since illustrations are intentionally multicolor.
   - Spread incoming props to the root `<svg>` (className, width/height) but do not add a `size` shorthand — illustrations aren't meant to be icon-scale.
3. **Barrel export** — `packages/illustrations/src/index.ts` re-exports every generated illustration as a named export: `export { EmptyState, OnboardingWelcome, ... }`.
4. **Refresh loop** — `pnpm illustrations:build` re-runs SVGR for this package. Same two-step manual sync as icons.

**Why a separate package from `packages/icons`** (not one shared assets package):
- The two asset types have genuinely different transform rules (currentColor coercion vs. none) — sharing one SVGR config would mean branching logic inside it instead of two simple configs.
- Consumers rarely need both at once; the locator can pull `packages/illustrations` for an empty state without any icon-specific tooling coming along.
- Keeps the "one Figma concern, one package" story intact even though both pages live in the same Figma library file.

### 1.4 Density System

The design system supports two density modes — **Roomy** (default) and **Condensed** — as an orthogonal dimension to color theming. Density controls the physical scale of components (padding, height, gap, icon size within components). It does not affect color, radius, font family, or font weight.

**Architecture:** CSS `data-density` attribute on ancestor elements. CSS custom properties cascade from the nearest `data-density` ancestor, so the full React component tree needs no changes for inheritance.

```
<html data-density="roomy">          ← global default
  …
  <aside data-density="condensed">   ← per-element override
    <List>…</List>                   ← inherits condensed from aside
    <Button size="sm" />             ← inherits condensed from aside
  </aside>
```

**Global default:** `<html data-density="roomy">` is set in both `apps/locator/index.html` and Storybook's `preview.ts`. Components never need to know the default — they just read CSS vars, which always resolve because `<html>` always carries one of the two values.

**Component `density` prop:** Every component with density-sensitive sizing accepts:
```ts
density?: 'roomy' | 'condensed'
```
When provided, the component sets `data-density={density}` on its root element. When omitted, the component inherits from its ancestor via CSS cascade.

**cva integration:** Density does **not** drive cva variants (that would require JS density awareness). Instead, density is purely CSS-var-driven. The `size` cva variant (`sm | md | lg`) selects which CSS vars a component references; the density mode controls what those vars resolve to:

```ts
const buttonVariants = cva({
  base: 'inline-flex items-center',
  variants: {
    size: {
      sm: 'h-[var(--density-height-sm)] px-[var(--density-padding-sm)] gap-[var(--density-gap-sm)]',
      md: 'h-[var(--density-height-md)] px-[var(--density-padding-md)] gap-[var(--density-gap-md)]',
    }
  }
})
```

**Portal caveat:** Radix overlays (Dialog, Tooltip, Popover) render into a portal outside the DOM tree, breaking CSS cascade inheritance. Pass the `density` prop explicitly to these components — the component sets `data-density` directly on the portal content root.

**`useDensity` hook (optional):** A thin hook reading the nearest `data-density` ancestor via attribute walk. Only needed in rare cases where JS must know the current density value (e.g., conditionally rendering different icon sizes). Not required for core functionality.

### 1.5 Future: Code as Source of Truth, Figma as Output

When the direction reverses later, the pipeline reverses by updating Figma Variables directly via a plugin that supports bidirectional variable sync (several free and paid options exist). To prepare now without doing the work:

- Keep `packages/tokens/source/` the only token input — never edit CSS vars by hand.
- Treat the JSON schema as a contract; document field shapes in `packages/tokens/README.md`.
- Avoid platform-specific token names in Figma (no `xs`, `2xl` Tailwind arbitraries) so the JSON stays platform-neutral.

This means the eventual flip is a workflow change, not a code rewrite. (Icons stay one-directional Figma → code — SVGs are visual source material.)

### 1.6 Component Scope

All four levels, built in this order (atoms before composites). Icons and illustrations are not in this list — they live in `packages/icons` and `packages/illustrations` and are consumed by DS components where needed.

| Level | Components | Notes |
|---|---|---|
| Primitives | Button, Input, Label, Badge, Avatar | `asChild` pattern via Radix `Slot` everywhere. Button supports icon children. |
| Layout | Stack, Box, Separator, Card | Card is a compound: `Card.Root`, `Card.Header`, `Card.Body`, `Card.Footer` |
| Overlays | Dialog, Popover, Tooltip, DropdownMenu | Built on Radix Primitives; styled via Tailwind + tokens |
| Data display | List, Tabs, Accordion, ScrollArea | Radix for Tabs/Accordion/ScrollArea; List is custom |

**Authoring conventions for every component:**
- Forward refs.
- Accept `className` + `asChild` where meaningful.
- Accept `density?: 'roomy' | 'condensed'`; when provided, set `data-density` on the component root.
- Variant API via `cva` exported alongside the component for product-level extension.
- All sizing (padding, height, gap) uses CSS vars from the density system — no hardcoded values.
- Compound components use dot-notation exports (`Card.Root`, `Dialog.Trigger`) to mirror Radix anatomy and Figma slot naming.
- Each component exports its props type for product consumption.
- **No hardcoded color, spacing, or radius values** — always reference Tailwind classes backed by tokens, so dark mode lights up later without component edits.
- Portal-rendered components (Dialog, Popover, Tooltip) set `data-density` on their content root when `density` prop is provided.

### 1.7 Storybook 8 Setup

- Hosted as `apps/storybook` so it's an independent workspace; reviewers can boot it without launching the locator.
- Vite builder (Storybook 8 default) for the closest match to the rest of the stack.
- Stories in CSF3 format, co-located in `packages/ds/src/components/<Name>/<Name>.stories.tsx`.
- A separate "Icons" section in the Storybook sidebar shows every icon in `packages/icons`, grouped by category (from the generated `manifest.ts`, §1.3), with its name and click-to-copy import — turns the icon library into a browsable catalog.
- A separate "Illustrations" section shows every illustration in `packages/illustrations` at a larger preview size (they're not icon-scale), with click-to-copy import. Ungrouped — no category taxonomy for this page (§1.2).
- Addons: `@storybook/addon-essentials`, `@storybook/addon-a11y` (a11y is a strong DS portfolio signal).
- **Density toolbar control** in `preview.ts` — a global toggle that sets `data-density` on the story root, letting reviewers switch roomy/condensed for any story without editing props.
- Each component story includes a **"Density comparison"** story that renders the component in both densities side-by-side.
- At least one story (Layout or Data Display section) demonstrates the per-element override pattern (e.g., a roomy Card containing a condensed List).
- One `Overview.mdx` page per category (Primitives, Layout, Overlays, Data display) documenting the design philosophy. Heavy on showing composition examples.
- **StackBlitz caveat:** Storybook 8 cold-boots in 60–120s in WebContainers. Mention this in the README so reviewers expect it. If it becomes a real bottleneck, Ladle is a drop-in CSF-compatible swap.

### 1.8 Phase 1 Exit Criteria

- All 17 DS components shipped with stories, variants, and prop types.
- Every icon in `packages/icons` is importable and renders in the Storybook Icons catalog, correctly grouped by category.
- Every illustration in `packages/illustrations` is importable and renders in the Storybook Illustrations catalog with authored colors intact (not coerced to `currentColor`).
- Every DS component renders correctly under both `roomy` and `condensed` in Storybook.
- The Storybook density toolbar toggle visibly resizes components between the two modes.
- At least one story demonstrates a per-element density override.
- Changing a density token value in the source JSON, re-running `pnpm tokens:build`, and reloading Storybook resizes affected components — confirms the density pipeline is connected end-to-end.
- `pnpm tokens:build && pnpm icons:build && pnpm illustrations:build && pnpm --filter ds build && pnpm --filter storybook dev` boots cleanly.
- Tokens documented in `packages/tokens/README.md`; icon authoring/export steps documented in `packages/icons/README.md`; illustration authoring/export steps documented in `packages/illustrations/README.md`.

---

## Phase 2: Store Locator (`apps/locator`)

Begins only after Phase 1 exit criteria are met.

### 2.1 Map Implementation

- **Library**: MapLibre GL JS — open-source MIT fork of Mapbox GL JS, no account, no API key. Bundle ~200KB gzipped; acceptable for the showcase.
- **Tiles**: free OpenStreetMap raster tiles (`https://tile.openstreetmap.org/{z}/{x}/{y}.png`). No key required. Looks slightly dated vs vector tiles but is zero-friction and StackBlitz-bulletproof.
- **Upgrade path** (note in code, don't implement): swap tile URL to MapTiler vector tiles for smooth zoom — requires a free account and public API key.
- **Wrapper**: a thin `<Map>` component in `apps/locator/src/components/Map/` that exposes imperative methods (`flyTo`, `setSelected`) via `useImperativeHandle`. Keeps MapLibre out of the rest of the app.
- **Data**: ~6–10 locations in `apps/locator/src/data/locations.ts` — typed array of `{ id, name, category, address, lat, lng, hours, open }`.

### 2.2 Locator UX Features

All four chosen:

1. **Side-by-side map + list** — composed from DS `Stack`, `Card`, `ScrollArea`.
2. **Pin popovers** — clicking a map pin opens a Radix `Popover` (DS export) anchored to the pin, showing store details composed from `Card.Header`, `Badge` (open/closed), `Stack`, and a primary `Button` for "Get directions".
3. **List ↔ map sync** —
   - Click a list row → `mapRef.current.flyTo({ center: [lng, lat], zoom: 14 })`, popover opens.
   - Click a pin → list scrolls to that row (DS `ScrollArea.scrollIntoView`) and row gets a selected style.
   - Single source of truth: a `selectedLocationId` in React state; both views render from it.
4. **Search/filter** — a `FilterBar` product component composed from DS `Input` (name search), `DropdownMenu` (category), `Badge` (open-now toggle). Filtering is client-side over the static array.

### 2.3 Composition Patterns to Showcase

The locator is the proof that the DS composes well. Make sure each of these is visible:

- **Out-of-the-box use**: `Button`, `Input`, `Avatar`, `Tabs` consumed directly.
- **Sub-component composition**: `Card.Root` + `Card.Header` + `Card.Body` assembled into a `LocationCard` product component — not a DS export.
- **Icon composition**: `<Button><MapPin />Directions</Button>` and `<Badge><Clock />Open now</Badge>` — shows the icons package composing cleanly with DS components.
- **`asChild` pattern**: `<Button asChild><a href="...">Directions</a></Button>` for the directions link, proving Radix slot composition works through the DS.
- **Variant extension via cva**: the `LocationCard` extends `Card`'s cva recipe to add a `selected` variant — demonstrates the DS doesn't lock you in.

### 2.4 Phase 2 Exit Criteria

- All four UX features working end-to-end.
- At least three product-level components composed from DS primitives (e.g., `LocationCard`, `FilterBar`, `LocationDetailsPopover`).
- Tokens flow end-to-end from `packages/tokens` through the DS into the locator UI (verifiable by changing a semantic color in the token JSON, re-running the build, and seeing the locator re-skin).
- `pnpm --filter locator dev` boots cleanly on a fresh StackBlitz fork.

---

## Critical Files to Create (when implementation begins)

```
pnpm-workspace.yaml                              # workspace globs
turbo.json                                       # task pipeline
package.json                                     # root scripts
packages/tokens/source/tokens-studio/            # Raw multi-file Tokens Studio Pro export (committed as-is)
packages/tokens/source/tokens.json               # Merged output of the adapter; what the build pipeline reads
packages/tokens/scripts/tokens-studio-adapter.ts # Merges source/tokens-studio/* into source/tokens.json
packages/tokens/sd.preprocessors.ts              # value-collision rename + self-mode-aware alias remapping
packages/tokens/sd.transforms.ts                 # path-based dimension/fontWeight/number classification
packages/tokens/scripts/build-tokens.ts          # multi-mode CSS build (tokens.css/dark.css/density.css)
packages/tokens/scripts/build-dtcg.ts            # resolved DTCG JSON per color x density combination
packages/tokens/build/css/tokens.css             # :root color + base vars (light/roomy)
packages/tokens/build/css/dark.css               # [data-theme="dark"] sparse color overrides
packages/tokens/build/css/density.css            # [data-density="roomy"] + [data-density="condensed"]
packages/tokens/build/dtcg/tokens.{color}-{density}.json  # fully-resolved DTCG export, one per mode combo
packages/icons/source/*.svg                      # Figma "Assets" library, Icons page export target
packages/icons/svgr.config.cjs                   # SVGR config (currentColor pass on)
packages/icons/scripts/build-manifest.ts         # derives name -> category from Figma frame/group grouping
packages/icons/src/generated/manifest.ts         # generated: name -> category
packages/icons/src/index.ts                      # icon barrel (+ manifest export)
packages/illustrations/source/*.svg              # Figma "Assets" library, Illustrations page export target
packages/illustrations/svgr.config.cjs           # SVGR config (currentColor pass off, colors preserved)
packages/illustrations/src/index.ts              # illustration barrel
packages/ds/tailwind.preset.ts                   # shared Tailwind preset reading CSS vars (all three CSS files)
packages/ds/src/index.ts                         # component barrel
packages/ds/src/utils/cn.ts                      # clsx + tailwind-merge helper
packages/ds/src/components/<Name>/<Name>.tsx     # one per component
packages/ds/src/components/<Name>/<Name>.stories.tsx
apps/storybook/.storybook/main.ts                # Storybook 8 config
apps/storybook/.storybook/preview.ts             # global decorators + density toolbar + data-density="roomy"
apps/locator/index.html                          # data-density="roomy" on <html>
apps/locator/src/data/locations.ts               # static location data
apps/locator/src/components/Map/Map.tsx          # MapLibre wrapper
apps/locator/src/components/LocationCard.tsx     # DS composition example
apps/locator/src/components/FilterBar.tsx        # DS composition example
docs/PLAN.md                                     # this file
README.md                                        # StackBlitz pitch
```

---

## Verification

End-to-end smoke when each phase completes:

**Phase 1 (Design system):**
- `pnpm install && pnpm tokens:build && pnpm icons:build && pnpm illustrations:build && pnpm --filter storybook dev` boots Storybook locally.
- Every DS component renders in Storybook with its variants.
- Every icon appears in the Storybook Icons catalog, grouped by category, with a working import snippet.
- Every illustration appears in the Storybook Illustrations catalog with authored colors intact and a working import snippet.
- a11y addon shows zero critical violations on every story.
- Storybook density toolbar switches all components between roomy and condensed.
- At least one story shows a per-element density override.
- Changing a semantic color in the token source JSON, re-running `pnpm tokens:build`, and re-loading Storybook re-skins components — proves the color token pipeline is connected.
- Changing a density value in the token source JSON, re-running `pnpm tokens:build`, and re-loading Storybook resizes affected components — proves the density pipeline is connected.
- Open the same flow on a fresh StackBlitz fork of the repo — confirm boot completes under 3 minutes (Storybook is the long pole).

**Phase 2 (Locator):**
- `pnpm --filter locator dev` boots the locator.
- Click each list row → map flies to that pin, popover opens.
- Click each map pin → list row highlights and scrolls into view.
- Type in search box → list + pins filter together.
- Toggle category dropdown and open-now badge → filters compose.
- Changing a semantic color in the token source JSON and re-running the token build re-skins the locator UI — same proof as in Phase 1, now across the package boundary.
- Open on a fresh StackBlitz fork — confirm full interaction works in WebContainers.

---

## Plan Storage

This file lives at `docs/PLAN.md` at the repo root.

- Versioned with the code, so every change is reviewable.
- Renders natively on GitHub and on the StackBlitz file tree.
- README.md should link to it: `> See [docs/PLAN.md](./docs/PLAN.md) for the full architecture and roadmap.`
- Once Phase 1 ships, fold the "done" sections into a `docs/ARCHITECTURE.md` and keep PLAN.md focused on the active phase. Optional.
