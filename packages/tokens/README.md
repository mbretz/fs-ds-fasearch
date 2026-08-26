# tokens

Mirrors the Figma "Styles" library. One-time, non-reproducible pipeline: Figma Variables → Tokens Studio Pro export → merge → transform → CSS/DTCG. See [docs/PLAN.md §1.1](../../docs/PLAN.md) for the full spec and the "Pipeline history" note on why this isn't a live sync.

## Structure

```
source/tokens-studio/     Raw multi-file Tokens Studio Pro export (committed as-is)
  $themes.json               Which sets compose into which Theme (group -> mode -> set)
  $metadata.json              tokenSetOrder: merge precedence across sets
  primitives/primitives.json  Raw values: color scales, size/space/radius/font/shadow primitives
  semantic/semantic.json      Role-based aliases onto primitives
  component/component.json    Component-specific aliases onto semantic/primitives
  color/{light,dark}.json     Color-only tokens, one file per mode
  density/{roomy,condensed}.json  Sizing/spacing-only tokens, one file per mode
source/tokens.json        Merged output of the adapter -- what the rest of the pipeline reads
scripts/tokens-studio-adapter.ts  Merges source/tokens-studio/* -> source/tokens.json
sd.preprocessors.ts       Style Dictionary preprocessors (alias-path remap, value-key collision fix)
sd.transforms.ts          Style Dictionary transforms (path-based dimension/fontWeight/number typing)
scripts/mode-build.ts     Shared mode-aware build helper used by every build script below
scripts/flatten-tokens.ts Shared per-mode-combo flattening + naming, used by build-dtcg/js/swift/kotlin
scripts/build-tokens.ts   Multi-mode CSS build -> build/css/*.css
scripts/build-dtcg.ts     Resolved DTCG JSON per mode combo -> build/dtcg/*.json
scripts/build-js.ts       Resolved JS/TS values per mode combo -> build/js/tokens.ts
scripts/build-swift.ts    Resolved Swift values per mode combo -> build/swift/Tokens.swift
scripts/build-kotlin.ts   Resolved Kotlin values per mode combo -> build/kotlin/Tokens.kt
build/css/tokens.css      :root base values (light + roomy)
build/css/dark.css        [data-theme="dark"] sparse overrides (only tokens that differ from light)
build/css/density.css     [data-density="roomy"] and [data-density="condensed"], full in both
build/dtcg/tokens.{color}-{density}.json  Fully-resolved DTCG JSON, one file per mode combination
build/js/tokens.ts        Fully-resolved JS/TS values, one flat object per mode combo + a getTokens() lookup
build/swift/Tokens.swift  Fully-resolved Swift values, one enum namespace per mode combo (no consumer here)
build/kotlin/Tokens.kt    Fully-resolved Kotlin values, one object per mode combo (no consumer here)
```

Prefer the CSS vars above for anything in `packages/ds`/web code — they get theming/density for free from the cascade. `build/js/tokens.ts` exists for the cases a CSS value can't reach, e.g. a numeric-only prop on a Radix primitive (`Popover`'s `sideOffset`); it is not a general substitute for a CSS var reference. Swift/Kotlin have no consumer in this repo — they exist to demonstrate the full cross-platform pipeline.

## Building

```
pnpm tokens:build          # from repo root
pnpm --filter tokens build # equivalent
```

Runs `build:css`, `build:dtcg`, `build:js`, `build:swift`, and `build:kotlin` in sequence (each has its own `pnpm --filter tokens build:<name>` if you only need one). All read `source/tokens.json` — none touch `source/tokens-studio/` or Figma.

`pnpm --filter tokens import:tokens-studio` re-runs the adapter (`source/tokens-studio/*` → `source/tokens.json`) if the raw Tokens Studio export is ever re-pulled. This is the one step that's a manual, one-time action per re-export — see "Refreshing from Figma" below.

## Refreshing from Figma

There is no live sync. To pull in changes:

1. Edit Figma Variables in the "Styles" library.
2. Re-export from Tokens Studio Pro ("Export file/folder" → "Multiple files"), overwriting `source/tokens-studio/*`.
3. `pnpm --filter tokens import:tokens-studio` to re-merge into `source/tokens.json`.
4. `pnpm tokens:build` to regenerate CSS/DTCG output.

The `.claude/skills/tokens-json-review/` skill checks `source/tokens.json` for double-encoding, unit-suffix correctness, mode key-parity, and alias resolution before trusting it as a build input — run it after step 3, before step 4, if something looks off.

Before re-exporting, check `HAND_ADDED_TOKENS.md` (gitignored, local) for any tokens that were hand-added to `source/tokens.json` directly rather than pulled from a real Figma Variable — author those as real Variables in this pass so the next export doesn't silently drop them.

## Three-tier alias chain

`primitives` → `semantic` → `component`, each a single-mode collection. This is the load-bearing decision that makes theming/rebranding cheap later: swapping a primitive, or a `color`/`density` mode value, cascades up through semantic and component aliases without touching component code. Components should reference `component` tokens first, falling back to `semantic` where no component-specific override exists — never reference `primitives` directly from component code.

`color` (`light`/`dark`) and `density` (`roomy`/`condensed`) are the two multi-mode collections, referenced by the `semantic`/`component` tiers wherever a value needs to flip with theme or density.

## Why the preprocessors/transforms exist (not defensive boilerplate)

- **`sd.preprocessors.ts` — alias-path remapping.** The Tokens Studio export writes aliases relative to whichever collection sub-root a token lives under (e.g. `{control.action.color.default}`), not as the full merged path Style Dictionary's resolver expects. This preprocessor rewrites every alias to its real full path before resolution, in two passes: a static namespace pass for the single-mode collections (`primitives`/`semantic`/`component`), and a mode-relative pass for `color`/`density` that resolves against each leaf's own enclosing mode.
- **`sd.preprocessors.ts` — value-key collision fix.** Five components (checkbox, searchInput, selectInput, and others) have a token literally named `value` inside a group also named `value` — colliding with Style Dictionary's reserved `value` key. Fixed by renaming before the tree reaches Style Dictionary's parser.
- **`sd.transforms.ts` — path-based type inference.** The Tokens Studio export tags almost every non-color token as the generic DTCG type `"number"` — true but useless for output, since a border-radius, a font-weight, and an opacity are all numbers but need different CSS treatment (`px` suffix or not). Transforms infer intent from each token's _path_ (does it contain `borderRadius`, `fontWeight`, `padding`, …) rather than trusting the declared `$type`. If a future export starts emitting correct DTCG types, switch the filters to check `$type` first and fall back to the path heuristic only where it's still wrong.

## Multi-mode CSS output, and why it's split into three files instead of one

`scripts/build-tokens.ts` runs the _same_ token set through three mode combinations (light+roomy / dark+roomy / light+condensed) and diffs the results, rather than trusting declared token types to say whether a token is color-affected, density-affected, or neither:

- `tokens.css` — base values on `:root` (light/roomy), including passthrough tokens not yet referenced by any component.
- `dark.css` — sparse `[data-theme="dark"]` block: only tokens whose resolved value actually differs from light. As of the current export, that's 12 tokens, all under `layout.backgroundColor.*` — no shipped component references that part of the tree yet, so dark mode is wired end-to-end but not visibly different from light for anything built so far.
- `density.css` — `[data-density="roomy"]` and `[data-density="condensed"]`, both written in full (no single implicit default to diff against, unlike color).

## DTCG output

`scripts/build-dtcg.ts` emits one fully-resolved, spec-compliant DTCG JSON file per color × density combination (`build/dtcg/tokens.{color}-{density}.json`) — no aliases, auto-generated `$description`s. This is for consumers _outside_ this codebase (other tools, other agents) that just need a self-contained token set without understanding this pipeline's alias-resolution or mode-selection logic. Not consumed by `packages/ds` — that package reads the CSS output instead.

## Consuming

`packages/ds/tailwind.preset.ts` (not yet built) will import `build/css/*.css` directly; components reference Tailwind classes that resolve to the CSS custom properties defined there. Color classes should use `hsl(var(--...))` syntax so dark mode lights up later with zero component changes once components start referencing color tokens beyond the currently-unused `layout.backgroundColor.*` tree.
