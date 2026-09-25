import { useState, type ReactNode } from 'react';
import { Button } from 'ds';
import { ChevronLeft, ChevronRight } from 'icons';
import type { Advisor, Location } from '../../data/locations';
import { EntityPortrait } from '../entity-info/EntityPortrait';
import { NameBlock } from '../entity-info/NameBlock';
import { EntityActions } from '../entity-info/EntityActions';
import { splitAddressLines } from '../../utils/splitAddressLines';
import { getFullName } from '../../utils/getFullName';

export interface BranchPopoverContentProps {
  location: Location;
  /** Closes this popover and opens `NewClientInquiryDialog` at the `Map`
   * level for the tapped advisor -- same externally-controlled-Dialog
   * pattern as `AdvisorPopoverContentProps.onNewClientInquiry`'s own doc
   * comment (a Dialog opened *inside* this popover's own
   * advisor-detail state would still be a same-document-body sibling
   * outranking any dialog that opens beside it). Only reachable via the
   * advisor-detail state below (a location pin's own advisors are never
   * shown one-per-pin the way a lone advisor at a location is), so this
   * takes the advisor as an argument rather than being pre-bound to one,
   * per the user, 2026-09-25. */
  onNewClientInquiry?: (advisor: Advisor) => void;
}

// Two advisor rows per Advisors-panel page, per the user, 2026-09-25 --
// this popover's own limited height can't grow to fit an arbitrarily
// long advisor list, so a location with more than two advisors paginates
// instead of scrolling.
const ADVISORS_PER_PAGE = 2;

// Fixed left-to-right order for the three stacked panels' horizontal
// slide, per the user, 2026-09-25 ("horizontal slide transitions...
// moving between panels") -- Branch -> Advisors -> Advisor detail. A
// panel's own `translateX` offset below is just `(itsIndex - activeIndex)
// * 100%`, so switching which one is active automatically slides every
// panel the right amount in the right direction with a single CSS
// `transition: transform`, no separate forward/backward bookkeeping
// needed the way a View-Transitions-based approach would.
const PANEL_ORDER = ['branch', 'advisors', 'advisorDetail'] as const;
type PanelKey = (typeof PANEL_ORDER)[number];
const PANEL_TRANSITION_DURATION_MS = 220;
// Shared by every panel's own `transition` style below and the
// `prefers-reduced-motion` override's selector -- a plain CSS class
// (not a `view-transition-name`), since this reverted from the View
// Transitions API to a plain `transform`/`transition` carousel, per the
// user, 2026-09-25: two separate rounds of `document.startViewTransition`
// tuning (disabling the transition group's own default position tween,
// then aligning all three panels' content consistently) each measurably
// helped but never fully eliminated "a bit of vertical movement" --
// most likely `MapPinPopover.tsx`'s `side="top"` Radix Popper anchoring
// re-running mid-transition, a moving target no amount of `::view-
// transition-*` CSS tuning from inside this component can pin down. A
// plain `transform: translateX(...)` carousel never leaves the normal
// document flow or gets promoted to the top layer the way a named view
// transition does, so it can't desync from Popper's own positioning at
// all -- this popover's outer box genuinely never resizes between
// panels (still guaranteed by the CSS Grid stack below), so Popper has
// nothing to react to regardless.
const PANEL_SLIDE_CLASS = 'branch-popover-panel-slide';

// Figma's `Size=Small,State=Branch`/`Size=Small,State=Advisors` nodes
// (`1433:40227`/`1433:41409`) both end in a full-width "Action" footer
// band with this exact background (`#e5f6ff`) and 4px padding, holding a
// single `variant=tertiary` Button (condensed density's own 8px/12px
// padding matches that spec's Button padding exactly) -- shared by the
// Branch panel's "N Financial Advisors" action and the Advisors panel's
// "Back to Location" action below, per the user, 2026-09-25. `!bg-transparent`
// overrides `Button`'s own tertiary variant, which defaults to a solid
// white background (Figma's own instance has no fill at all, letting
// this band's own background show through instead).
function ActionFooter({ children }: { children: ReactNode }) {
  return (
    // `rounded-b-[var(--semantic-border-radius-ample)]` -- matches
    // `MapPinPopover.tsx`'s own Content radius exactly (same token, not
    // a re-guessed value), per the user, 2026-09-25: this band always
    // sits flush against the popover's own bottom edge (via `mt-auto`
    // above), so its bottom two corners need to follow that same curve
    // rather than square off past it.
    <div className="mt-auto flex items-center gap-[var(--density-spacing-fixed-small)] rounded-b-[var(--semantic-border-radius-ample)] bg-[var(--color-layout-background-color-secondary-base)] p-[var(--density-spacing-fixed-x-small)]">
      {children}
    </div>
  );
}

// Matches Figma's `Branch-Map-Tile` (1433:40228) two-state drill-down --
// Branch (location photo/address + "View Location" + a "N Financial
// Advisors" chevron-right) and Advisors (a name list + "Back to
// Location" chevron-left) -- local `useState`, not lifted, since nothing
// else on the page needs to know which state a given popover is in.
//
// One fixed size now, not a `size: 'sm' | 'lg'` prop picked off the
// map's own rendered width (`AdvisorPopoverContentProps.size`'s own
// pattern, which this component used to mirror) -- per the user,
// 2026-09-25, the location popover no longer varies with map width at
// all. What's below is the styling that used to be the `lg` branch (360px
// wide, 136x136 portrait, 8px uniform padding, `fixed-med` portrait-to-
// content gap) -- the one actively tuned this session -- not the old
// `sm` branch, which is gone entirely rather than kept as dead code.
export function BranchPopoverContent({
  location,
  onNewClientInquiry,
}: BranchPopoverContentProps) {
  const [showAdvisors, setShowAdvisors] = useState(false);
  // Not reset explicitly on `showAdvisors`/`location` change -- `Map.tsx`
  // keys `MapPinPopover` by `selectedLocationId`, so this whole component
  // (and every piece of its local state, this included) already remounts
  // fresh on every pin change and every close-then-reopen.
  const [advisorsPage, setAdvisorsPage] = useState(0);
  // Which advisor (if any) the Advisors panel has drilled into, per the
  // user, 2026-09-25 -- a third stacked state alongside Branch/Advisors,
  // not a separate popover or a navigation away from this one. An id, not
  // the `Advisor` object itself, so it stays trivially valid across a
  // page/list re-render (`location.advisors.find` below resolves it).
  // Deliberately never reset back to `null` (see `isAdvisorDetailActive`
  // below for what actually drives whether this panel is the active one)
  // -- per the user, 2026-09-25: "Back to Advisors" used to clear this
  // straight to `null`, which unmounted the whole Advisor-detail panel's
  // content (`advisorDetail` below is gated on `selectedAdvisor` being
  // defined) the instant you left it, so *re-opening* an advisor always
  // paid the cost of mounting fresh DOM (new nodes, an avatar image
  // request, etc.) mid-slide -- a real, one-sided cause of "a hiccup
  // going TO the nested advisor content, but [not] coming back", since
  // the other two panels' own content never unmounts this way. Keeping
  // the id around lets the content stay mounted (just slid off-screen
  // and `inert`) after the first visit, same as Branch/Advisors already
  // do. Initialized to the location's *first* advisor, not `null`, per
  // the user, 2026-09-25 -- pre-mounts that one advisor's detail content
  // (DOM nodes, layout, the avatar image request) as soon as this
  // popover opens, rather than paying that cost mid-slide the first
  // time it's actually clicked into. Only covers the first advisor --
  // a second/third one's own first visit still mounts fresh -- but the
  // first advisor is both the most likely one to be clicked and, for a
  // single-advisor location, the only one, so this covers the common
  // case without eagerly mounting content for every advisor at once.
  const [lastSelectedAdvisorId, setLastSelectedAdvisorId] = useState<
    string | null
  >(location.advisors[0]?.id ?? null);
  const selectedAdvisor = location.advisors.find(
    (advisor) => advisor.id === lastSelectedAdvisorId,
  );
  // Drives whether the Advisor-detail panel is the *active* (visible,
  // non-`inert`) one -- separate from `lastSelectedAdvisorId` above,
  // which only tracks *which* advisor's content to render and is never
  // cleared (see its own comment).
  const [advisorDetailOpen, setAdvisorDetailOpen] = useState(false);
  const { street, cityStateZip } = splitAddressLines(location.address);

  const totalPages = Math.ceil(location.advisors.length / ADVISORS_PER_PAGE);
  const pageStart = advisorsPage * ADVISORS_PER_PAGE;
  const pageAdvisors = location.advisors.slice(
    pageStart,
    pageStart + ADVISORS_PER_PAGE,
  );

  // The portrait+address "Columns" row only -- the "N Financial
  // Advisors" action now lives in its own `ActionFooter` below, outside
  // this row's own padding, matching Figma's own two-row ("Columns" then
  // "Action") `Rows` structure instead of stacking the action inside the
  // padded column like `EntityActions`' other callers do.
  const branchColumns = (
    // Uniform 8px (`fixed-small`) padding on all sides, a 136x136
    // portrait, and a `fixed-med` portrait-to-content gap -- the one
    // fixed size now (see this component's own top-of-file comment).
    <div className="flex gap-[var(--density-spacing-fixed-med)] p-[var(--density-spacing-fixed-small)]">
      <EntityPortrait
        name={location.name}
        photoUrl={location.officePhotoUrl}
        variant="entity"
        size="lg"
        avatarClassName="size-[136px]"
      />
      {/* `justify-center` -- this column stretches to the row's full
          height (the portrait's own 136px) by default, so centering its
          content vertically against that height is what actually
          centers it relative to the portrait. `pr-[fixed-x-small]` --
          4px of additional breathing room on this column's own right
          edge, per the user, 2026-09-25. */}
      <div className="flex min-w-0 flex-1 flex-col justify-center pr-[var(--density-spacing-fixed-x-small)]">
        <NameBlock
          heading={
            <>
              {street}
              <br />
              {cityStateZip}
            </>
          }
          headingClassName="text-[length:var(--semantic-content-heavy-font-size)] leading-[length:var(--semantic-content-heavy-line-height)] font-[number:var(--semantic-content-heavy-font-weight)]"
        />
        <div className="mt-[var(--density-spacing-fixed-large)]">
          <EntityActions
            primaryLabel="View Location"
            primaryHref={`/branch/${location.id}`}
            orientation="block"
            density="condensed"
            noInset
          />
        </div>
      </div>
    </div>
  );

  const advisorsList = (
    // The list and its pagination control sit in their own tighter
    // sub-group -- the "Back to Location" action now lives in its own
    // `ActionFooter` below instead, matching Figma's own two-row `Rows`
    // structure (see `branchColumns` above). `fixed-large` gap above the
    // pagination row (list-to-pagination), but a tighter `fixed-x-small`
    // bottom padding below it -- per the user, 2026-09-25: that bottom
    // padding is this panel's own fixed floor for the gap down to
    // `ActionFooter`'s `mt-auto` (which adds whatever *extra* space is
    // left once the taller sibling state sets this popover's shared
    // height -- see the anchor-to-bottom comment on the grid wrapper
    // below), so shrinking it directly tightens that floor without
    // touching the anchor-to-bottom behavior itself.
    <div className="flex flex-col gap-[var(--density-spacing-fixed-large)] pt-[var(--density-spacing-fixed-large)] pr-[var(--density-spacing-fixed-large)] pb-[var(--density-spacing-fixed-x-small)] pl-[var(--density-spacing-fixed-large)]">
      <ul className="flex flex-col gap-[var(--density-spacing-fixed-small)]">
        {pageAdvisors.map((advisor) => (
          <li key={advisor.id}>
            {/* A real `<button>`, not a `<li>`-level click handler --
                per the user, 2026-09-25, so drilling into an advisor's
                own detail state is keyboard/AT operable like every other
                action in this popover. */}
            <button
              type="button"
              onClick={() => {
                setLastSelectedAdvisorId(advisor.id);
                setAdvisorDetailOpen(true);
              }}
              className="flex w-full cursor-pointer items-center gap-[var(--density-spacing-fixed-small)] text-left"
            >
              <EntityPortrait
                name={getFullName(advisor)}
                photoUrl={advisor.photoUrl}
                size="sm"
                showBadge={false}
              />
              <span className="text-[length:var(--semantic-content-common-font-size)] leading-[length:var(--semantic-content-common-line-height)] font-[number:var(--semantic-content-common-font-weight)] text-[color:var(--semantic-content-common-text-color-default)]">
                {getFullName(advisor)}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {/* Only two advisors' worth of vertical space is guaranteed
          (`ADVISORS_PER_PAGE`) -- a location with more than that pages
          through the rest instead of growing the popover or scrolling
          the list, per the user, 2026-09-25. Suppressed entirely for a
          location that already fits on one page. */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="tertiary"
            density="condensed"
            showLabel={false}
            iconStart={<ChevronLeft aria-hidden="true" />}
            onClick={() => setAdvisorsPage((page) => page - 1)}
            disabled={advisorsPage === 0}
          >
            Previous advisors
          </Button>
          {/* `nanocopy`'s own size/weight/line-height, but
              `semantic-content-common`'s default text color -- Figma's
              own "Page 1 of 1" text (`1433:41502`) uses exactly that
              combination (`#191a1a`, the `common` bundle's color, not
              `nanocopy`'s own `#646768` gray), confirmed 2026-09-25. */}
          <span className="text-[length:var(--semantic-content-nanocopy-font-size)] font-[number:var(--semantic-content-nanocopy-font-weight)] leading-[var(--semantic-content-nanocopy-line-height)] text-[color:var(--semantic-content-common-text-color-default)]">
            Page {advisorsPage + 1} of {totalPages}
          </span>
          <Button
            variant="tertiary"
            density="condensed"
            showLabel={false}
            iconStart={<ChevronRight aria-hidden="true" />}
            onClick={() => setAdvisorsPage((page) => page + 1)}
            disabled={advisorsPage === totalPages - 1}
          >
            Next advisors
          </Button>
        </div>
      )}
    </div>
  );

  // The tapped advisor's own detail content -- mirrors
  // `AdvisorPopoverContent`'s own `sm` branch (120x120 portrait, status
  // badge, name, then "View Profile"/"New Client Inquiry" actions), per
  // the user, 2026-09-25: "opens up the contents of that advisor's
  // 'small' popover". Doesn't set its own outer width the way
  // `AdvisorPopoverContent` does -- the shared grid wrapper below already
  // fixes this popover's width, so this panel fills that (360px) instead
  // of forcing its own 320px, keeping the "shouldn't increase the size
  // of the popover" requirement true for width as well as height.
  const advisorDetail = selectedAdvisor && (
    <div className="flex gap-[var(--density-spacing-fixed-med)] p-[var(--density-spacing-fixed-x-small)]">
      <EntityPortrait
        name={getFullName(selectedAdvisor)}
        photoUrl={selectedAdvisor.photoUrl}
        status={selectedAdvisor.newClientStatus}
        badgeMode="inverse"
        size="lg"
        // EXPERIMENT, 2026-09-25, per the user -- may revert to the
        // previous 120x120 (`AdvisorPopoverContent`'s own `sm` sizing):
        // trying its `lg` portrait sizing (160x160) instead.
        avatarClassName="size-[160px] text-[51px] [--avatar-icon-size:96px]"
      />
      {/* `pr-[fixed-x-small]` -- 4px of additional breathing room on this
          column's own right edge, per the user, 2026-09-25, same
          treatment `branchColumns`' own `lg` right column already has. */}
      <div className="flex min-w-0 flex-1 flex-col justify-center pr-[var(--density-spacing-fixed-x-small)]">
        <NameBlock
          heading={getFullName(selectedAdvisor)}
          headingClassName="text-[length:var(--semantic-content-heavy-font-size)] leading-[length:var(--semantic-content-heavy-line-height)] font-[number:var(--semantic-content-heavy-font-weight)]"
        />
        <div className="mt-[var(--density-spacing-fixed-small)]">
          <EntityActions
            primaryLabel="View Profile"
            primaryHref={`/advisor/${selectedAdvisor.id}`}
            onNewClientInquiry={
              (selectedAdvisor.newClientStatus === 'accepting' ||
                selectedAdvisor.newClientStatus === 'waitlist') &&
              onNewClientInquiry
                ? () => onNewClientInquiry(selectedAdvisor)
                : undefined
            }
            orientation="block"
            density="condensed"
            noInset
          />
        </div>
      </div>
    </div>
  );

  // Three mutually-exclusive states now, not two -- Branch, Advisors, and
  // (per the user, 2026-09-25) Advisor detail, drilled into from a tap on
  // one of the Advisors panel's own rows. `advisorDetailOpen` wins over
  // `showAdvisors` since drilling into an advisor only ever happens *from*
  // the Advisors panel; `showAdvisors` itself is left untouched while an
  // advisor is selected, so "Back to Advisors" below just clears
  // `advisorDetailOpen` rather than needing to also re-set `showAdvisors`.
  const activePanel: PanelKey = advisorDetailOpen
    ? 'advisorDetail'
    : showAdvisors
      ? 'advisors'
      : 'branch';
  const activeIndex = PANEL_ORDER.indexOf(activePanel);
  const isBranchActive = activePanel === 'branch';
  const isAdvisorsActive = activePanel === 'advisors';
  const isAdvisorDetailActive = activePanel === 'advisorDetail';

  // Each panel's own horizontal offset from the active one, in whole
  // "slots" (Branch/Advisors/Advisor-detail, per `PANEL_ORDER`) -- e.g.
  // Advisors sits at `-100%` (one slot left, off-screen) while Branch is
  // active, `0%` once it becomes active, and `+100%` once Advisor-detail
  // takes over. A plain `transition: transform` on each panel (see
  // `PANEL_SLIDE_CLASS`'s own doc comment above) is what turns a change
  // in `activeIndex` into a slide -- every panel moves in lockstep, no
  // per-transition direction bookkeeping needed the way the earlier View
  // Transitions attempt required.
  function panelOffsetPercent(panel: PanelKey) {
    return (PANEL_ORDER.indexOf(panel) - activeIndex) * 100;
  }

  return (
    // All three panels always mount, stacked at the same grid position
    // (`grid-area` implicitly -- every child defaults to row 1/column 1)
    // -- per the user, 2026-09-25, so the popover's own rendered height
    // is always the *tallest* of the three panels' natural heights,
    // never just whichever one happens to be showing (this is also what
    // keeps the new Advisor-detail state from being able to grow the
    // popover at all: it's already accounted for in the shared row
    // track's own sizing, the same as the other two). A plain CSS
    // `transform: translateX(...)` carousel (see `panelOffsetPercent`
    // above) does NOT remove a panel from this grid-sizing contribution
    // -- transforms are paint-time only, so all three keep counting
    // toward the shared row track's auto height regardless of which one
    // is currently slid into view. `overflow-hidden` (new, replacing the
    // old `visibility: hidden` per-panel toggle) clips whichever two
    // panels are currently off to either side; matching corner radius
    // keeps that clip from squaring off past `MapPinPopover.tsx`'s own
    // rounded border.
    //
    // Each grid item below is itself a `flex h-full flex-col` -- CSS
    // Grid's own default `align-items: stretch` already gives it a
    // definite height (the tallest sibling's), and stacking `flex-col` on
    // top of that is what lets its own `ActionFooter` (`mt-auto`) sit
    // pinned to the very bottom of that shared height rather than
    // directly under whichever content happens to be shorter -- the
    // user's own "anchored to the bottom of the popover" ask,
    // 2026-09-25.
    <div className="grid w-[360px] overflow-hidden rounded-[var(--semantic-border-radius-ample)]">
      <style>{`
        .${PANEL_SLIDE_CLASS} {
          transition: transform ${PANEL_TRANSITION_DURATION_MS}ms ease-in-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .${PANEL_SLIDE_CLASS} {
            transition: none;
          }
        }
      `}</style>
      <div
        className={`col-start-1 row-start-1 flex flex-col ${PANEL_SLIDE_CLASS}`}
        style={{ transform: `translateX(${panelOffsetPercent('branch')}%)` }}
        aria-hidden={!isBranchActive}
        inert={!isBranchActive}
      >
        {/* `flex-1 flex-col justify-center` -- vertically centers this
            panel's own content within whatever space it doesn't need for
            its `ActionFooter` below, same treatment the Advisor-detail
            panel already has. Applied here too now, per the user,
            2026-09-25: leaving Branch/Advisors content flush at the top
            while only Advisor-detail centered its own is what caused a
            noticeable content-position jump when sliding to/from that
            state -- aligning all three panels' content the same way
            (rather than just locking their shared *height*) removes it. */}
        <div className="flex flex-1 flex-col justify-center">
          {branchColumns}
        </div>
        {/* This pin type also covers a zero-advisor (support-staff-only)
            location -- see pinType.ts -- where there's no advisor list
            to drill into at all. */}
        {location.advisors.length > 0 && (
          <ActionFooter>
            <Button
              variant="tertiary"
              density="condensed"
              iconEnd={<ChevronRight aria-hidden="true" />}
              onClick={() => setShowAdvisors(true)}
              className="w-full !bg-transparent"
            >
              {location.advisors.length} Financial Advisor
              {location.advisors.length === 1 ? '' : 's'}
            </Button>
          </ActionFooter>
        )}
      </div>
      <div
        className={`col-start-1 row-start-1 flex flex-col ${PANEL_SLIDE_CLASS}`}
        style={{
          transform: `translateX(${panelOffsetPercent('advisors')}%)`,
        }}
        aria-hidden={!isAdvisorsActive}
        inert={!isAdvisorsActive}
      >
        {/* Same alignment-consistency treatment as the Branch panel above
            -- see that panel's own comment. */}
        <div className="flex flex-1 flex-col justify-center">
          {advisorsList}
        </div>
        <ActionFooter>
          <Button
            variant="tertiary"
            density="condensed"
            iconStart={<ChevronLeft aria-hidden="true" />}
            onClick={() => setShowAdvisors(false)}
            className="w-full !bg-transparent"
          >
            Back to Location
          </Button>
        </ActionFooter>
      </div>
      <div
        className={`col-start-1 row-start-1 flex flex-col ${PANEL_SLIDE_CLASS}`}
        style={{
          transform: `translateX(${panelOffsetPercent('advisorDetail')}%)`,
        }}
        aria-hidden={!isAdvisorDetailActive}
        inert={!isAdvisorDetailActive}
      >
        {/* `flex-1 flex-col justify-center` -- centers the
            portrait+name/actions row vertically within whatever space
            this state doesn't need for its own `ActionFooter` below, per
            the user, 2026-09-25 (this state's own content is shorter
            than the Advisors panel's, which is usually what sets this
            popover's shared height). `flex-col`, not a row-direction
            `items-center` -- per the user, 2026-09-25: a row-direction
            wrapper let `advisorDetail` shrink to its own content width
            (default flex-item sizing along a row's *main* axis) instead
            of stretching full width, which is what made the "View
            Profile"-only case narrower than the two-button case; `flex-
            col` keeps this wrapper's default `align-items: stretch`
            (its *cross* axis in a column) applying to width instead. */}
        <div className="flex flex-1 flex-col justify-center">
          {advisorDetail}
        </div>
        <ActionFooter>
          <Button
            variant="tertiary"
            density="condensed"
            iconStart={<ChevronLeft aria-hidden="true" />}
            onClick={() => setAdvisorDetailOpen(false)}
            className="w-full !bg-transparent"
          >
            Back to Advisors
          </Button>
        </ActionFooter>
      </div>
    </div>
  );
}
