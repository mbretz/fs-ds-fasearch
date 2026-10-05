# Design System to Product Pipeline: A Proof of Concept

A working proof of concept for taking a design system from design tokens to a shipped product, end to end:

**Design tokens (DTCG, mirrored as Figma Variables) → a composable component library → an advisor-locator app built entirely on it.**

## What this demonstrates

Design systems usually fail at the seams: tokens that drift from what's in Figma, components that are hard to bend to a real screen, and product code that quietly stops using the system. This project is a test of whether those seams can hold across a whole pipeline, using a realistic product as the proof.

- **One source of truth for design decisions.** The token model was first defined in the DTCG format, then adopted as Figma Variables, and both sides describe the same values. The build turns them into CSS custom properties that every component reads.
- **Composability as the main feature.** The components are building blocks, not finished widgets. A card, a tag, a button and a layout container can be combined in whatever arrangement a real screen needs, and they still look and behave like the system. That means teams don't have to choose between consistency and fitting the design: nobody detaches a component or writes a one-off override to make a screen work. Accessibility and keyboard behavior come built in with each piece. [Radix UI Primitives](https://www.radix-ui.com/primitives) do that groundwork under the hood; they are how composability is achieved, not the point.
- **Theme and density without JavaScript.** Color mode and density are attributes that cascade through the CSS, so the same component adapts without branching in code.
- **A real product as the test.** The advisor locator, a searchable directory with a map, profiles, an inquiry form and saved favorites, is built by composing the system. If a screen needed something the system couldn't do, that is the gap this exercise is meant to surface.

> **You're viewing a slimmed copy for StackBlitz.** The full repository (`fs-ds-fasearch`), with planning docs and every token output format, is on [GitHub](https://github.com/mbretz/fs-ds-fasearch) (`main`).

## Running it

The locator starts automatically (`pnpm --filter locator dev`). Notes for StackBlitz:

- **The first load takes a few minutes** while dependencies install. Later loads are faster.
- **Chrome or Edge** works best. If the preview pane asks you to connect a tab, use the button it offers and keep the project tab open.
- Image optimization is switched off here (it needs a native library WebContainers can't run), so images load at full size.

## The pipeline, stage by stage

| Stage                | Where                                      | What it does                                                           |
| -------------------- | ------------------------------------------ | ---------------------------------------------------------------------- |
| 1. Tokens            | `packages/tokens`                          | DTCG tokens modeled as Figma Variables, built to CSS custom properties |
| 2. Icons and artwork | `packages/icons`, `packages/illustrations` | Figma SVGs turned into React components with SVGR                      |
| 3. Components        | `packages/ds`                              | 29 composable components styled only from the tokens                   |
| 4. Product           | `apps/locator`                             | An advisor-search app assembled from the design system                 |

## The locator app (`apps/locator`)

A prototype advisor search with mock data, built with Vite, React 19 and React Router.

| Route                  | What it shows                                                        |
| ---------------------- | -------------------------------------------------------------------- |
| `/`                    | Landing page with the advisor search module                          |
| `/search`              | Results as a list, a live map, or both side by side                  |
| `/advisor/:id`         | Advisor profile, with a "New Client Inquiry" form                    |
| `/branch/:id`          | Office profile and the advisors based there                          |
| `/advisor/:id/inquiry` | Dedicated inquiry page on small screens                              |
| `/favorites`           | Saved-advisor comparator (a Dialog on desktop, a carousel on mobile) |

Worth a look:

- **Search:** typeahead, focus-area and accepting-new-clients filters, and a "near me" sort.
- **Map:** MapLibre GL with pin popovers kept in sync with the results list.
- **Sign-in and favorites:** spoofed sign-in with a favorites list, no backend.
- **Modern CSS:** container queries for responsive layout, View Transitions for page changes, and `interpolate-size` for height animations.

Open the "prototype" tray at the bottom of any page for what this prototype deliberately leaves out compared with a real application.

## The design system (`packages/ds`)

29 composable components, from basic inputs and buttons to dialogs, cards and layout containers. They are designed to be combined and extended, not copied and modified, and every color, size and space comes from the design tokens, so a change to a token reaches every component at once.

Two switches change how the whole system looks without touching any component:

- **Theme:** the switch is in place, but dark mode is intentionally limited today. It re-colors only the large layout and background surfaces (neutral, primary and secondary, each in several tiers). Text, borders, controls and status colors aren't themed yet. The theme attribute and the token layout are already set up, so a full dark theme can be added later by supplying the remaining values, without reworking the components.
- **Density:** roomy or condensed spacing, applied across every component.

Under the hood: Radix UI Primitives for behavior and accessibility, `class-variance-authority` for variants, and Tailwind v4 over CSS custom properties. These switches are plain attributes (`data-theme`, `data-density`) that cascade through the CSS.

Component specs live next to the components (`*.spec.md`), and cross-cutting accessibility and style guidance is in `packages/ds/specs/`. Stories are in `apps/storybook` (`pnpm --filter storybook dev`); that isn't set up to auto-start here, and it hasn't been tested inside StackBlitz.

## Tokens (`packages/tokens`)

The token model started as DTCG-format definitions and was then adopted as Figma Variables; the build reads the Figma-side export (via Tokens Studio) and produces CSS custom properties. Tokens follow a three-tier alias chain: **primitives → semantic → component**. Components reference component tokens first and semantic tokens as the fallback, never primitives directly. Two multi-mode collections layer on top: color (light and dark) and density (roomy and condensed).

**Typography:** the original design called for a proprietary, company-licensed typeface that can't be redistributed in a public repository. The type token is now named `DS Sans Text Var` and is backed by [Inter Variable](https://rsms.me/inter/) (SIL Open Font License). Inter was chosen by comparing letterforms against the original specimens (single-story `g` with an open tail, wide round `o`, large x-height) rather than by popularity, and its full 100–900 weight axis covers the in-between weights the type styles use.

This copy ships the built CSS and a JS export. The Swift, Kotlin and DTCG outputs, the raw Tokens Studio export, and the planning docs are omitted here and live on `main`.

## Icons and illustrations

- `packages/icons`: SVGs from Figma turned into React components with SVGR, using `currentColor` so they inherit text color.
- `packages/illustrations`: the same pipeline, with the original multicolor artwork preserved.

## Repo layout

```
apps/locator/            advisor-locator app (Vite + React)
apps/storybook/          Storybook host for the design system
packages/ds/             design system components, theme and specs
packages/tokens/         design tokens (built CSS + JS)
packages/icons/          icon components
packages/illustrations/  illustration components
```

A pnpm workspace: `ds` depends on `tokens`, and the locator consumes `ds`, `tokens` and `icons`.
