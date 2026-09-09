import { Button } from 'ds';
import { NewWindow } from 'icons';
import heroImage from '../../assets/search-module-hero.png';
import { SearchFormSearchInput } from './SearchFormSearchInput';

// Every padding/gap value below falls back to `primitives.ref.space.*`
// rather than a literal px value — `packages/tokens` has no semantic-tier
// spacing scale yet (only `density.spacing.fixed.*`, which tops out at
// 32px/xxx-large and is meant for component-internal density-aware
// spacing, not page-composition gaps like these). Falling back to
// primitives directly is a deliberate exception to the "never reference
// primitives directly" rule (CLAUDE.md), scoped to cases where the
// semantic tier genuinely has nothing to offer — recommendation for
// closing this gap: author a `semantic.spacing.*` tier (e.g.
// cozy/comfortable/generous, mirroring how `semantic.border-radius.*`
// already aliases these same primitive steps) so future page-composition
// code has a semantic token to reach for instead of primitives.
//
// Same story for the Figma text styles used below (Page Title, Heavy,
// Common, Subheading, Microcopy, Heading Large) — `packages/tokens` has
// no semantic-tier typography scale either, only `primitives.ref.font.*`
// (size/weight/line-height) and a slew of `component.<name>.*` sets
// scoped to single components. Each Figma style maps exactly to a
// primitive combination (documented per usage below), so those are what's
// referenced; closing this gap would mean authoring a
// `semantic.typography.*` (or similar) tier mirroring the named Figma
// text styles.

// Neither a real <a> nor `Button asChild -> <a>` has a native `disabled`
// attribute, so the two promo CTAs below fake it: aria-disabled, tabIndex
// -1, an inert href, onClick preventDefault, and a `cursor-not-allowed`
// override on top of the DS's own hover states — same convention
// SiteHeader.tsx uses for its nav links, expressed independently here
// since this module is built from `ds` components rather than plain
// markup. All nav/CTA items in this module are non-functional by design
// (docs/PLAN.md's Search Form Module note).
function preventDisabledClick(event: { preventDefault: () => void }) {
  event.preventDefault();
}

function StartingPointPanel() {
  return (
    <div className="rounded-[var(--semantic-border-radius-generous)] bg-[var(--color-layout-background-color-neutral-level-1)] p-[var(--primitives-ref-space-07)] @[1024px]/module:px-[var(--primitives-ref-space-08)] @[1024px]/module:py-[var(--primitives-ref-space-07)]">
      {/* Microcopy: size-small/line-height-medium/weight-regular (14/24/400) */}
      <p className="text-[length:var(--primitives-ref-font-size-small)] leading-[length:var(--primitives-ref-font-line-height-medium)] font-[number:var(--primitives-ref-font-weight-regular)] text-white">
        Get a better understanding of your different financial goals and how a
        financial advisor can work with you to meet them.{' '}
        <a
          href="#"
          aria-disabled="true"
          tabIndex={-1}
          onClick={preventDisabledClick}
          className="cursor-not-allowed whitespace-nowrap text-[var(--semantic-brand-secondary-light-gold)] underline"
        >
          Take the Starting Point Quiz.
        </a>
      </p>
    </div>
  );
}

function MatchPanel() {
  return (
    // `h-full` still matters here: this div's parent is the actual grid
    // item (placed in the "match" area — see Start.tsx's grid-template-
    // areas), so grid's default `align-items: stretch` sizes *that
    // wrapper* to match whatever the "match" area's own row-span covers
    // (just the "h1" row at tablet, "h1"+"main" combined at desktop — see
    // the scoped <style> block in Start.tsx). This inner div just needs
    // `h-full` to inherit that stretched height itself.
    <div className="flex h-full flex-col justify-center gap-[var(--primitives-ref-space-05)] rounded-[var(--semantic-border-radius-generous)] bg-[var(--color-layout-background-color-neutral-level-2)] px-[var(--primitives-ref-space-07)] py-[var(--primitives-ref-space-07)] @[768px]/module:px-[var(--primitives-ref-space-09)] @[1024px]/module:gap-[var(--primitives-ref-space-08)]">
      <div className="flex flex-col gap-[var(--primitives-ref-space-05)]">
        {/* Mobile: Heavy (16/24/600). Desktop: Subheading (20/30/525). */}
        <h2 className="text-balance text-[length:var(--primitives-ref-font-size-medium)] leading-[length:var(--primitives-ref-font-line-height-medium)] font-[number:var(--primitives-ref-font-weight-semibold)] text-white @[768px]/module:text-center @[768px]/module:text-[length:var(--primitives-ref-font-size-large)] @[768px]/module:leading-[length:var(--primitives-ref-font-line-height-large)] @[768px]/module:font-[number:var(--primitives-ref-font-weight-medium-plus)]">
          Get Matched with Advisors Near You
        </h2>
        {/* Mobile: Microcopy (14/24/400). Desktop: Common (16/24/400). */}
        <p className="text-[length:var(--primitives-ref-font-size-small)] leading-[length:var(--primitives-ref-font-line-height-medium)] font-[number:var(--primitives-ref-font-weight-regular)] text-white @[1024px]/module:text-[length:var(--primitives-ref-font-size-medium)]">
          Take two minutes to help us understand your needs and goals and match
          with financial advisors personalized for you.
        </p>
      </div>
      {/*
        `asChild` only composes with the compound Root/Icon/Label API, not
        the flat `Button` convenience wrapper — `Button` always renders its
        own icon/label/icon span structure as ButtonRoot's children, so
        handing `asChild` a single <a> there gives Radix's Slot more than
        the one child element it requires ("Slot failed to slot onto its
        children"). Same pattern as Button.stories.tsx's "Compound" story.
      */}
      <Button.Root
        asChild
        variant="secondary"
        className="w-full cursor-not-allowed"
      >
        <a
          href="#"
          aria-disabled="true"
          tabIndex={-1}
          onClick={preventDisabledClick}
        >
          <Button.Label>Edward Jones Match</Button.Label>
          <Button.Icon>
            <NewWindow aria-hidden />
          </Button.Icon>
        </a>
      </Button.Root>
    </div>
  );
}

// Three grid arrangements of the same four areas (h1/main/quiz/match),
// swapped by container query against AdvisorSearchModule's named
// `@container/module` — not viewport breakpoints, for the same reasons
// documented on the H1/inner-row container queries below. Named areas
// mean each grid child below declares one *static* `[grid-area:x]` class
// that never changes; only the container's template does, which is
// simpler than the equivalent done via per-child responsive col/row-
// start/span utilities (what this used to be before this pass).
//
//   mobile (<768px): single column, natural DOM order (h1, main, quiz,
//   match) needs no explicit areas at all.
//
//   tablet (768-1109px): h1 spans both columns as its own full-width row;
//   match sits beside main only (mirrors main's height, not h1's) — the
//   right column isn't wide enough yet for h1 to share a row with match
//   without looking cramped.
//
//   desktop (>=1110px, matching the inner image/text row's own switch —
//   see its @[625px] container query above): reverts to the original
//   treatment — h1 rejoins column 1 above main, match spans both their
//   combined height, and quiz (Starting Point) is column-1-only, leaving
//   the deliberate empty space beside it that matches Figma.
const gridAreaStyles = `
  .advisor-search-start-grid {
    grid-template-areas: "h1" "main" "quiz" "match";
  }
  @container module (min-width: 768px) {
    .advisor-search-start-grid {
      grid-template-columns: minmax(0, 1fr) minmax(260px, 365px);
      column-gap: var(--primitives-ref-space-08);
      row-gap: var(--primitives-ref-space-11);
      padding: var(--primitives-ref-space-11) var(--primitives-ref-space-08) var(--primitives-ref-space-09);
      grid-template-areas:
        "h1   h1"
        "main match"
        "quiz quiz";
    }
  }
  @container module (min-width: 1110px) {
    .advisor-search-start-grid {
      grid-template-areas:
        "h1   match"
        "main match"
        "quiz .";
    }
  }
`;

export function Start() {
  return (
    // CSS Grid, not flex, for the Left/Match split: two flex children with
    // fixed pixel widths (756px + 365px) don't reliably shrink together as
    // the row narrows, so between the breakpoint firing and the viewport
    // actually being wide enough for both fixed widths + gap + padding,
    // Match visually overlapped Left's content. Grid's explicit column
    // tracks (a flexible `minmax(0,1fr)` left track, a capped-but-still-
    // shrinkable `minmax(260px,365px)` right track) can't overlap the way
    // two same-row flex items with mismatched shrink behavior can.
    <div className="advisor-search-start-grid grid grid-cols-1 gap-[var(--primitives-ref-space-03)] p-[var(--primitives-ref-space-03)]">
      <style>{gridAreaStyles}</style>

      <div className="[grid-area:h1] flex flex-col items-start gap-[var(--primitives-ref-space-02)] p-[var(--primitives-ref-space-05)] pb-0 @[768px]/module:p-0">
        {/*
          Three tiers, not two: mobile Heavy (16/24/600) up to Page Title
          (50/75/600) was a straight jump too large for a tablet-width
          column to carry — Heading Large (36/54/600, from the Figma Style
          library's Typography page, 8WxIdnwe4UJFHmKQEbE0nj node 2159:77)
          fills the gap. Weight stays 600 across all three, so only size/
          line-height change. Queried against the named `@container/module`
          on AdvisorSearchModule's own root (not a viewport breakpoint, and
          not the unnamed `@container` a few lines down on the image/text
          row) — that inner container's width jumps discontinuously right
          as the two-column grid activates, which would make a single
          container-width threshold either fire too early pre-768px or drop
          back to Heavy for most of the tablet range after. The outer
          module container has no such jump, so one threshold per tier
          works cleanly the whole way up.

          Every other breakpoint in this component is pinned to this same
          named `@container/module` too (not a mix of it and viewport `md`/
          `lg`) — mixing a viewport media query with a container query for
          two halves of what's really one coordinated layout state (e.g.
          this div's own padding vs. `.advisor-search-start-grid`'s padding
          below) can settle at very slightly different points, since
          they're different measurement mechanisms even at the "same"
          768px number; that produced a real dead zone with no padding
          from either source. Container query for the whole component
          removes any possibility of that mismatch.
        */}
        <h1 className="text-[length:var(--primitives-ref-font-size-medium)] leading-[length:var(--primitives-ref-font-line-height-medium)] font-[number:var(--primitives-ref-font-weight-semibold)] text-white @[600px]/module:text-[length:var(--primitives-ref-font-size-xx-large)] @[600px]/module:leading-[length:var(--primitives-ref-font-line-height-xx-large)] @[1024px]/module:text-[length:var(--primitives-ref-font-size-huge)] @[1024px]/module:leading-[length:var(--primitives-ref-font-line-height-huge)]">
          Find a Financial Advisor
        </h1>
        {/*
          Switches at the same 600px tier as the H1 itself, not at 768px —
          the underline is a scaled accent for whichever heading size is
          currently showing, so it needs to grow the moment H1 does (mobile
          Heavy -> Heading Large), not lag a whole tier behind and look
          thin under an already-larger heading through the 600-767px
          range. One switch only (matches Heading Large and Page Title
          both, per explicit direction) — it does not follow the H1's
          second 1024px step up to Page Title.
        */}
        <div className="h-0.5 w-[60px] bg-[var(--semantic-brand-secondary-light-gold)] @[600px]/module:h-1 @[600px]/module:w-[120px]" />
      </div>

      {/*
        `pt-[space-05]` (16px) below 600px is what actually makes the
        mobile gap match Figma — the grid's own 8px row-gap alone (see
        `.advisor-search-start-grid`'s base `gap`) is only half of it: in
        Figma, the visual space below H1 is that 8px root gap *plus* the
        "Intro + Search" frame's own 16px top padding (node 1592:37386,
        `padding: 16px`), totaling 24px, not 8px. `@[600px]/module:pt-
        [space-07]` (24px) then widens that to a 32px total once H1 grows
        to Heading Large at the same 600px tier, so the gap keeps pace
        with the now-larger heading instead of lagging a tier behind.
        `p-0` at 768px+ hands spacing back to the grid's own (now 48px)
        row-gap entirely, same as every other area at that tier.
      */}
      <div className="@container [grid-area:main] flex min-w-0 flex-col justify-center gap-[var(--primitives-ref-space-07)] p-[var(--primitives-ref-space-05)] pt-[var(--primitives-ref-space-05)] @[600px]/module:pt-[var(--primitives-ref-space-07)] @[768px]/module:p-0 @[1110px]/module:pr-[var(--primitives-ref-space-03)]">
        {/*
          Stacked-state gap uses `--density-spacing-fixed-xx-large` (24px)
          rather than a `primitives.ref.space.*` fallback — this is a real
          density tier token (density-invariant, per CLAUDE.md), a better
          fit than reaching straight for a primitive when one already
          exists at the value needed. Reverts to the original `space-07`
          (also 24px, but Figma's own "Right Column" row-gap value) once
          @[625px] switches to the side-by-side treatment.
        */}
        <div className="flex flex-col gap-[var(--density-spacing-fixed-xx-large)] @[625px]:flex-row @[625px]:items-center @[625px]:gap-[var(--primitives-ref-space-07)]">
          <img
            src={heroImage}
            alt=""
            // Figma's own 335x206 frame ratio (~1.626:1), via aspect-ratio
            // instead of a fixed h-[206px] — a fixed height with a growing
            // w-full would change the effective crop as the image widens
            // (mobile ~1.74:1 up to ~2.98:1 at the widest stacked width),
            // rather than scaling the same framing proportionally.
            className="aspect-[335/206] w-full rounded-[var(--semantic-border-radius-generous)] object-cover @[625px]:max-w-[335px]"
          />
          <div className="flex min-w-0 flex-col gap-[var(--density-spacing-fixed-xx-large)] @[625px]:gap-[var(--primitives-ref-space-05)] @[625px]:max-w-[320px]">
            {/* Common: size-medium/line-height-medium/weight-regular (16/24/400) */}
            <p className="text-[length:var(--primitives-ref-font-size-medium)] leading-[length:var(--primitives-ref-font-line-height-medium)] font-[number:var(--primitives-ref-font-weight-regular)] text-white">
              Edward Jones has offices in communities across the country. Find
              financial advisors near you or search for a specific advisor by
              name.
            </p>
            <SearchFormSearchInput density="roomy" labelPlacement="above" />
          </div>
        </div>
      </div>

      <div className="[grid-area:quiz] min-w-0 px-[var(--primitives-ref-space-05)] @[768px]/module:px-0">
        <StartingPointPanel />
      </div>

      <div className="[grid-area:match] min-w-0 px-[var(--primitives-ref-space-05)] pb-[var(--primitives-ref-space-05)] @[768px]/module:px-0 @[768px]/module:pb-0">
        <MatchPanel />
      </div>
    </div>
  );
}
