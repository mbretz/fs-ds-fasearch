# CSS Subgrid vs. Container Queries: a real incompatibility

**Date:** 2026-09-19
**Where it came up:** `apps/locator/src/components/cards/EntityCard/EntityCard.tsx`, while trying to make `AdvisorCard`'s `FocusAreasPanel` match height exactly across sibling cards in the same `ResultsList` grid row.
**Outcome:** Reverted. `EntityCard` uses `h-full` + Flexbox `grow` (each card independently absorbs its own leftover height) rather than CSS Subgrid (which would align a specific row-track's size across sibling cards). See `EntityCard.tsx`'s own comments for the shipped approach.

## The goal

`ResultsList` renders `AdvisorCard`s in a responsive CSS Grid (1/2/3 columns depending on breakpoint). The ask: within one visual row of cards, make the `FocusAreasPanel` (the last visible section of a stacked card) match the height of whichever sibling's panel is tallest, with the card's own total height following from that — not just "every card in the row is stretched to match whichever card is tallest overall," which was already working via ordinary Grid `align-items: stretch` plus an `h-full` chain.

CSS Subgrid is the textbook solution for this "ragged edge" problem: a nested grid item can declare `grid-template-rows: subgrid` to inherit its ancestor's row tracks instead of sizing its own, so an internal element (here, the panel) can be aligned in height across siblings that live in separate DOM subtrees.

## What was built

A 3-level subgrid chain, each level re-claiming and relaying two row tracks to the next:

```
<li> (ResultsList)         grid-rows-subgrid, row-span-2   — relays <ul>'s 2 real row tracks
  <div> (EntityCard outer)  grid-rows-subgrid, row-span-2   — relays <li>'s 2 rows
    <Card.Root>             grid-rows-subgrid, row-span-2   — relays outer div's 2 rows;
                                                               places `entity-card-main` into
                                                               row 1 and the first panel into row 2
```

Row/wide mode (≥680px, side-by-side columns) resets `grid-template-rows: none` inside the existing `@container entity-card (min-width: 680px)` rule, so the subgrid row-split only applies in stacked/narrow mode.

## What actually happened

Verified live (see "How this was verified" below), not guessed at:

- Two advisor cards in the same visual row (confirmed via matching `top`/adjacent `left`) ended up with **equal overall card height** (542px each — the pre-existing `h-full` mechanism, unrelated to subgrid, was working correctly) but **different `entity-card-main` heights** (361px vs. 342px). The panel/header split inside each card was not being aligned across siblings at all.
- `getComputedStyle(outerDiv).gridTemplateRows` reported `"none"` even though the `grid-rows-subgrid` utility class was present in the DOM and the only matching CSS rule (confirmed via directly walking `document.styleSheets` for rules matching that element). One level up (`<li>`) and one level down (`Card.Root`) both correctly reported `"subgrid [] [] []"`.

## Root cause

**An element cannot simultaneously be a `container-type` container and a `grid-template-rows: subgrid` item.** Establishing `container-type: inline-size` on an element forces its own `grid-template-rows` computed value back to `none`, regardless of what's declared in CSS.

This was proven with an isolated reproduction (no React, no Tailwind, no app code) using Playwright + a local Chromium instance:

1. A minimal 2-column grid with two `row-span: 2` / `grid-template-rows: subgrid` items, each containing a header of _natural_ (not explicit-`height`) content and a panel below it — **worked correctly**: both headers came out at 88px, matching the taller sibling's natural content.
2. The same structure, but with `container-type: inline-size; container-name: entity-card` added to the _same_ element that also declared `grid-template-rows: subgrid` — **broke immediately**: `gridTemplateRows` computed to `"none"`, and header heights reverted to their independent natural sizes (61px vs. 88px).

Removing `container-type` fixed it every time; adding it back broke it every time. This is a deterministic, repeatable conflict, not a flake or a Tailwind-specific bug.

### Why this couldn't be routed around

`EntityCard`'s outer wrapper _must_ declare `@container/entity-card` directly above `Card.Root` — this predates the subgrid work and is required for `Card.Root` to read its own rendered width and switch between stacked and side-by-side layouts (a size container query can only match a _descendant_ of the element declaring `container-type`, never that element itself, so the container-type element and the element reading the query must be different nodes).

That means the container-type wrapper sits **directly between** `<li>` (which needs to relay real, shared row tracks downward) and `Card.Root` (which needs to receive them). Since that wrapper cannot itself be a valid subgrid relay (per the conflict above), and pushing `@container` above `<li>` or below `Card.Root` would either break the required "container query targets a descendant, not itself" rule or break the existing width-based layout switch, there is no restructuring within this component that makes the chain work. The container-query boundary and the subgrid relay are mutually exclusive on this exact axis, for this exact component shape.

## How this was verified

Real headless-browser testing, not just reading spec text:

- Playwright + the Chromium binary already installed in this repo (for `packages/ds`'s own browser test suite, `pnpm --filter ds test:browser`) were used to load the actual running dev server (`localhost:5173`) and inspect real computed styles/heights via `page.evaluate`.
- Confirmed the bug on the real page first (mismatched `entity-card-main` heights between same-row siblings).
- Iteratively built smaller and smaller isolated repro HTML files (no app, no Tailwind) to narrow the cause, at each step changing exactly one variable (explicit vs. natural content height, implicit vs. explicit ancestor rows, single-level vs. multi-level subgrid nesting, with vs. without `container-type` on the relay element).
- The `container-type` toggle was the only variable that reproduced the exact failure mode (`gridTemplateRows` resolving to `"none"`) seen in the real app.

This is a durable technique worth reusing: when a CSS layout bug can't be understood from reading the code alone, and no interactive browser is available, `pnpm --filter ds test:browser:setup`'s Playwright/Chromium install can be scripted directly (`chromium.launch()`, `page.goto(...)`, `page.evaluate(() => ...)`) against either the running dev server or a static isolated repro file, to get real computed-style/geometry data instead of guessing.

## Takeaway for future work

If a future component needs both (a) a container query on its own rendered size and (b) cross-sibling internal alignment via subgrid, those two responsibilities need to live on **different elements that don't have a subgrid-relay dependency running through the container-type one** — which, for a strictly-nested tree, likely means one of the two requirements has to be dropped, or solved a different way (e.g. JS-measured `min-height` via `ResizeObserver`) rather than assumed solvable by adding more subgrid nesting.
