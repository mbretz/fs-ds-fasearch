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
| Token source | Native Figma variables (Pro plan — no REST API access) |
| Figma source structure | Three libraries: **Styles** (tokens), **Icons**, **Components** — mirrored 1:1 in code as three packages |
| Theming | **Light mode only** at launch; architecture keeps dark mode a token-mode addition (no rewrites) |
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
│   │   ├── source/             # Raw export from Figma plugin (tokens.json)
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

Since you're on a Pro plan (no Variables REST API), the pipeline is:

1. **Author in Figma "Styles" library** — tokens live as native Figma variables, organized into collections (`color`, `space`, `radius`, `font`, `shadow`, etc.). **A single mode for now** (call it `default`), but author with the two-layer split below so adding a `dark` mode later is purely an additive change in Figma.
2. **Export from Figma** — use the free **Tokens Studio for Figma** plugin in *variable sync* mode. It reads native Figma variables and exports W3C-spec design tokens JSON. Commit the JSON to `packages/tokens/source/tokens.json`.
3. **Transform with Style Dictionary** — `packages/tokens` runs Style Dictionary to emit:
   - `build/css/tokens.css` — CSS custom properties on `:root`. (No `[data-theme="dark"]` block yet — added later by re-running the pipeline once a dark mode exists in Figma.)
   - `build/ts/tokens.ts` — typed token object (optional, for non-Tailwind consumers).
   - `build/tailwind/theme.ts` — partial Tailwind theme extension that references the CSS vars (e.g. `colors: { bg: { primary: 'hsl(var(--color-bg-primary) / <alpha-value>)' } }`). Using `hsl(var(--...))` syntax now means dark mode lights up later with zero component changes.
4. **Consume in DS** — `packages/ds/tailwind.preset.ts` imports the generated Tailwind theme extension. Components reference Tailwind classes that resolve to CSS vars.
5. **Refresh loop** — `pnpm tokens:build` re-runs the pipeline. Document the sync as a manual two-step (`export from plugin` → `pnpm tokens:build`); automate later if desired.

**Why Tokens Studio for the export step (not Variables2CSS or similar):** it speaks W3C design-tokens spec, which is what Style Dictionary v4 ingests natively. It also supports the reverse direction (code → Figma variables), which sets up §1.4 without a tooling swap.

**Dark mode readiness without dark mode work:** the key decisions that make later dark-mode trivial are (a) the primitive/semantic split in §1.3, (b) CSS-var-based color references in Tailwind theme, and (c) component code that never hardcodes color values. None of these cost anything today.

### 1.2 Figma Hygiene: Layer & Prop Naming to Streamline Import

You'll normalize each of the three Figma libraries once, before its first export. Subsequent edits inherit the naming.

**In the Styles library (tokens):**
- **Variable names** — dot-delimited, semantic-first: `color.bg.primary`, `color.text.muted`, `space.4`, `radius.md`. Avoid spaces, ampersands, or marketing names. Style Dictionary preserves this hierarchy.
- **Collections & modes** — one collection per token category. A single mode (`default`) for now; when dark mode is added later, the mode is named `dark` (lowercase, no "Mode" suffix) so it maps cleanly to `data-theme="dark"`.
- **Semantic vs primitive layers** — split into two collections: `primitives` (raw values: `blue.500`, `gray.100`) and `semantic` (aliases: `color.bg.primary` → `{primitives.blue.500}`). Components only reference semantic tokens. This is the load-bearing decision that makes future dark mode and rebranding trivial.

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

### 1.4 Future: Code as Source of Truth, Figma as Output

When you flip the direction later, the pipeline reverses cleanly because Tokens Studio is bidirectional:

1. Tokens are edited in `packages/tokens/source/tokens.json` (or in a typed `tokens.ts` that emits the JSON via a build step).
2. Style Dictionary builds runtime artifacts as before.
3. **Tokens Studio plugin pulls the JSON** and *writes* to Figma variables (the plugin supports this on free tier).
4. Designers see updates in Figma's Styles library; no native REST API needed.

To prepare now without doing the work:
- Keep `packages/tokens/source/tokens.json` the only token input — never let CSS vars be edited by hand.
- Treat the JSON schema as a contract; document field shapes in `packages/tokens/README.md`.
- Avoid Tailwind-specific token names in Figma (no `xs`, `2xl` arbitraries) so the JSON stays platform-neutral.

This means the eventual flip is a workflow change, not a code rewrite. (Icons stay one-directional Figma → code — SVGs are visual source material that doesn't have a meaningful code-as-source story.)

### 1.5 Component Scope

All four levels, built in this order (atoms before composites). Icons are not in this list — they live in `packages/icons` and are consumed by DS components where needed (e.g. Button can render a leading/trailing icon via children or a dedicated slot).

| Level | Components | Notes |
|---|---|---|
| Primitives | Button, Input, Label, Badge, Avatar | `asChild` pattern via Radix `Slot` everywhere. Button supports icon children. |
| Layout | Stack, Box, Separator, Card | Card is a compound: `Card.Root`, `Card.Header`, `Card.Body`, `Card.Footer` |
| Overlays | Dialog, Popover, Tooltip, DropdownMenu | Built on Radix Primitives; styled via Tailwind + tokens |
| Data display | List, Tabs, Accordion, ScrollArea | Radix for Tabs/Accordion/ScrollArea; List is custom |

**Authoring conventions for every component:**
- Forward refs.
- Accept `className` + `asChild` where meaningful.
- Variant API via `cva` exported alongside the component for product-level extension.
- Compound components use dot-notation exports (`Card.Root`, `Dialog.Trigger`) to mirror Radix anatomy and Figma slot naming.
- Each component exports its props type for product consumption.
- **No hardcoded color, spacing, or radius values** — always reference Tailwind classes backed by tokens, so dark mode lights up later without component edits.

### 1.6 Storybook 8 Setup

- Hosted as `apps/storybook` so it's an independent workspace; reviewers can boot it without launching the locator.
- Vite builder (Storybook 8 default) for the closest match to the rest of the stack.
- Stories in CSF3 format, co-located in `packages/ds/src/components/<Name>/<Name>.stories.tsx`.
- A separate "Icons" section in the Storybook sidebar shows every icon in `packages/icons` with its name and click-to-copy import — turns the icon library into a browsable catalog.
- Addons: `@storybook/addon-essentials`, `@storybook/addon-a11y` (a11y is a strong DS portfolio signal). **No `addon-themes` yet** — single light mode at launch. Wire it in when dark mode tokens land; the rest of Storybook needs zero changes.
- One `Overview.mdx` page per category (Primitives, Layout, Overlays, Data display) documenting the design philosophy. Heavy on showing composition examples.
- **StackBlitz caveat:** Storybook 8 cold-boots in 60–120s in WebContainers. Mention this in the README so reviewers expect it. If it becomes a real bottleneck, Ladle is a drop-in CSF-compatible swap.

### 1.7 Phase 1 Exit Criteria

- All 17 DS components shipped with stories, variants, and prop types.
- Every icon in `packages/icons` is importable and renders in the Storybook Icons catalog.
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
packages/tokens/source/tokens.json               # Figma "Styles" export target
packages/tokens/sd.config.ts                     # Style Dictionary config
packages/icons/source/*.svg                      # Figma "Icons" export target
packages/icons/svgr.config.cjs                   # SVGR config
packages/icons/src/index.ts                      # icon barrel
packages/ds/tailwind.preset.ts                   # shared Tailwind preset
packages/ds/src/index.ts                         # component barrel
packages/ds/src/utils/cn.ts                      # clsx + tailwind-merge helper
packages/ds/src/components/<Name>/<Name>.tsx     # one per component
packages/ds/src/components/<Name>/<Name>.stories.tsx
apps/storybook/.storybook/main.ts                # Storybook 8 config
apps/storybook/.storybook/preview.ts             # global decorators
apps/locator/src/data/locations.ts               # static location data
apps/locator/src/components/Map/Map.tsx          # MapLibre wrapper
apps/locator/src/components/LocationCard.tsx    # DS composition example
apps/locator/src/components/FilterBar.tsx       # DS composition example
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
- Changing a semantic color in `packages/tokens/source/tokens.json`, re-running `pnpm tokens:build`, and re-loading Storybook re-skins components — proves the token pipeline is connected.
- Open the same flow on a fresh StackBlitz fork of the repo — confirm boot completes under 3 minutes (Storybook is the long pole).

**Phase 2 (Locator):**
- `pnpm --filter locator dev` boots the locator.
- Click each list row → map flies to that pin, popover opens.
- Click each map pin → list row highlights and scrolls into view.
- Type in search box → list + pins filter together.
- Toggle category dropdown and open-now badge → filters compose.
- Changing a semantic color in `packages/tokens/source/tokens.json` and re-running the token build re-skins the locator UI — same proof as in Phase 1, now across the package boundary.
- Open on a fresh StackBlitz fork — confirm full interaction works in WebContainers.

---

## Plan Storage

This file lives at `docs/PLAN.md` at the repo root.

- Versioned with the code, so every change is reviewable.
- Renders natively on GitHub and on the StackBlitz file tree.
- README.md should link to it: `> See [docs/PLAN.md](./docs/PLAN.md) for the full architecture and roadmap.`
- Once Phase 1 ships, fold the "done" sections into a `docs/ARCHITECTURE.md` and keep PLAN.md focused on the active phase. Optional.
