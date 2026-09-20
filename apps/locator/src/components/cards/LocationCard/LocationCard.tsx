import { Separator } from 'ds';
import type { Location } from '../../../data/locations';
import { EntityCard } from '../EntityCard/EntityCard';
import { AdvisorsAtLocationPanel } from '../EntityCard/AdvisorsAtLocationPanel';
import { EntityPortrait } from '../../entity-info/EntityPortrait';
import { NameBlock } from '../../entity-info/NameBlock';
import { EntityActions } from '../../entity-info/EntityActions';
import { OfficeDetailsPanel } from '../../entity-info/OfficeDetailsPanel';
import { splitAddressLines } from '../../../utils/splitAddressLines';

export interface LocationCardProps {
  location: Location;
  className?: string;
}

// Assembles Figma's `Branch-Card-SidePanels`/`Branch-Card-Mobile`
// compositions. Reuses `.FA-Name+Accreditations` (via `NameBlock`) the
// same way Figma does on the Left Column header: address in the "heading"
// slot, a branch summary in the "subheading" slot that Figma's own
// advisor cards use for designations -- rendered here as an intro
// sentence followed by an unordered list of counts, per the user, rather
// than Figma's own plain comma-joined line.
//
// No status tag/badge or favorite toggle: no Status Tag or Favorite
// instance was found on any Branch-Card-* composition fetched (those are
// FA-Card-only), and `Location.open`'s own status-tag equivalent -- if
// one exists -- wasn't resolved either; left out rather than invented.
//
// No `ContactLinks` here, per the user -- the address/phone links already
// live in the Office Information panel, so the header doesn't repeat them.
export function LocationCard({ location, className }: LocationCardProps) {
  const advisorCount = location.advisors.length;
  const staffCount = location.supportStaff.length;
  const { street, cityStateZip } = splitAddressLines(location.address);

  return (
    <EntityCard
      className={className}
      // Matches the portrait+name row's own stacked-column sub-range
      // below (680-900px, see its `<style>` block) -- can't be a single
      // shared JS constant, since that rule's own literal `899.98px`
      // upper bound has to stay a plain string for `@container` to parse
      // it (unlike this plain prop, which has no such constraint). Keep
      // both `900`s in sync by hand if either changes, per the user
      // (2026-09-19): only while the portrait+name row is stacked does
      // `main` not need its usual larger grid-column share, so only
      // across that same band does every column (main + both panels)
      // become an equal third instead, giving the panels more room in
      // the sub-range that used to squeeze them to a flat 25% share --
      // outside it (row-oriented, whether mobile-stacked-card or
      // desktop), `main` needs its usual larger share back, hence the
      // 900px *ceiling* on this prop matching the row's own ceiling too.
      equalColumnsBelow={900}
      panels={[
        // `supportStaff` moved here (underneath the advisors), per the
        // user -- `OfficeDetailsPanel` below no longer renders it for this
        // card.
        <AdvisorsAtLocationPanel
          key="advisors"
          advisors={location.advisors}
          supportStaff={location.supportStaff}
        />,
        // `officePhotoUrl` deliberately not passed here -- per the user,
        // the branch photo is reserved for the full Office Details panel
        // on profile pages, not any card context. `showTitle={false}`:
        // this card's own header already carries the branch's identity
        // (address heading), so a second "Office Information" title here
        // would be redundant, per the user.
        <OfficeDetailsPanel
          key="office-details"
          showTitle={false}
          address={location.address}
          hours={location.hours}
          phone={location.phone}
          fax={location.fax}
        />,
      ]}
    >
      {/* Row (`items-center`, the address heading + "at this branch"
          list vertically centered against the avatar) by default --
          stacked (column) only in the two sub-ranges below where
          `main`'s own available width can't comfortably fit the avatar
          and text side by side: below 440px (`main` itself, not just
          the row, is too narrow there -- see the row's `<style>` rule
          below) and 680-900px (EntityCard's own side-panels squeeze,
          680px threshold, see that file -- narrower still, since `main`
          shares the card with two panels there). Row again in both
          gaps between those: 440-680px (card itself still stacked,
          panels below `main`, so `main` has the *whole* card's width to
          itself and comfortably fits both) and >=900px (card roomy
          enough that even `main`'s reduced side-panel share is plenty).
          Per the user (2026-09-19: first stacked-below-900 throughout,
          then reverted to row below 680px, then this -- 440px is where
          live measurement showed `main` actually starts squeezing
          avatar+text again below 680px, not 0px, so this is a real
          four-zone stack/row/stack/row pattern, not a two-zone one).

          A clean discrete container-query toggle at each boundary, not
          a continuously-shrinking avatar clamp through the row zones --
          per the user, revisiting the mobile case specifically:
          shrinking the avatar to fit alongside text (this file's
          previous approach here) can only ever reach an exact,
          zero-slack fit at its own upper bound by construction, which
          reads as visibly cramped even though nothing technically
          overflows; stacking removes the row-sharing constraint
          entirely instead of fitting it exactly, so both row zones can
          just use the avatar's own full natural size -- see its own
          comment below for the (now merely defensive-floor) clamp this
          leaves it with. */}
      {/* `!important`, not a higher-specificity selector -- same
          reasoning as view-transitions.css's own reduced-motion
          kill-switch, and the same bug it was written to avoid:
          LocationCard's own `<style>` tag here (like EntityCard's, see
          its own comment) is global, not scoped to this instance, so
          these rules and the avatar's own clamps below -- all single-
          class-selector specificity -- would otherwise resolve by DOM
          order across every LocationCard on the page rather than "does
          this instance's own width fall in the sub-range." `!important`
          makes each one win unconditionally whenever its own
          `@container` condition matches, regardless of instance order.

          The 680-794px avatar-clamp override still exists separately
          from the two row-direction rules below -- `equalColumnsBelow`'s
          own 680-794px sub-range (see that prop above) needs the avatar
          to genuinely re-shrink even though it's alone on its own row
          there, not just fall back on the default clamp's dormant floor
          (see that clamp's own comment below): giving every column an
          equal third helps the side panels, but it also drops `main`'s
          own share from 50% down to 33% right at the 680px threshold, a
          discontinuous DROP, not a gradual one, so `main` briefly
          measures narrower than a 240px avatar again (as low as ~204px
          right at 680px, confirmed live) before climbing back past
          240px by ~794px. A single `clamp()` can't express "shrink, jump
          down, grow back" (`cqi` is a monotonic function of container
          width, and this dip happens mid-range, not at either end), so
          this needs its own separate clamp scoped to just that
          sub-range instead of trying to fold it into the default one.
          `calc(33.53cqi - 26.3px)`: linear between `main`'s live-
          measured width at 680px (~204px) and where it climbs back past
          the 240px ceiling (~794px) -- empirical (measured directly),
          not derived from the grid's own token math, since the two
          landed a few px apart (real border-width/rounding the token
          math alone didn't fully account for) and the measurement is
          what actually has to hold. */}
      <style>{`
        @container entity-card (min-width: 680px) and (max-width: 794.18px) {
          .location-avatar {
            --location-avatar-size: clamp(112px, calc(33.53cqi - 26.3px), 240px) !important;
          }
        }
        @container entity-card (max-width: 439.98px) {
          .location-portrait-row {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
        @container entity-card (min-width: 680px) and (max-width: 899.98px) {
          .location-portrait-row {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
      <div className="location-portrait-row flex items-center gap-[var(--density-spacing-fixed-large)]">
        {/* `name` here only drives the avatar's initials/accessible name
            fallback (e.g. "St. Louis Downtown" -> "SD") -- the visible
            heading below is always `location.address`, per the user's ask
            to stop displaying location shortnames on cards. `photoUrl` is
            `officePhotoUrl` -- per the user, this card's own avatar is
            where the branch photo belongs, distinct from the (separate,
            not-yet-built) full Office Details panel on profile pages,
            which is why `OfficeDetailsPanel` below doesn't get it too. */}
        {/* 240px is the max, matching Figma's own `AvatarGroup`
            measurement on the Branch-Card-SidePanels Left Column header --
            outside DS Avatar's own size scale entirely (`2xl` tops out at
            144px), so this overrides the box/font/icon sizing directly
            rather than picking the closest named step.

            Fluid, not a fixed 240px: originally added because, once
            EntityCard's own side-panels layout activates (680px
            container-width threshold -- see EntityCard.tsx), `main`'s
            share of the card shrinks to 50%/75% of the *card's* own
            width depending on panel count, while the avatar stayed fixed
            at 240px, cutting the address/count text off next to it at
            tablet-range card widths, per the user (2026-09-19).

            The portrait+name row is now stacked (column) across BOTH
            of its own squeeze sub-ranges (below 440px and 680-900px --
            see the row's own comment above), not just the 680-900px
            one -- so the avatar never actually shares its row with text
            at a width narrow enough to matter. `NameBlock` still keeps
            its own `min-w-0` fix (see its own comment) as a defensive
            measure for the two row zones (440-680px, >=900px), but
            confirmed live, `main`'s width is comfortably roomy at every
            width tested in both of those (>=422px), so it isn't
            actually load-bearing there either -- this clamp is now
            purely the same narrow, pathological-width-only defensive
            floor described below, nothing more.

            (An earlier version of this clamp instead widened itself to
            shrink the avatar continuously through the whole mobile row
            range, sized to guarantee text always got some minimum
            width. Reverted, per the user, 2026-09-20: that approach can
            only ever land on an exact, zero-slack fit right at its own
            upper bound by construction, which read as visibly cramped
            even though nothing technically overflowed -- stacking the
            row instead of shrinking the avatar sidesteps that
            entirely, same as it already did for the 680-900px range.)

            `--location-avatar-size` uses `cqi` (container-query inline-
            size), not `vw` -- this is a decision about the *card's own
            box width*, not a device-class/viewport one, per
            modern-web-guidance's container-vs-media-query heuristic (see
            Results.tsx's ProspectPortal margin for the opposite,
            correctly-vw-based case, and its own comment on why). `cqi`
            resolves against the nearest ancestor with `container-type`
            set, which is `@container/entity-card` (EntityCard.tsx) --
            nothing between it and this avatar (Card.Root, EntityPortrait,
            Avatar) declares its own container-type, so this doesn't need
            (and container query units have no mechanism for) explicitly
            naming that container the way an `@container entity-card (...)`
            *rule* can.

            `clamp(112px, calc(128cqi - 118.4px), 240px)`: linear
            between a 112px floor at a 180px card width and a 240px
            ceiling at 280px -- both far narrower than the 440px stack
            threshold above, so this stays flat at 240px across every
            width this clamp is actually reachable at (stacked mode,
            alone on its own row, comfortably fits 240px down to a
            measured 320px card width already, per the row's own
            comment) -- kept only as a defensive floor for a
            pathological/reused-in-a-narrower-host case, not because
            it's expected to engage in practice.

            Font-size and `--avatar-icon-size` derive from
            `--location-avatar-size` via `calc()`, not their own separate
            clamps, so they can't drift out of Avatar's own established
            ratios (76/240 font-to-box, 0.6 icon-to-box -- e.g. `xl`: 32px
            font / 104px box; `2xl`: 48px font / 144px box) as the box
            itself scales.

            A SECOND, separate override, below -- `equalColumnsBelow`'s
            own 680-794px sub-range needs its own re-shrink, distinct
            from this clamp entirely. Giving every column an equal
            third there (see the `equalColumnsBelow` prop above) helps
            the side panels, but it also drops `main`'s own share from
            50% down to 33% right at the 680px threshold -- a
            discontinuous DROP, not a gradual one -- so `main` briefly
            measures narrower than a 240px avatar again (as low as
            ~204px right at 680px, confirmed live) before climbing back
            past 240px by ~794px. A single `clamp()` can't express
            "shrink, jump down, grow back" (`cqi` is a monotonic
            function of container width, and this dip happens mid-range,
            not at either end), so this needs its own separate clamp
            scoped to just that sub-range instead of trying to fold it
            into this one. */}
        <EntityPortrait
          name={location.name}
          photoUrl={location.officePhotoUrl}
          variant="entity"
          size="lg"
          avatarClassName="location-avatar [--location-avatar-size:clamp(112px,calc(128cqi-118.4px),240px)] size-[var(--location-avatar-size)] text-[calc(var(--location-avatar-size)*76/240)] [--avatar-icon-size:calc(var(--location-avatar-size)*0.6)]"
        />
        {/* `min-w-0` -- without it, this flex item's default `min-width:
            auto` refuses to shrink below its own content's intrinsic
            min-width (the widest unbreakable word/token, e.g.
            "Administrative"), so in either row zone (440-680px,
            >=900px -- see the row's own comment above) it would
            overflow straight past `main`'s edge instead of wrapping to
            fit, the same way it did back when the row was still row-
            oriented all the way down to 0px (confirmed live at the
            time: a constant, non-shrinking 123px measured width
            regardless of how much narrower `main` got, spilling up to
            77px past its edge at a 320px viewport). Kept as a defensive
            measure now that 440px stacking means neither current row
            zone actually gets that narrow in practice, same reasoning
            as the avatar's own now-dormant clamp below. `EntityCard.tsx`'s
            own `.entity-card-main` already carries this same fix for the
            same reason (see its className) -- this is that same fix one
            level deeper, on the child that actually needs to shrink. */}
        <NameBlock
          className="min-w-0"
          heading={
            <>
              {street}
              <br />
              {cityStateZip}
            </>
          }
          subheading={
            <>
              At this Edward Jones Branch:
              <ul className="list-disc pl-[var(--density-spacing-fixed-large)]">
                <li>
                  {advisorCount} Financial Advisor
                  {advisorCount === 1 ? '' : 's'}
                </li>
                <li>{staffCount} Administrative Staff</li>
              </ul>
            </>
          }
        />
      </div>

      {/* Matches `.FA-Card-Actions-Block`: a `Separator` directly above
          Actions, inset 16px on each side (that block's own horizontal
          padding in Figma) rather than spanning the column's full width.
          `w-auto` overrides Separator's own default `w-full` -- combined
          with `mx-*`, `w-full` would overflow the column by 32px (an
          explicit 100% width ignores margins), whereas `w-auto` lets the
          parent flex column's default `align-items: stretch` size it to
          fill the *remaining* width after the margins instead. `mt-auto`
          lives on the separator, not `EntityActions` itself, per the
          user -- it pins the divider (and everything after it) to the
          bottom of the main column, which is now stretched to match the
          side panels' height (EntityCard's `align-items: stretch`). The
          portrait+name lockup above stays pinned to the top, and the gap
          right before the separator absorbs the extra height. */}
      <Separator className="mt-auto mx-[var(--density-spacing-fixed-large)] w-auto" />
      {/* Real link, not inert -- same as AdvisorCard's "View Profile":
          every branch gets an individual page later, so `/branch/:id`
          renders as a genuine href now even though `router.tsx` has no
          matching route yet. */}
      <EntityActions
        primaryLabel="View Branch"
        primaryHref={`/branch/${location.id}`}
      />
    </EntityCard>
  );
}
