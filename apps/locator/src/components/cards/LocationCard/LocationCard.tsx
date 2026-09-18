import type { Location } from '../../../data/locations';
import { EntityCard } from '../EntityCard/EntityCard';
import { AdvisorsAtLocationPanel } from '../EntityCard/AdvisorsAtLocationPanel';
import { EntityPortrait } from '../../entity-info/EntityPortrait';
import { NameBlock } from '../../entity-info/NameBlock';
import { ContactLinks } from '../../entity-info/ContactLinks';
import { EntityActions } from '../../entity-info/EntityActions';
import { OfficeDetailsPanel } from '../../entity-info/OfficeDetailsPanel';

export interface LocationCardProps {
  location: Location;
  onViewBranch?: () => void;
  className?: string;
}

// Assembles Figma's `Branch-Card-SidePanels`/`Branch-Card-Mobile`
// compositions. Reuses `.FA-Name+Accreditations` (via `NameBlock`) the
// same way Figma does on the Left Column header: address in the "heading"
// slot, a "N Financial Advisors / M Administrative Staff" summary in the
// "subheading" slot that Figma's own advisor cards use for designations.
//
// No status tag/badge or favorite toggle: no Status Tag or Favorite
// instance was found on any Branch-Card-* composition fetched (those are
// FA-Card-only), and `Location.open`'s own status-tag equivalent -- if
// one exists -- wasn't resolved either; left out rather than invented.
export function LocationCard({
  location,
  onViewBranch,
  className,
}: LocationCardProps) {
  const advisorCount = location.advisors.length;
  const staffCount = location.supportStaff.length;
  const summary = `At this Edward Jones Branch: ${advisorCount} Financial Advisor${advisorCount === 1 ? '' : 's'}, ${staffCount} Administrative Staff`;

  return (
    <EntityCard
      className={className}
      panels={[
        <OfficeDetailsPanel
          key="office-details"
          officePhotoUrl={location.officePhotoUrl}
          address={location.address}
          hours={location.hours}
          phone={location.phone}
          fax={location.fax}
          supportStaff={location.supportStaff}
        />,
        <AdvisorsAtLocationPanel key="advisors" advisors={location.advisors} />,
      ]}
    >
      <div className="flex items-start gap-[var(--density-spacing-fixed-large)]">
        {/* `name` here only drives the avatar's initials/accessible name
            (e.g. "St. Louis Downtown" -> "SD") -- the visible heading
            below is always `location.address`, per the user's ask to stop
            displaying location shortnames on cards. */}
        <EntityPortrait
          name={location.name}
          photoUrl={location.officePhotoUrl}
          variant="entity"
          size="lg"
        />
        <NameBlock heading={location.address} subheading={summary} />
      </div>

      <ContactLinks address={location.address} phone={location.phone} />

      <EntityActions
        primaryLabel="View Branch"
        onPrimaryAction={onViewBranch}
      />
    </EntityCard>
  );
}
