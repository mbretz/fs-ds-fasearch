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
  /**
   * Container width (px) below which the row-mode grid gives every
   * column -- `main` and each panel alike -- an equal share, instead of
   * `main`'s usual larger `(4 - panelCount)fr` share. For a caller whose
   * own `main` content stacks/shrinks internally somewhere in that same
   * narrower band (see LocationCard.tsx's portrait+name row), so `main`
   * no longer needs the extra width there and the panels -- which are
   * otherwise squeezed to a flat 25% share regardless of how roomy the
   * card gets -- can use it instead. Omitted (default): always uses the
   * proportional split once row mode activates (680px), unchanged
   * behavior for a caller like AdvisorCard whose own `main` content
   * doesn't stack this way. Per the user, 2026-09-19.
   */
  equalColumnsBelow?: number;
  /**
   * Fixed pixel width for `main` in row mode, with every panel filling
   * the remaining space equally (`1fr` each) instead of `main` taking the
   * usual `(4 - panelCount)fr` proportional share. Matches Figma's
   * `FA-Card-FocusAreasSidePanel-Inline` (`1:637`) -- a distinct component
   * from the general `FA-Card-SidePanels` the default proportional split
   * targets, not just a narrower slice of it: that component's own "Left
   * Column" is a fixed 400px frame and its Focus Areas panel is `sizing:
   * fill`, the opposite relationship from the proportional split's
   * shrinking `main`/flat-25%-share panels. AdvisorCard passes `400` here
   * for its own single-panel (`showOfficeDetails={false}`) case, per the
   * user, 2026-09-22 -- the Focus Areas panel gets to grow with the card
   * instead of staying capped at a flat 25% whenever it's the only panel.
   * Omitted (default): unchanged proportional-split behavior.
   */
  mainWidth?: number;
  /**
   * Container width (px) at/above which the grid switches to row mode
   * (panels beside `main`) -- below it, everything stacks full-width,
   * `main` first then each panel in order (see `gridStyles`' own
   * "Stacked mode" comment, including the last panel's own `:has()`
   * hiding rule). Defaults to 680, this card's original one-size
   * threshold, unchanged by every current caller.
   */
  rowModeThreshold?: number;
  /**
   * Container width (px) below which -- but still at/above
   * `rowModeThreshold` -- the LAST panel stays beside `main` (two
   * columns) while every EARLIER panel drops out of that row to its own
   * full-width row beneath both, instead of squeezing into the full
   * `panels.length + 1`-column proportional row. At/above this width,
   * normal row mode (every panel beside `main`, per the proportional/
   * equal/fixed split the other props above choose). AdvisorCard passes
   * `730` for its own 2-panel (Focus Areas + Office Details) case, per
   * the user, 2026-09-22 -- three real columns read as cramped in the
   * 680-729px band, but Office Details is still worth keeping beside
   * `main` there (only Focus Areas needs to give up its column and drop
   * to a full-width row below). Only meaningful with exactly 2 panels
   * today -- the CSS below names its two grid areas `last`/`first`
   * (the last panel / every panel before it collapsed into one row),
   * not built to generalize past that yet. Omitted (default): unchanged
   * behavior, straight from stacked mode into the full proportional row
   * at `rowModeThreshold`.
   */
  dropFirstPanelBelow?: number;
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
// panel's width never changes based on how many siblings it has. This is
// the DEFAULT split only -- `mainWidth` (see its own doc comment) swaps
// `main`'s share for a fixed pixel width instead, letting a caller's
// panel(s) fill the remainder rather than being capped at that flat 25%.
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
// Default threshold (680px) is a first-pass value sized off Figma's own
// side-panel frames (250/450/274px wide panels inside ~700-850px-wide
// card compositions). `rowModeThreshold` (see its own doc comment) lets a
// caller with more panel content squeezed into that row -- AdvisorCard's
// own Focus Areas + Office Details case -- raise it once that squeeze is
// confirmed live, rather than this one flat value trying to fit every
// caller's panel content.
function gridColumns(panelCount: number, mainWidth: number | undefined) {
  const main =
    mainWidth !== undefined ? `${mainWidth}px` : `${4 - panelCount}fr`;
  return [main, ...Array<string>(panelCount).fill('1fr')].join(' ');
}

// `equalColumnsBelow`'s own equal-share variant -- `main` included, so
// `repeat(panelCount + 1, 1fr)`, not just the panels.
function equalGridColumns(panelCount: number) {
  return `repeat(${panelCount + 1}, 1fr)`;
}

// Card.Root's own padding is the *panel* inset (8px on every side,
// including a panel's own outer top/bottom and the last panel's own
// right edge against the card boundary) -- `main` needs a deeper inset
// on three of its four sides (top/left 16px, bottom 24px; its right side
// borders a panel via the grid gap, not the card edge, so it doesn't
// need compensating), per the user. Bottom is deeper than top/left --
// per the user, 2026-09-22, EntityActions' own row (the last thing in
// `main`) read as too tight against the card's bottom edge in row mode
// (mainly reachable on a phone by rotating to landscape, the narrowest
// real-world width this threshold triggers row mode at) with the same
// 16px both sides used. That compensating padding only applies once
// panels/main are actually side by side (this same container-query
// threshold): below it everything stacks full-width in one column,
// where `main` is just one more stacked item like any panel, not a
// conceptually distinct left column needing deeper insets.
// Base layout is `flex flex-col`, not grid -- `display: grid` (with the
// `fr`-based column split) only turns on at the row-mode threshold below.
// Flexbox in stacked mode is deliberate, not just "whatever stacks
// things": it lets the first panel (`grow`, see below) claim any leftover
// vertical height a taller sibling card forces onto this one -- CSS
// Grid's rows don't do that for free, since every row shares the grid's
// own row-track sizing rather than absorbing a container's excess height
// the way a flex item's `flex-grow` does.
// A function, not a module-level constant, since `equalColumnsBelow`/
// `rowModeThreshold` are per-instance -- the extra/adjusted rules are
// only emitted for a caller that actually passes them (e.g. LocationCard,
// AdvisorCard), leaving every other consumer's own `<style>` output
// identical to before.
function gridStyles(
  equalColumnsBelow: number | undefined,
  rowModeThreshold: number,
  dropFirstPanelBelow: number | undefined,
) {
  // Every selector below is scoped with `[data-row-mode-threshold="${rowModeThreshold}"]`,
  // not bare `.entity-card-grid`/`.entity-card-main` -- EVERY EntityCard
  // instance on a page (e.g. every LocationCard AND every AdvisorCard in
  // ResultsList) renders its own copy of this `<style>` tag, and
  // `<style>` content is never scoped to where it's rendered -- it's a
  // plain global stylesheet rule matched by selector, same as a
  // stylesheet file. Once `rowModeThreshold` varies between instances
  // (AdvisorCard's own 730 vs. every other consumer's default 680), an
  // unscoped `.entity-card-grid` rule from ANY instance on the page
  // matches every OTHER instance's `.entity-card-grid` too (a `@container`
  // condition is evaluated against whichever element the selector
  // matches, using THAT element's own nearest named container -- it
  // isn't scoped to the `<style>` tag that happened to declare it), so a
  // 680-threshold LocationCard's rule was silently activating row mode
  // on a 730-threshold AdvisorCard at width 700 too (confirmed live --
  // this shipped broken on the first attempt, same class of bug
  // `[data-equal-columns-below]` below already works around for a
  // different rule). The attribute's own VALUE (not just its presence,
  // unlike `[data-equal-columns-below]`) is what keeps same-threshold
  // instances sharing one matching rule while different-threshold
  // instances each only match their own.
  const scope = `[data-row-mode-threshold="${rowModeThreshold}"]`;
  return `
  @container entity-card (min-width: ${rowModeThreshold}px) {
    .entity-card-grid${scope} {
      display: grid;
      grid-template-columns: var(--entity-card-columns);
      align-items: stretch;
      /* Overrides Card.Root's own base \`gap\` (\`fixed-large\`, 16px --
         shared with stacked mode's own vertical rhythm) down to
         \`fixed-small\` (8px) for row mode's column gaps only -- per the
         user, so the gap between panels (main<->Focus Areas<->Office
         Details alike, a single \`column-gap\` applies uniformly across
         every column boundary) matches Card.Root's own 8px outer
         padding above/below/around the whole grid, rather than reading
         wider than that surrounding inset. \`column-gap\`, not \`gap\` --
         leaves row-gap (relevant only to \`dropFirstPanelBelow\`'s own
         2-row shape below) at the base 16px, untouched by this. */
      column-gap: var(--density-spacing-fixed-small);
    }
    /* \`.entity-card-grid${scope} > .entity-card-main\`, not a compound
       \`.entity-card-main${scope}\` -- confirmed live (Playwright), this
       was a real pre-existing bug: \`data-row-mode-threshold\` is set on
       \`Card.Root\` (the SAME element as \`.entity-card-grid\`, see its own
       comment above), not on \`.entity-card-main\`, which is a child DIV
       one level in. A compound selector requires both the class and the
       attribute on one element, so this rule silently never matched
       anything -- \`main\`'s own top/bottom/left padding stayed 0 in row
       mode this whole time, invisible only because Card.Root's own base
       8px already gave reasonable-looking spacing without it. Matches
       the \`> .entity-card-main\` child-combinator convention the
       \`dropFirstPanelBelow\` rule below already uses correctly. */
    .entity-card-grid${scope} > .entity-card-main {
      padding-top: var(--density-spacing-fixed-small);
      padding-bottom: var(--density-spacing-fixed-large);
      padding-left: var(--density-spacing-fixed-small);
    }
  }

  ${
    equalColumnsBelow
      ? `/* Narrower slice of row mode (${rowModeThreshold}px-${equalColumnsBelow}px):
       equal columns instead of the default proportional split -- see
       this prop's own doc comment above.

       \`[data-equal-columns-below]\` (presence, not value -- unlike this
       file's own \`data-row-mode-threshold\` above) is enough here since
       every current caller of \`equalColumnsBelow\` (LocationCard) uses
       the same number; revisit with the same value-matching approach
       above if that ever stops being true. It still needs to be more
       specific than the bare \`.entity-card-grid${scope}\` rule above,
       for the same DOM-order cascade reasons that rule's own comment
       explains. */
  @container entity-card (min-width: ${rowModeThreshold}px) and (max-width: ${equalColumnsBelow - 0.02}px) {
    .entity-card-grid${scope}[data-equal-columns-below] {
      grid-template-columns: var(--entity-card-columns-equal);
    }
  }`
      : ''
  }

  ${
    dropFirstPanelBelow
      ? `/* Band [${rowModeThreshold}px, ${dropFirstPanelBelow}px): the last panel
       (Office Details, on AdvisorCard) stays beside \`main\`; every
       earlier panel (Focus Areas) drops to its own full-width row below
       both instead -- see this prop's own doc comment above. Explicit
       \`grid-template-areas\` over the usual \`fr\`-track split, since
       this specific 2-row shape (one row split main/last-panel, a
       second row spanning both for every earlier panel) isn't
       expressible as a single flat track list the way the proportional/
       equal/fixed-\`mainWidth\` splits above are.
       \`[data-drop-first-panel-below]${scope}\`, doubly scoped (this
       attribute's own presence AND the row-mode-threshold value) for
       the same cross-instance cascade-collision reasons
       \`data-row-mode-threshold\`'s own comment explains -- belt and
       suspenders, since today only one caller (AdvisorCard) ever sets
       this prop, but a second one with a different pixel value here
       would hit the exact same bug otherwise.
       \`:nth-child(2)\`/\`:nth-child(3)\`, not a class selector -- panel
       wrapper \`<div>\`s below have no per-panel class of their own
       (only \`main\` and the whole grid do), and this tier assumes
       exactly 2 panels already (see the prop's own doc comment), so
       counting past \`.entity-card-main\` (child 1) to the first panel
       (child 2) and last panel (child 3) is exact for that case rather
       than a fragile approximation. */
  @container entity-card (min-width: ${rowModeThreshold}px) and (max-width: ${dropFirstPanelBelow - 0.02}px) {
    .entity-card-grid${scope}[data-drop-first-panel-below] {
      grid-template-columns: 1fr 1fr;
      grid-template-areas: "main last" "first first";
    }
    .entity-card-grid${scope}[data-drop-first-panel-below] > .entity-card-main {
      grid-area: main;
    }
    .entity-card-grid${scope}[data-drop-first-panel-below] > div:nth-child(2) {
      grid-area: first;
    }
    .entity-card-grid${scope}[data-drop-first-panel-below] > div:nth-child(3) {
      grid-area: last;
    }
  }`
      : ''
  }

  /* Stacked mode: the first panel (FocusAreasPanel on AdvisorCard,
     AdvisorsAtLocationPanel on LocationCard) grows to fill the card's
     leftover height, per the user -- paired with a narrower 4px bottom
     inset (vs. the card's own 8px on every other side) so that panel
     lands within 4px of the card's bottom edge instead of 8px. */
  @container entity-card (max-width: ${rowModeThreshold - 0.02}px) {
    .entity-card-grid${scope} {
      padding-bottom: var(--density-spacing-fixed-x-small);
    }
    /* OfficeDetailsPanel already hides its own content at this width
       (see its own component), but that leaves this wrapper div behind
       as an empty flex child -- and Flexbox's own \`gap\` still inserts a
       full gap before an empty item, eating into the space the growing
       first panel above is supposed to fill down to. Hiding the wrapper
       itself (not just its content) removes that wasted gap so the first
       panel actually reaches the 4px-from-bottom target above.
       \`:has(.office-details-panel)\`, not \`:has(> .office-details-panel)\`
       -- this was a real selector bug: OfficeDetailsPanel's own root
       element is a *different* div (its own \`@container/office-details\`
       wrapper, one level further in than this comment originally
       assumed) than the \`.office-details-panel\`-classed div the hide
       rule above targets, so \`.office-details-panel\` is actually a
       GRANDCHILD of this \`<div>\`, not a direct child -- the \`>\`
       combinator inside \`:has()\` never matched anything, so this
       wrapper never actually hid and the gap it explains above was never
       fixed. Dropping the \`>\` matches it as a descendant instead,
       regardless of how many wrapper levels sit in between. */
    .entity-card-grid${scope} > div:has(.office-details-panel) {
      display: none;
    }
    /* First panel's own trailing space, distinct from the card's outer
       padding-bottom above -- per the user, once the office-details
       wrapper is actually hidden (the fix directly above) the first
       panel now grows flush to that 4px card padding with nothing of
       its own beneath it, which read as too tight; this adds 4px back
       as the panel's own margin rather than restoring the old (16px,
       \`fixed-large\`) flex \`gap\` the hidden wrapper used to contribute.
       Applies whenever the first panel ends up the last VISIBLE one in
       stacked mode -- i.e. always, since a second (office-details) panel
       is either absent to begin with or hidden by the rule above.
       \`:nth-child(2)\`, not \`:first-of-type\` -- \`.entity-card-main\` (the
       header/actions column, always child 1) is ALSO a \`div\`, so
       \`:first-of-type\` would match it instead of the first panel
       wrapper; \`:nth-child(2)\` (the first panel wrapper's real position)
       is the same counting convention \`dropFirstPanelBelow\`'s own rules
       above already use. */
    .entity-card-grid${scope} > div:nth-child(2) {
      margin-bottom: var(--density-spacing-fixed-x-small);
    }
  }
`;
}

export function EntityCard({
  children,
  panels = [],
  equalColumnsBelow,
  mainWidth,
  rowModeThreshold = 680,
  dropFirstPanelBelow,
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
      <style>
        {gridStyles(equalColumnsBelow, rowModeThreshold, dropFirstPanelBelow)}
      </style>
      <Card.Root
        density={density}
        // Selector hook for the `equalColumnsBelow` CSS rule above -- see
        // its own comment for why this (not a bare class) is what makes
        // that rule win regardless of instance render order. `undefined`
        // when the prop isn't set, so React omits the attribute entirely
        // (not `data-equal-columns-below="undefined"`), matching every
        // other EntityCard consumer's unchanged behavior.
        data-equal-columns-below={equalColumnsBelow}
        // Selector hook for `gridStyles`' own `data-row-mode-threshold`
        // scoping -- see its comment for why this needs to be the
        // resolved VALUE (not just presence, unlike
        // `data-equal-columns-below` above) and why it's set
        // unconditionally rather than only when a caller overrides the
        // default 680.
        data-row-mode-threshold={rowModeThreshold}
        // Selector hook for `gridStyles`' own `dropFirstPanelBelow` mid-
        // tier rules -- `undefined` when the prop isn't set, so React
        // omits the attribute entirely, matching `data-equal-columns-
        // below`'s own convention.
        data-drop-first-panel-below={dropFirstPanelBelow}
        style={
          {
            '--entity-card-columns': gridColumns(panels.length, mainWidth),
            '--entity-card-columns-equal': equalGridColumns(panels.length),
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
