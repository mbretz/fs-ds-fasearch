import type { CSSProperties, ReactNode } from 'react';
import { Card } from 'ds';
import { cn } from '../../../utils/cn';

export interface EntityCardProps {
  /** The header/actions column -- always rendered, never hidden by width. */
  children: ReactNode;
  /**
   * 0-2 side panels (`FocusAreasPanel`, `OfficeDetailsPanel`,
   * `AdvisorsAtLocationPanel`). Below the container-query threshold each
   * one stacks full-width under `children`, in order; above it, each
   * renders as its own column *beside* `children` and beside each other --
   * matches Figma's `FA-Card-SidePanels`/`Branch-Card-SidePanels`, whose
   * top-level layout is itself `mode: row` (Left Column + Focus Areas
   * panel + Office panel side by side as three siblings), not a main
   * column plus one side column holding two stacked panels. Omit entirely
   * (or pass an empty array) for the panel-less case
   * (`FA-Card-Mobile`/`Branch-Card-Mobile`), a single column at every width.
   */
  panels?: ReactNode[];
  density?: 'roomy' | 'condensed';
  className?: string;
}

// Row-vs-column flip driven by the card's own rendered width via a named
// container query, not the viewport. Row mode (side by side) switches to
// CSS Grid specifically for that layout: `fr` tracks give a clean,
// directly tunable proportional split (each panel a fixed 25% share,
// `main` taking whatever's left) that's easier to adjust than
// reverse-engineering the equivalent from flex-basis/grow/shrink. Stacked
// mode stays Flexbox (the base layout below) instead, since that's what
// lets the first panel absorb a taller sibling card's leftover height via
// `grow` -- see `gridStyles`' own comment.
//
// Track count varies with `panels.length` (0-2), which a single static
// CSS rule can't express, so the *values* are computed in JS and threaded
// through as a CSS custom property (`--entity-card-columns`) on
// `Card.Root`, while a small `<style>` block -- same mechanism
// AdvisorSearchModule/Start.tsx's own named-container rules already use
// -- is what gates *applying* that property behind the container query,
// so the grid stays single-column below the threshold regardless of the
// inline property's value.
//
// Each panel is always exactly a 25% share of the card -- not "25% when
// there happen to be two of them" -- so `main`'s own share shrinks to
// match: 100% with none, 75% with one, 50% with two. The denominator
// stays a constant 4 (`main = (4 - panelCount)fr`, each panel `1fr`) so a
// panel's width never changes based on how many siblings it has.
//
// `align-items: stretch` (not `start`) once panels/main sit side by
// side -- confirmed against Figma's own `FA-Card-SidePanels`/
// `Branch-Card-SidePanels`, whose top-level row is itself
// `alignItems: "stretch"`, so every column (main and each panel) matches
// the row's tallest one rather than sitting at its own natural height.
// Each panel component gives its own root element `h-full` so its
// background/border actually extends to fill that stretched grid cell --
// a stretched grid item's own box grows, but a plain block child inside
// it doesn't inherit that height for free.
//
// The outer `@container/entity-card` div is deliberately unstyled and
// distinct from the grid it measures: a size container query can only
// ever match a *descendant* of the element declaring `container-type`,
// never that element itself (confirmed the hard way in
// AdvisorSearchModule.tsx already) -- so `Card.Root` one level in is what
// actually becomes the grid and reads the outer div's measurement.
//
// Threshold (680px) is a first-pass value sized off Figma's own
// side-panel frames (250/450/274px wide panels inside ~700-850px-wide
// card compositions), not yet confirmed against a real rendered card with
// real panel content -- `FocusAreasPanel`/`OfficeDetailsPanel` don't
// exist yet, so there's nothing to visually tune this against. Revisit
// once they're built (the plan already flags this as a
// build-time-not-guessed-up-front value).
function gridColumns(panelCount: number) {
  const mainShare = 4 - panelCount;
  return [`${mainShare}fr`, ...Array<string>(panelCount).fill('1fr')].join(' ');
}

// Card.Root's own padding is the *panel* inset (8px on every side,
// including a panel's own outer top/bottom and the last panel's own
// right edge against the card boundary) -- `main` needs a deeper 16px
// inset on three of its four sides (top/bottom/left; its right side
// borders a panel via the grid gap, not the card edge, so it doesn't
// need compensating), per the user. That compensating padding only
// applies once panels/main are actually side by side (this same
// container-query threshold): below it everything stacks full-width in
// one column, where `main` is just one more stacked item like any panel,
// not a conceptually distinct left column needing deeper insets.
// Base layout is `flex flex-col`, not grid -- `display: grid` (with the
// `fr`-based column split) only turns on at the row-mode threshold below.
// Flexbox in stacked mode is deliberate, not just "whatever stacks
// things": it lets the first panel (`grow`, see below) claim any leftover
// vertical height a taller sibling card forces onto this one -- CSS
// Grid's rows don't do that for free, since every row shares the grid's
// own row-track sizing rather than absorbing a container's excess height
// the way a flex item's `flex-grow` does.
const gridStyles = `
  @container entity-card (min-width: 680px) {
    .entity-card-grid {
      display: grid;
      grid-template-columns: var(--entity-card-columns);
      align-items: stretch;
    }
    .entity-card-main {
      padding-top: var(--density-spacing-fixed-small);
      padding-bottom: var(--density-spacing-fixed-small);
      padding-left: var(--density-spacing-fixed-small);
    }
  }

  /* Stacked mode: the first panel (FocusAreasPanel on AdvisorCard,
     AdvisorsAtLocationPanel on LocationCard) grows to fill the card's
     leftover height, per the user -- paired with a narrower 4px bottom
     inset (vs. the card's own 8px on every other side) so that panel
     lands within 4px of the card's bottom edge instead of 8px. */
  @container entity-card (max-width: 679.98px) {
    .entity-card-grid {
      padding-bottom: var(--density-spacing-fixed-x-small);
    }
    /* OfficeDetailsPanel already hides its own content at this width
       (see its own component), but that leaves this wrapper div behind
       as an empty flex child -- and Flexbox's own \`gap\` still inserts a
       full gap before an empty item, eating into the space the growing
       first panel above is supposed to fill down to. Hiding the wrapper
       itself (not just its content) removes that wasted gap so the first
       panel actually reaches the 4px-from-bottom target above. */
    .entity-card-grid > div:has(> .office-details-panel) {
      display: none;
    }
  }
`;

export function EntityCard({
  children,
  panels = [],
  density,
  className,
}: EntityCardProps) {
  return (
    // `h-full` on both this div and `Card.Root` below -- needed so the
    // card's own visible box actually reaches a taller grid row's
    // stretched height (a stretched grid *item*, i.e. the `<li>` a
    // caller like ResultsList renders, doesn't hand that height to its
    // children for free; each level in between has to opt in), per the
    // user's "all cards in a row should match the tallest" ask.
    <div className="@container/entity-card h-full">
      <style>{gridStyles}</style>
      <Card.Root
        density={density}
        style={
          {
            '--entity-card-columns': gridColumns(panels.length),
          } as CSSProperties
        }
        className={cn(
          // Figma's card border (`#CBCCCD`, consistent across every
          // FA-Card-*/Branch-Card-* composition fetched) is an exact match
          // for the `neutral-800` primitive, but no semantic-tier token
          // resolves to that same value -- a documented primitives
          // fallback (component -> semantic -> primitives -> hardcode),
          // not a shortcut past the semantic tier.
          'entity-card-grid flex h-full flex-col gap-[var(--density-spacing-fixed-large)] border-[color:var(--primitives-ref-color-neutral-800)] p-[var(--density-spacing-fixed-small)]',
          className,
        )}
      >
        <div className="entity-card-main flex min-w-0 flex-col gap-[var(--density-spacing-fixed-large)]">
          {children}
        </div>
        {panels.map((panel, index) => (
          // Panels don't reorder/insert within a card's lifetime, so an
          // index key is fine here.
          <div key={index} className={cn('min-w-0', index === 0 && 'grow')}>
            {panel}
          </div>
        ))}
      </Card.Root>
    </div>
  );
}
