# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A pnpm-workspace monorepo building a public, StackBlitz-hosted portfolio piece: a Radix-style design system driven by Figma-authored tokens, plus a store-locator app that consumes it. Full architecture, phased build order, and locked decisions live in `docs/PLAN.md` — read it before making any structural change; it's the source of truth, not this file. `docs/PLAN.md` also carries dated "Deviation from plan" notes where implementation diverged from the original spec (e.g. `packages/ds/src/theme.css` replacing a planned `tailwind.preset.ts`) — check those before trusting the plan's prose on a topic that's already been built.

`docs/FIGMA_COMPONENT_AUDIT.md` tracks naming/hygiene findings from auditing the Figma "Components" library against `docs/PLAN.md` §1.2's conventions, plus worked fix examples (Button) — consult it before building a new component from Figma.

No test suite or linter is configured anywhere in this repo yet. Build scripts and TypeScript's `--noEmit` typecheck are the only verification available per-package.

Code style is enforced via Prettier (`.prettierrc` at repo root — notably `trailingComma: "all"`). Run `pnpm format` to write fixes or `pnpm format:check` to verify without writing; match its rules when writing or editing code so diffs don't need a follow-up formatting pass.

## Monorepo layout

```
apps/storybook/    Storybook 8 host — empty skeleton (deps only), built after all DS components ship
apps/locator/       Vite + React store-locator app — empty skeleton (deps only), built after Storybook
packages/tokens/     Mirrors Figma "Styles" library — DONE. Figma Variables -> Tokens Studio export -> CSS/DTCG
packages/icons/      Mirrors Figma Assets "Icons" page — DONE. SVG -> React components via SVGR
packages/illustrations/  Mirrors Figma Assets "Illustrations" page — DONE. Same pipeline as icons, multicolor preserved
packages/ds/         Mirrors Figma "Components" library — IN PROGRESS. Radix Primitives + cva + Tailwind v4, no components built yet
```

Workspace deps: `ds` depends on `tokens` (declared in `packages/ds/package.json`); `icons`/`illustrations` are currently dependency-free siblings. Consumers import each package directly (`tokens`, `icons`, `illustrations`, `ds`) — the DS package does not re-export icons or illustrations.

## Commands

All run from repo root via pnpm workspace filters, or `cd` into the package and drop the `--filter`/`pnpm x:y` prefix.

```bash
pnpm install                       # installs all workspace packages

# Tokens (packages/tokens)
pnpm tokens:build                  # source/tokens.json -> build/css/*.css + build/dtcg/*.json
pnpm --filter tokens import:tokens-studio  # re-merge source/tokens-studio/* -> source/tokens.json (manual, one-time per Figma re-export)

# Icons (packages/icons)
pnpm icons:build                   # source/*.svg -> src/generated/*.tsx + manifest.ts
pnpm --filter icons typecheck

# Illustrations (packages/illustrations)
pnpm illustrations:build           # source/*.svg -> src/generated/*.tsx
pnpm --filter illustrations typecheck

# Design system (packages/ds)
pnpm --filter ds theme:check       # compiles src/theme.css standalone via @tailwindcss/cli as a smoke test
```

Full pipeline from a clean checkout: `pnpm install && pnpm tokens:build && pnpm icons:build && pnpm illustrations:build`.

`turbo` is a root devDependency but there is no `turbo.json` yet — task orchestration is still plain `pnpm --filter`, not Turborepo pipelines, despite the dependency being present.

## Token architecture (`packages/tokens`)

Three-tier alias chain: `primitives` → `semantic` → `component`, each single-mode. Two multi-mode collections layer on top: `color` (`light`/`dark`) and `density` (`roomy`/`condensed`). Components should reference `component` tokens first, falling back to `semantic` — never reference `primitives` directly. This tiering is what makes theming/rebranding/density cheap later without touching component code.

Build output consumed downstream:

- `build/css/tokens.css` — `:root` base values (light + roomy)
- `build/css/dark.css` — sparse `[data-theme="dark"]` overrides (only tokens that actually differ from light)
- `build/css/density.css` — `[data-density="roomy"]` and `[data-density="condensed"]`, both full blocks

The pipeline is a **one-time, non-reproducible export** (Tokens Studio Pro, not a live sync) — see `docs/PLAN.md` §1.1 "Pipeline history" for why, and `packages/tokens/README.md` for the full refresh procedure if the Figma source changes. The `tokens-json-review` skill (`.claude/skills/tokens-json-review/`) validates `packages/tokens/source/tokens.json` before it's trusted as a build input — run it after any re-export, before rebuilding.

Some tokens referenced by shipped components don't exist as real Figma Variables yet — they were hand-added directly to `source/tokens.json` to unblock a build (e.g. `component-avatar-*` size steps, `component-text-input-*` state colors). `packages/tokens/HAND_ADDED_TOKENS.md` (gitignored, local) is the running record of exactly which tokens these are and what to author in Figma to close each gap — check it before assuming a component's token coverage is complete, and add to it any time a token gets hand-added rather than pulled from a real export.

## Design system (`packages/ds`)

Radix UI Primitives (`radix-ui` package) + `class-variance-authority` + `tailwind-merge`/`clsx` + Tailwind v4, styled entirely from the token CSS vars above — no shadcn copy-paste (see `docs/PLAN.md` "Radix vs shadcn: Recommendation").

`src/theme.css` is the Tailwind v4 `@theme` entry point: it `@import`s the three built token CSS files (bringing every token tier into the cascade as plain custom properties) and aliases only `color-intent-*`/`color-response-*` into Tailwind's color namespace (`bg-primary`, `text-critical-strong`, etc). Every other tier — `component-*`, `density-*`, `surface-*` — is deliberately left unaliased; components reference those directly via arbitrary values (`h-[var(--component-button-min-height)]`), per the primitives → semantic → component tiering. This is a CSS-first design (Tailwind v4's idiomatic model), not the JS/TS preset pattern `docs/PLAN.md` originally specified — see the dated deviation note in `docs/PLAN.md` §1.1 for the full reasoning.

Density theming is a `data-density="roomy"|"condensed"` attribute cascading from the nearest ancestor (`docs/PLAN.md` §1.4) — components read CSS vars that resolve differently per density, not JS branching. Radix portal-rendered components (Dialog, Popover, Tooltip) must set `data-density` explicitly on their content root since portals break the DOM cascade.

Component authoring conventions (forward refs, `asChild` support, `density` prop, cva-exported variants, no hardcoded colors/spacing) are enumerated in `docs/PLAN.md` §1.6 — apply them to every new component rather than re-deriving conventions per component.

## Icons and illustrations (`packages/icons`, `packages/illustrations`)

Sibling packages, nearly identical SVGR pipelines, with one deliberate divergence: `icons` swaps the single hardcoded neutral fill (`#006DA3`) to `currentColor` via SVGO (`replaceAttrValues` in `svgr.config.cjs`) so icons inherit CSS `color`; `illustrations` has no such pass — multicolor artwork keeps its authored fills/strokes exactly as exported. Never port the `currentColor` swap into `illustrations/svgr.config.cjs`.

Both packages' `src/generated/` directories (components, barrel, and icons' `manifest.ts`) are generated output — never hand-edit; re-run the package's `build` script instead. Icon category grouping comes from `packages/icons/source/categories.json` (name → Figma frame name), validated against `source/*.svg` by `scripts/build-manifest.ts` before SVGR runs.

## Figma integration

The Figma Dev Mode MCP server (`mcp__figma__get_figma_data`, `mcp__figma__download_figma_images`) is the preferred way to pull component/asset data from Figma; permissions for both are already granted in `.claude/settings.local.json`. There's no stored file key for the "Financial Services DS - Components" file in this repo — ask the user for the Figma URL/file key when auditing or building against components, same as was done for the audit in `docs/FIGMA_COMPONENT_AUDIT.md`.

## Skills

- `.claude/skills/tokens-json-review/` — validates `packages/tokens/source/tokens.json` (double-encoding, unit-suffix correctness, mode key-parity, alias resolution) before it's trusted as a build input.
- `.claude/skills/branch/` — `/branch <new-branch-name> [base-branch]`, creates and checks out a git branch, runs on Haiku.
