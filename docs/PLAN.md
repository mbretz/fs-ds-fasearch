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
| Token export | Free Figma community plugin (Figma-native only — no Tokens Studio) |
| Figma source structure | Three libraries: **Styles** (tokens), **Icons**, **Components** — mirrored 1:1 in code as three packages |
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
│   ├── icons/                  # Mirrors Figma "Icons" library
│   │   ├── source/             # Raw SVGs exported from Figma
│   │   ├── src/
│   │   │   ├── generated/      # SVGR output: one .tsx per icon
│   │   │   ├── Icon.tsx        # Optional <Icon name="..." /> wrapper
│   │   │   └── index.ts        # Named exports: ChevronRight, MapPin, etc.
│   │   ├── svgr.config.cjs
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

Two apps + three packages — one package per Figma library. This mirrors how the design source is organized, which is both a clarity win and a portfolio narrative ("code structure tracks design structure").

Workspace deps:
- `packages/ds` → `packages/tokens`, `packages/icons`
- `packages/icons` → `packages/tokens` (icons may reference color tokens for `currentColor` defaults / sizing)
- `apps/locator` → `packages/ds` (and transitively `tokens` + `icons`)
- `apps/storybook` → `packages/ds`

Consumers import from each package directly (`@scope/tokens`, `@scope/icons`, `@scope/ds`) — the DS does **not** re-export icons. Keeping the packages separate preserves the Figma-mirror story and lets the locator pick icons à la carte without dragging in the whole DS.

---

## Phase 1: Design System (`packages/ds`)

### 1.1 Token Pipeline (Figma "Styles" library → code)

Tokens are authored as native Figma Variables. The pipeline is entirely one-way (Figma → code); no Tokens Studio is required.

1. **Author in Figma "Styles" library** — tokens live as native Figma variables, organized into collections (`color`, `density`). The `color` collection has two modes: `light` (primary) and `dark`. The `density` collection has two modes: `roomy` (default) and `condensed`. See §1.2 for naming conventions and §1.4 for the density system.
2. **Export from Figma** — use a free Figma community plugin to export all native Variables with all modes to `packages/tokens/source/`. The exact plugin is selected at first export by inspecting output quality (candidates: "Export/Import Variables", "Variables to JSON"). The export is a single command producing one JSON file (or separate files per mode if the plugin outputs that way — both are handled by the Style Dictionary config).
3. **Transform with Style Dictionary** — `packages/tokens` runs Style Dictionary (`sd.config.ts`) to emit four CSS files. The config includes a lightweight custom `parser` that normalizes Figma's export format (written once after inspecting the actual plugin output):
   - `build/css/tokens.css` — color CSS custom properties on `:root` (light mode)
   - `build/css/dark.css` — color overrides on `[data-theme="dark"]` (sparse — only tokens that differ from light)
   - `build/css/density.css` — density vars on `[data-density="roomy"]` and `[data-density="condensed"]`
   - `build/ts/tokens.ts` — typed token object (optional, for non-Tailwind consumers)
4. **Consume in DS** — `packages/ds/tailwind.preset.ts` imports all three CSS files. Components reference Tailwind classes that resolve to CSS vars. Color classes use `hsl(var(--...))` syntax so dark mode lights up later with zero component changes.
5. **Refresh loop** — `pnpm tokens:build` re-runs the pipeline. Document the sync as a manual two-step (`export from Figma plugin` → `pnpm tokens:build`).

**Dark mode readiness without dark mode work:** The key decisions that make later dark-mode trivial are (a) the primitive/semantic split in §1.3, (b) CSS-var-based color references in Tailwind theme, and (c) component code that never hardcodes color values. The partial dark mode already authored in Figma is handled by the sparse `[data-theme="dark"]` block — only tokens with actual overrides appear there.

### 1.2 Figma Hygiene: Layer & Prop Naming to Streamline Import

You'll normalize each of the three Figma libraries once, before its first export. Subsequent edits inherit the naming.

**In the Styles library (tokens):**
- **Variable names** — dot-delimited, semantic-first: `color.bg.primary`, `color.text.muted`, `density.padding.sm`, `density.height.md`. Avoid spaces, ampersands, or marketing names.
- **Collections & modes:**
  - `color` collection — modes: `light` (primary), `dark`. Color tokens only.
  - `density` collection — modes: `roomy` (default), `condensed`. Sizing/spacing tokens only.
  - Mode names are lowercase bare words (no "Mode" suffix) so they map cleanly to `data-theme` and `data-density` attribute values.
- **Semantic vs primitive layers** — split into two collections within color: `primitives` (raw values: `blue.500`, `gray.100`) and `semantic` (aliases: `color.bg.primary` → `{primitives.blue.500}`). Components only reference semantic tokens. This is the load-bearing decision that makes future dark mode and rebranding trivial.
- **Density values** — unitless numbers in Figma (px unit attached by Style Dictionary transform).

**In the Icons library:**
- **Icon names** — kebab-case (`chevron-right`, `map-pin`). SVGR will PascalCase these on export (`ChevronRight`, `MapPin`).
- **Single frame per icon** — uniform sizing (e.g. 24×24), centered, stroke-only or fill-only consistently. SVGR doesn't fix inconsistent source.
- **Use `currentColor`** — set icon strokes/fills to a single color in Figma and ensure the exported SVG uses `currentColor`. If Figma is exporting hex codes, run a post-export SVGO pass that swaps fills to `currentColor` (configured in SVGR).
- **No background frames** — flatten away wrapper rectangles before export, or the SVG will have a transparent square that breaks vertical alignment.

**In the Components library:**
- **Component property names must equal code prop names** — `intent`, `size`, `disabled`, not `Style`, `Size/Type`, `State`. Variant *values* must match too: `primary`, `ghost`, `sm`, `md` — not `Primary Button`, `Default`.
- **Slot/anatomy naming** — for compound components (Dialog, DropdownMenu, Card, etc.), Figma layers should match Radix anatomy: `Trigger`, `Content`, `Item`, `Separator`, `Label`, `Header`, `Body`, `Footer`. This makes the Figma file readable as a spec for the code.
- **Reference icons by name** — components that contain icons should reference the Icons library by name (`map-pin`), not contain inline SVG, so code can swap to `<MapPin />` deterministically.

### 1.3 Icons Pipeline (Figma "Icons" library → code)

The Icons library gets its own package (`packages/icons`) and its own one-way pipeline:

1. **Export SVGs from Figma** — select all icon components in the Icons library, use Figma's built-in batch export (or the free **SVG Export** community plugin for bulk). Drop them into `packages/icons/source/*.svg`.
2. **Transform with SVGR** — `svgr.config.cjs` configures:
   - Output to `packages/icons/src/generated/*.tsx`, one React component per icon, PascalCased.
   - Replace hardcoded fills/strokes with `currentColor` (via the `replaceAttrValues` config or an SVGO plugin) so icons inherit text color.
   - Spread incoming props to the root `<svg>` so consumers can pass `className`, `width`, `aria-label`, etc.
   - Type the props as `SVGProps<SVGSVGElement>` with an optional `size` shorthand.
3. **Barrel export** — `packages/icons/src/index.ts` re-exports every generated icon as a named export: `export { ChevronRight, MapPin, ... }`. Tree-shaking handles dead-code elimination, so consumers only pay for what they import.
4. **Optional `<Icon name="..." />` wrapper** — a runtime-string API for cases where icon choice is data-driven (e.g. `location.category === 'cafe' ? 'coffee' : 'shop'`). Implemented as a lookup map over named exports. Skip if not needed.
5. **Refresh loop** — `pnpm icons:build` re-runs SVGR. Two-step manual sync (`export from Figma` → `pnpm icons:build`).

**Why a separate package** (not bundled into `packages/ds`):
- Mirrors the Figma library split — clean conceptual story.
- The locator can import icons without dragging in the DS bundle.
- The icon pipeline (SVGR + SVGO) has no overlap with the DS build, so isolating it keeps `packages/ds`'s build config simple.

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

All four levels, built in this order (atoms before composites). Icons are not in this list — they live in `packages/icons` and are consumed by DS components where needed.

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
- A separate "Icons" section in the Storybook sidebar shows every icon in `packages/icons` with its name and click-to-copy import — turns the icon library into a browsable catalog.
- Addons: `@storybook/addon-essentials`, `@storybook/addon-a11y` (a11y is a strong DS portfolio signal).
- **Density toolbar control** in `preview.ts` — a global toggle that sets `data-density` on the story root, letting reviewers switch roomy/condensed for any story without editing props.
- Each component story includes a **"Density comparison"** story that renders the component in both densities side-by-side.
- At least one story (Layout or Data Display section) demonstrates the per-element override pattern (e.g., a roomy Card containing a condensed List).
- One `Overview.mdx` page per category (Primitives, Layout, Overlays, Data display) documenting the design philosophy. Heavy on showing composition examples.
- **StackBlitz caveat:** Storybook 8 cold-boots in 60–120s in WebContainers. Mention this in the README so reviewers expect it. If it becomes a real bottleneck, Ladle is a drop-in CSF-compatible swap.

### 1.8 Phase 1 Exit Criteria

- All 17 DS components shipped with stories, variants, and prop types.
- Every icon in `packages/icons` is importable and renders in the Storybook Icons catalog.
- Every DS component renders correctly under both `roomy` and `condensed` in Storybook.
- The Storybook density toolbar toggle visibly resizes components between the two modes.
- At least one story demonstrates a per-element density override.
- Changing a density token value in the source JSON, re-running `pnpm tokens:build`, and reloading Storybook resizes affected components — confirms the density pipeline is connected end-to-end.
- `pnpm tokens:build && pnpm icons:build && pnpm --filter ds build && pnpm --filter storybook dev` boots cleanly.
- Tokens documented in `packages/tokens/README.md`; icon authoring/export steps documented in `packages/icons/README.md`.

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
packages/tokens/source/                          # Figma plugin export target (one file or per-mode files)
packages/tokens/sd.config.ts                     # Style Dictionary config + custom Figma format parser
packages/tokens/build/css/tokens.css             # SD output: :root color vars (light)
packages/tokens/build/css/dark.css               # SD output: [data-theme="dark"] color overrides
packages/tokens/build/css/density.css            # SD output: [data-density="roomy"] + [data-density="condensed"]
packages/icons/source/*.svg                      # Figma "Icons" export target
packages/icons/svgr.config.cjs                   # SVGR config
packages/icons/src/index.ts                      # icon barrel
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
- `pnpm install && pnpm tokens:build && pnpm icons:build && pnpm --filter storybook dev` boots Storybook locally.
- Every DS component renders in Storybook with its variants.
- Every icon appears in the Storybook Icons catalog with a working import snippet.
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
