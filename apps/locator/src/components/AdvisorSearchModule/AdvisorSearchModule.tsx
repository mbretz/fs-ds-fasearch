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
    // Rendered exactly once per route (Landing.tsx / Results.tsx each mount
    // this component around one Stage), so `view-transition-name` here is
    // never duplicated in the DOM at any single moment — it's what lets
    // React Router's `navigate(..., { viewTransition: true })` (see
    // Start.tsx's submit handler) morph this card shell between stages
    // instead of hard-cutting to the new route.
    <div
      data-theme="dark"
      className="@container/module [view-transition-name:advisor-search-module] rounded-none bg-[var(--color-layout-background-color-neutral-base)] md:rounded-[var(--semantic-border-radius-generous)]"
    >
      {children}
    </div>
  );
}
