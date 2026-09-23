import { useParams } from 'react-router-dom';
import { findAdvisorById } from '../utils/findAdvisor';
import { AdvisorHero } from '../components/hero/AdvisorHero';
import { ProspectPortalLite } from '../components/ProspectPortalLite/ProspectPortalLite';
import { AdvisorProfileBody } from '../components/profile/AdvisorProfileBody';
import { OfficeDetailsPanel } from '../components/entity-info/OfficeDetailsPanel';
import { NewClientInquiryForm } from '../components/entity-info/NewClientInquiryForm';
import { cn } from '../utils/cn';

// Shared by both the mobile and desktop trees below -- the main profile
// content section starts with a 2px brand-gold top border directly below
// the Hero above it, per the user, 2026-09-22 -- no extra `mt` beyond the
// existing flex/grid row-gap each tree already provides between siblings
// (`density-layout-fixed-large`, 16px), removed from an earlier flat-48px
// Hero-to-border gap. `pt` below the border stays 48px -- the
// border-to-Focus-Areas gap still matches the 48px rhythm
// AdvisorProfileBody's own subsections use (Focus Areas to Experience &
// Background, etc), only the gap ABOVE the border changed.
const profileBodySectionClassName =
  'border-t-[2px] border-t-[color:var(--semantic-brand-primary-gold)] pt-[var(--density-layout-fixed-6x-large)]';

// Two separate trees below a `md:`/`hidden` breakpoint switch -- not one
// tree reused via responsive utility classes -- because the two
// breakpoints need genuinely different DOM relationships, not just
// different positioning of the same elements:
//
// - Mobile: Hero, body, and rail must all share ONE plain-flow parent (this
//   very `<div>`). `position: sticky`'s stuck range is bounded by its own
//   DIRECT parent's box -- AdvisorHero's mobile rendering deliberately
//   returns a Fragment, not a wrapping div (see its own comment), so that
//   parent is THIS div, not some smaller box scoped to the Hero alone. If
//   the sticky bar's parent only contained the Hero's own content, it
//   would shrink every time the Hero collapses on scroll, and the sticky
//   bar would run out of "room to stay stuck" partway down the page
//   (confirmed live: it vanished entirely once collapsed, since its
//   shrunk parent had already scrolled out of range). Keeping body+rail
//   as normal-flow siblings in this same div keeps it tall for as long as
//   the page has content, regardless of the Hero's own current height.
// - Desktop: Hero, body, and rail are separate CSS Grid items instead,
//   per the user -- the rail (Office Info / New Client Inquiry panel)
//   needs to `row-span` into the Hero's own row so it can
//   overlap up into it (Figma's real page has the rail card starting
//   ~36px into the Hero, not flush below it), which requires them to be
//   siblings positioned by grid-column/row, not nested in one flow.
//   `md:items-start` keeps row 1 sized to the Hero's own height instead
//   of stretching to match the (taller, row-spanning) rail. The Hero
//   needs BOTH an explicit `md:row-start-1` AND `md:col-start-1` --
//   `col-span-2` alone leaves the start column to auto-placement, and
//   since the rail's own explicit placement already claims column 2 of
//   row 1, auto-placement can't find a free 2-column span there at all;
//   confirmed live, it silently grew the grid two EXTRA implicit columns
//   and rendered the Hero off in columns 3-4 instead of overlapping the
//   rail as intended.
export function AdvisorProfile() {
  const { id } = useParams<{ id: string }>();
  const found = id ? findAdvisorById(id) : undefined;

  if (!found) {
    return (
      <p className="mx-[var(--density-layout-fixed-large)] mt-[var(--density-layout-fixed-large)] md:mx-0">
        Advisor not found.
      </p>
    );
  }

  const { advisor, location } = found;
  // Same status check as AdvisorCard's/EntityActions' own -- per the
  // user, only advisors actively taking new clients or holding a
  // waitlist spot get a New Client Inquiry form in this rail;
  // `referralOnly` advisors show just the Office Details panel alone.
  const showsNewClientInquiry =
    advisor.newClientStatus === 'accepting' ||
    advisor.newClientStatus === 'waitlist';

  return (
    <>
      <div className="flex flex-col gap-y-[var(--density-layout-fixed-large)] [overflow-anchor:none] md:hidden">
        {/* mb cancels TWO gap-y-large increments, not one: AdvisorHero
            renders a Fragment whose own first child is an invisible,
            zero-height sentinel div (`useStuckSentinel`'s scroll marker,
            see AdvisorHero.tsx's own comment on why it can't be wrapped),
            which becomes its own flex item here too -- so this column's
            gap-y applies both around that sentinel AND between it and the
            visible sticky banner below it, not just once. */}
        <ProspectPortalLite className="mt-[4px] mb-[calc(4px_-_(2*var(--density-layout-fixed-large)))]" />
        <AdvisorHero advisor={advisor} location={location} />
        <AdvisorProfileBody
          advisor={advisor}
          className={cn(
            'mx-[var(--density-layout-fixed-large)]',
            profileBodySectionClassName,
          )}
        />
        {/* New Client Inquiry form stacked above
            Office Details, 40px between them, only for advisors who
            actually show that form -- `referralOnly` advisors get just
            the Office Details panel alone, per the user. No shadow on
            either card here -- this mobile tree always stacks the rail
            below the body content in normal flow (it never overlaps the
            Hero the way the desktop tree's own `@[940px]/advisor-hero:`
            treatment below can), same reasoning as LocationProfile.tsx's
            own mobile rail. `officePhotoUrl` IS shown here, unlike
            LocationProfile's own panel -- AdvisorHero shows the
            ADVISOR's own portrait, not this office photo, so there's no
            redundancy to avoid (see data/locations.ts's own comment on
            why LocationProfile omits it instead). `advisor.hours`/
            `advisor.phone` (falling back to the branch's own) match
            AdvisorCard's own precedent for showing THIS advisor's
            office, not just the branch's -- `hoursLabel` switches to
            "Advisor Hours" only when the advisor's own schedule actually
            diverges from the branch's, per OfficeDetailsPanel's own doc
            comment on that prop. */}
        <div className="mx-[var(--density-layout-fixed-large)] flex flex-col gap-[40px]">
          {showsNewClientInquiry && (
            <NewClientInquiryForm
              advisor={advisor}
              id="new-client-inquiry"
              // 142px (the collapsed sticky bar's own real measured
              // height) minus 24px -- per the user, 2026-09-23, a
              // little tighter than flush against the bar's bottom edge.
              className="scroll-mt-[118px]"
            />
          )}
          <OfficeDetailsPanel
            officePhotoUrl={location.officePhotoUrl}
            address={location.address}
            hours={advisor.hours ?? location.hours}
            hoursLabel={advisor.hours ? 'Advisor Hours' : 'Office Hours'}
            phone={advisor.phone ?? location.phone}
            fax={location.fax}
            supportStaff={location.supportStaff}
          />
        </div>
      </div>
      {/* `@container/advisor-hero` (named, `[container-type:inline-size]`)
          lives on THIS wrapper, one level above the actual grid -- not on
          the grid div itself. A CSS container query can't affect the
          very element that establishes the container (confirmed live,
          Playwright: with `@container/advisor-hero` and
          `@[940px]/advisor-hero:grid-cols-[1fr_400px]` on the SAME
          element, the override silently never applied at all, since a
          container can't query its own size for its own layout
          properties -- the grid fell back to a single auto-sized column
          plus an unwanted implicit one for the rail). Splitting the
          container-establishing element from the one consuming the
          query fixes that; this wrapper's own width is otherwise
          identical to the grid's (no padding/margin of its own), so the
          numbers in the grid's own comment below still apply unchanged.
          Declared on a shared ancestor of AdvisorHero and the rail panel
          (not on AdvisorHero's own root) because the rail panel is a
          SIBLING of AdvisorHero, not a descendant of it, and needs to
          read `--advisor-hero-gutter` too -- custom properties inherit
          down through descendants only. */}
      <ProspectPortalLite className="hidden md:flex mb-[4px]" />
      <div className="hidden md:block @container/advisor-hero">
        {/* Below this container's own 940px width: single column
            (`grid-cols-1`), rail panel hidden entirely, and the
            portrait/gutter custom properties are flat (188px/40px,
            this banner's original fixed values) -- per the user, once
            the rail panel is dropped there's no space pressure left to
            shrink anything for, so the portrait resets to its full
            original size and the name/content below runs the Hero's
            own full width instead of stopping short for a rail
            clearance that no longer exists.

            At/above 940px: two columns (`grid-cols-[1fr_400px]`), rail
            panel visible, and the portrait/gutter properties switch to
            a `clamp()`'d fluid value -- confirmed live (Playwright)
            that the rail's own 400px + clearance demand can make the
            name/status-tag column too narrow for its content
            (specifically, the "Accepting New Clients" status tag
            wrapping to two lines) at container widths approaching
            940px from above; shrinking the portrait/gutters there
            relieves that pressure. Ceiling (188px/40px) is reached at
            container=1100px; floor (144px/24px, exactly matching the
            flat values used just below 940px) at container=940px -- a
            160px-wide window, per the user (an earlier 100px-wide
            window, floor at 900px, technically worked but left little
            margin; this wider window starts relieving the pressure
            earlier for more buffer). The portrait's slope (44px range /
            160px window = 0.275) plus 3x the gutter's own slope (16px
            range / 160px window = 0.1, applied 3x since the gutter
            value is reused for the left inset, the portrait-to-text
            gap, AND the rail clearance) sums to 0.575, safely under 1
            -- the text column's width stays non-decreasing as the
            container narrows throughout this window (no dip/wrap
            glitch); see this comment's own earlier revision in git
            history for the fuller explanation of why that inequality
            matters. Re-verify it if either range or the window width
            ever changes. */}
        <div
          className={cn(
            // `gap-x-[var(--advisor-hero-gutter)]`, not a flat density
            // token -- per the user, the column gap between the body
            // content and the rail (once it's a real column, at/above
            // this grid's own 940px threshold) must shrink in lockstep
            // with the same fluid gutter the Hero itself uses for its
            // own internal clearance, not a separately-fixed value.
            // Harmless below the threshold (`grid-cols-1` has no second
            // column for a column-gap to apply between).
            'md:grid md:grid-cols-1 md:items-start md:gap-x-[var(--advisor-hero-gutter)] md:gap-y-[var(--density-layout-fixed-large)]',
            '@[940px]/advisor-hero:grid-cols-[1fr_400px]',
            // `grid-rows-[auto_1fr]`, added once the rail panel's real
            // content (the New Client Inquiry form) made row 1 and row 2
            // both plain implicit `auto` tracks -- confirmed live
            // (Playwright measurement, apps/locator's advisor profile
            // page, 2026-09-23): with the rail spanning `row-start-1
            // row-end-3` into BOTH rows, and both tracks sized `auto`
            // (infinite growth limit), the CSS Grid spec's "distribute
            // extra space across spanned tracks" step splits the rail's
            // overflow height roughly EQUALLY between row 1 and row 2
            // rather than putting it all in row 2 -- row 1 measured
            // 529px tall even though AdvisorHero's own content only
            // needed 268px, and since AdvisorHero uses `items-start`
            // (not `stretch`), that leftover row-1 space rendered as a
            // ~277px blank gap between the Hero and AdvisorProfileBody.
            // Explicitly marking row 2 as a flexible (`1fr`) track
            // changes which step of the algorithm resolves the overflow:
            // flexible tracks are excluded from that same-step "auto
            // tracks split it evenly" distribution and instead absorb
            // spanning overflow later, in the flexible-track sizing
            // step, so row 1 goes back to sizing off AdvisorHero's own
            // content alone. Safe outside this measured case too --
            // the grid's overall height is intrinsic (no fixed viewport
            // height to fill), so `1fr` here has no ambient free space
            // to over-grow into; it only ever absorbs a spanning item's
            // real overflow demand, same as `auto` would if growth
            // weren't split across tracks in the first place.
            '@[940px]/advisor-hero:grid-rows-[auto_1fr]',
            '[--advisor-hero-portrait-size:188px] [--advisor-hero-gutter:40px]',
            '@[940px]/advisor-hero:[--advisor-hero-portrait-size:clamp(144px,calc(-114.5px+27.5cqi),188px)]',
            '@[940px]/advisor-hero:[--advisor-hero-gutter:clamp(24px,calc(-70px+10cqi),40px)]',
          )}
        >
          <AdvisorHero
            advisor={advisor}
            location={location}
            // `@[940px]/advisor-hero:col-end-3` (not an unconditional
            // `md:col-span-2`) -- below the grid's own 940px threshold
            // there's only ONE explicit column (see the grid's own
            // comment), and spanning 2 there would make the browser
            // invent an unwanted implicit second column to satisfy it.
            // `col-end-3`, not `col-span-2` -- confirmed live (Playwright):
            // `col-span-2` sets the FULL `grid-column` shorthand
            // (`span 2 / span 2`), which has no explicit start line of its
            // own, so whenever that rule wins the cascade it also resets
            // (clobbers) the separately-declared `md:col-start-1`'s own
            // start line back to indefinite -- leaving this item's
            // placement to auto-placement instead, which put it in the
            // wrong column entirely. `col-end-3` sets only
            // `grid-column-end`, a distinct longhand that can't collide
            // with `col-start-1`'s `grid-column-start`, so both apply
            // together regardless of which rule is later in the
            // stylesheet.
            className="md:col-start-1 md:row-start-1 @[940px]/advisor-hero:col-end-3"
          />
          {/* `ml-[var(--advisor-hero-gutter)]` -- the same fluid var the
            Hero itself uses for its own left inset, so this section's
            left edge stays flush with the Hero's own portrait/text start
            regardless of which side of the 940px threshold the container
            is on (per the user). Right side: at/above the threshold, this
            item only occupies the grid's column 1 (unlike AdvisorHero
            above, which spans both columns via `col-end-3` to paint its
            banner behind the rail), so the grid's own
            `gap-x-[var(--advisor-hero-gutter)]` (see this grid's own
            comment above) already stops this column short of the rail by
            exactly that same fluid amount -- adding a matching `mr` here
            too would double it up. Below the threshold, with no second
            column (and so no gap-x contribution) at all, this item
            otherwise runs flush to the grid's own right edge instead of
            matching its own left inset -- `md:mr-[var(--advisor-hero-gutter)]`
            (cancelled by `@[940px]/advisor-hero:mr-0` once the rail/gap-x
            are back) gives it the same right inset as its left one in
            that state, per the user. */}
          <AdvisorProfileBody
            advisor={advisor}
            className={cn(
              'md:col-start-1 md:row-start-2 md:mr-[var(--advisor-hero-gutter)] md:ml-[var(--advisor-hero-gutter)] @[940px]/advisor-hero:mr-0',
              profileBodySectionClassName,
            )}
          />
          {/* `relative` (z-index:auto) -- without it, this non-positioned
            card loses to the Hero's own `position: relative` banner in
            paint order regardless of DOM order (positioned elements
            always paint above static ones); confirmed live, the rail was
            fully hidden behind the banner without this -- still needed
            at/above the 940px threshold where it overlaps the Hero, and
            harmless below it where there's no overlap to lose either way.

            Below the grid's own 940px container-query threshold, per the
            user, the rail panel doesn't disappear -- it moves to a THIRD
            stacked row below the body placeholder instead (the same
            "flush below, not overlapping" treatment AdvisorHeroMobile's
            own layout already uses), rather than the narrow single-
            column layout just losing this content outright:
            `md:col-start-1 md:row-start-3` places it there (the grid's
            own implicit row-sizing handles a 3rd row with no explicit
            `grid-template-rows` change needed); the grid's own
            `md:gap-y-[...]` already provides normal spacing above it, so
            no extra margin or rail-specific `pr` clearance is needed in
            this state (that clearance existed only to reveal the Hero's
            banner background past the panel in the overlapping layout,
            which doesn't apply here).

            At/above 940px, `@[940px]/advisor-hero:` overrides restore
            the original overlapping treatment: `col-start-2` (the second
            column, now that one exists), `row-start-1 row-end-3` (NOT
            `row-span-2` -- same shorthand-clobbering reasoning as
            AdvisorHero's own `col-end-3` above: `row-span-2` would reset
            the separately-declared `row-start-1` back to indefinite
            whenever it won the cascade), `mt-[36px]` (the "overlap 36px
            up into the Hero's own row" offset, per the user's original
            Figma-matching spec -- only meaningful once the rail is back
            in that first row), and `pr-[var(--advisor-hero-gutter)]`
            (the fluid strip of Hero background revealed past the
            panel's right edge, per the user). */}
          {/* `flex flex-col gap-[40px]` -- per the user, the New Client
              Inquiry form (when shown) and the Office Details panel below
              it get 40px between them, distinct from this grid's own
              16px `gap-y` rhythm elsewhere. Only ONE card in this column
              ever gets `@[940px]/advisor-hero:shadow-elevation-raised` --
              per the user, the shadow marks whichever card is actually
              the one overlapping the Hero banner, not every card in the
              column: when the New Client Inquiry form is present, IT
              sits flush against the Hero (this wrapper's own `mt-[36px]`
              overlap offset) and gets the shadow; Office Details below
              it no longer touches the Hero at all (it's pushed down past
              the form's own height + this 40px gap), so it stays
              shadowless there regardless of width. Only when there's no
              form -- Office Details is the column's sole, Hero-
              overlapping occupant -- does IT get the shadow instead (see
              its own `className` below).
              `md:ml-[var(--advisor-hero-gutter)] md:mr-[var(--advisor-
              hero-gutter)]` matches AdvisorProfileBody's own insets
              exactly (see its comment above) -- per the user, once this
              rail has dropped to the "simple stacking order" below
              940px, it should share the same width/inset as the main
              profile content, not run flush to the grid's own edges the
              way it previously did there. `@[940px]/advisor-hero:ml-0
              mr-0` drop both once the rail moves back to its own
              column-2 position, where they'd otherwise double up with
              (`ml`) or fight (`mr`) the grid's own `gap-x`/this
              wrapper's own `pr-[var(--advisor-hero-gutter)]` reveal-
              strip -- AdvisorProfileBody never needs an `ml-0`
              counterpart since it stays in column 1 at every width,
              unlike this rail panel. */}
          <div className="relative md:col-start-1 md:row-start-3 md:mr-[var(--advisor-hero-gutter)] md:ml-[var(--advisor-hero-gutter)] @[940px]/advisor-hero:col-start-2 @[940px]/advisor-hero:row-start-1 @[940px]/advisor-hero:row-end-3 @[940px]/advisor-hero:mt-[36px] @[940px]/advisor-hero:mr-0 @[940px]/advisor-hero:ml-0 @[940px]/advisor-hero:pr-[var(--advisor-hero-gutter)] flex flex-col gap-[40px]">
            {showsNewClientInquiry && (
              <NewClientInquiryForm
                advisor={advisor}
                // Distinct id from the mobile tree's own
                // `new-client-inquiry` -- both trees' forms are mounted
                // simultaneously (CSS, not JS, decides which is visible),
                // so a shared id would be a duplicate in the DOM. Lets
                // AdvisorHero.tsx's own desktop "New Client Inquiry"
                // button scroll to it below the 940px rail threshold,
                // where this panel sits inline below the page body
                // rather than beside the Hero.
                id="new-client-inquiry-desktop"
                className="@[940px]/advisor-hero:shadow-elevation-raised"
              />
            )}
            {/* `officePhotoUrl` IS shown here -- see the mobile tree's own
                identical comment above for why this diverges from
                LocationProfile's panel. */}
            <OfficeDetailsPanel
              officePhotoUrl={location.officePhotoUrl}
              address={location.address}
              hours={advisor.hours ?? location.hours}
              hoursLabel={advisor.hours ? 'Advisor Hours' : 'Office Hours'}
              phone={advisor.phone ?? location.phone}
              fax={location.fax}
              supportStaff={location.supportStaff}
              className={cn(
                !showsNewClientInquiry &&
                  '@[940px]/advisor-hero:shadow-elevation-raised',
              )}
            />
          </div>
        </div>
      </div>
    </>
  );
}
