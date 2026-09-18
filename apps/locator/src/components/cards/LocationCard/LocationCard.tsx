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
  onViewBranch?: () => void;
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
export function LocationCard({
  location,
  onViewBranch,
  className,
}: LocationCardProps) {
  const advisorCount = location.advisors.length;
  const staffCount = location.supportStaff.length;
  const { street, cityStateZip } = splitAddressLines(location.address);

  return (
    <EntityCard
      className={className}
      panels={[
        <AdvisorsAtLocationPanel key="advisors" advisors={location.advisors} />,
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
          supportStaff={location.supportStaff}
        />,
      ]}
    >
      {/* `items-center`, not `items-start`: the address heading + "at
          this branch" list are vertically centered against the avatar
          image, per the user. */}
      <div className="flex items-center gap-[var(--density-spacing-fixed-large)]">
        {/* `name` here only drives the avatar's initials/accessible name
            fallback (e.g. "St. Louis Downtown" -> "SD") -- the visible
            heading below is always `location.address`, per the user's ask
            to stop displaying location shortnames on cards. `photoUrl` is
            `officePhotoUrl` -- per the user, this card's own avatar is
            where the branch photo belongs, distinct from the (separate,
            not-yet-built) full Office Details panel on profile pages,
            which is why `OfficeDetailsPanel` below doesn't get it too. */}
        {/* 240x240px matches Figma's own `AvatarGroup` measurement on the
            Branch-Card-SidePanels Left Column header -- outside DS
            Avatar's own size scale entirely (`2xl` tops out at 144px),
            so this overrides the box/font/icon sizing directly rather
            than picking the closest named step. Font-size and the
            `--avatar-icon-size` custom property are scaled to the same
            ratios Avatar's own size steps already use (~0.32x box for
            font-size, 0.6x box for icon-size — e.g. `xl`: 32px font /
            104px box; `2xl`: 48px font / 144px box), not arbitrary
            numbers, so a 240px avatar's initials/fallback icon still
            look proportional to every other Avatar size in the DS. */}
        <EntityPortrait
          name={location.name}
          photoUrl={location.officePhotoUrl}
          variant="entity"
          size="lg"
          avatarClassName="size-[240px] text-[76px] [--avatar-icon-size:144px]"
        />
        <NameBlock
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
      <EntityActions
        primaryLabel="View Branch"
        onPrimaryAction={onViewBranch}
      />
    </EntityCard>
  );
}
