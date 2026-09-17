import type { ReactNode } from 'react';

// Scopes the whole module to the dark card treatment (Figma "Search Module
// - Desktop"/"- Mobile"). The outer bg is --color-layout-background-color-
// neutral-base, which only resolves to the dark hex (#323334) because of
// this data-theme scope — see docs/PLAN.md's Search Form Module note for
// the full token chain (Starting Point/Match panels use the sibling
// -level-1/-level-2 tokens directly, scoped separately inside Start.tsx).
export function AdvisorSearchModule({ children }: { children: ReactNode }) {
  return (
    // Named container (`@container/module`) — this is the true outer
    // boundary, so its width tracks the card's own width near 1:1 with no
    // horizontal padding of its own to subtract, and (unlike Start.tsx's
    // inner "Main Search" @container, whose width jumps discontinuously
    // when the two-column grid activates) stays monotonic with viewport
    // the whole way up to SiteShell's 1214px cap. That makes it the right
    // container to key Start.tsx's H1 tier switches off of — named so
    // Start.tsx's `@[…]/module:` queries this one specifically rather than
    // the nearer, differently-behaved inner container.
    //
    // Deliberately unstyled and carries no `view-transition-name`/negative
    // margin of its own — a size container query can only ever match a
    // *descendant* of the element that declares it, never the declaring
    // element itself (confirmed empirically: an earlier version of this
    // file put `@[768px]/module:rounded-…` directly on this div, and it
    // silently never matched at any width). So the actual visual card
    // (background, rounded corners, view-transition, and the mobile-
    // breakout bleed below) lives one level down, where it can validly
    // read this container's measurement. This div's own width is left to
    // respond to nothing but ordinary block layout — plain 100% of
    // `<main>`'s content box — which is what keeps its measurement in
    // exact sync with `<main>`'s own ambient padding with zero extra
    // compensation math (see the inner div's comment for why that matters).
    <div className="@container/module">
      {/*
        The actual card: background, corner radius, and the mobile-breakout
        bleed all live here, one level inside the named container above, so
        `@[768px]/module:rounded-…` is a valid descendant query.

        `md:max-[816px]:-mx-[…]` (`--density-layout-fixed-xx-large`, the
        same token SiteShell's `<main>` uses for its own horizontal
        padding): between 768px (SiteHeader's tablet cutoff, where
        `<main>`'s ambient padding turns on) and 816px (768 + 2×24px of
        that padding), this card would otherwise sit inset inside a small
        rounded box while its *content* (the grid below, keyed to the same
        768px container threshold) was still rendering single-column —
        neither the intended mobile look nor the intended tablet one.
        Canceling exactly `<main>`'s padding here bleeds the card back to
        the viewport edge for that whole band, matching the mobile
        treatment, without touching the outer container div above: a
        child's margin never changes its parent's own reported size, so
        this bleed has zero effect on the `@container/module` measurement
        that `@[768px]/module:rounded-…` (here) and every other
        `@[…]/module:` breakpoint in this component (Start.tsx/
        InProgress.tsx) read — no separate compensation needed anywhere
        else. `rounded-none`/`@[768px]/module:rounded-…`, a container query
        rather than `md:`, is what then actually produces the corner
        treatment, switching at the exact same real width as the grid
        itself instead of a second, viewport-based threshold that could
        drift out of sync with it.
        Rendered exactly once per route (Landing.tsx / Results.tsx each
        mount this component around one Stage), so `view-transition-name`
        here is never duplicated in the DOM at any single moment — it's
        what lets React Router's `navigate(..., { viewTransition: true })`
        (see Start.tsx's submit handler) morph this card shell between
        stages instead of hard-cutting to the new route.
      */}
      <div
        data-theme="dark"
        className="[view-transition-name:advisor-search-module] rounded-none bg-[var(--color-layout-background-color-neutral-base)] md:max-[816px]:-mx-[var(--density-layout-fixed-xx-large)] @[768px]/module:rounded-[var(--semantic-border-radius-generous)]"
      >
        {children}
      </div>
    </div>
  );
}
