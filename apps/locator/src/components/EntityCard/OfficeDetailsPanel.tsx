import { Link } from 'ds';
import type { BranchSupportStaff } from '../../data/locations';
import { EntityPortrait } from '../entity-info/EntityPortrait';
import { cn } from '../../utils/cn';

export interface OfficeDetailsPanelProps {
  address?: string;
  /** Defaults to a Google Maps search URL built from `address`. */
  addressHref?: string;
  /** `Location.hours`' existing single display string (e.g. "Mon-Fri
   * 8am-5pm") -- per-day hours are out of scope, see docs/PLAN.md. */
  hours?: string;
  /**
   * Figma's `Office Hours` sub-component has a configurable heading, used
   * as "Advisor Hours" instead of "Office Hours" in the advisor-specific
   * context (`FA-Team-Hours`, `1:304`) -- the outer "Office Information"
   * title doesn't change there, only this inner one. AdvisorCard should
   * pass "Advisor Hours" when showing an advisor's own divergent
   * schedule (`Advisor.hours`); LocationCard leaves this at its default.
   */
  hoursLabel?: string;
  phone?: string;
  fax?: string;
  supportStaff?: BranchSupportStaff[];
  className?: string;
}

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

const headingClassName =
  'text-[length:var(--semantic-content-heavy-font-size)] leading-[length:var(--semantic-content-heavy-line-height)] font-[number:var(--semantic-content-heavy-font-weight)] text-[color:var(--semantic-content-common-text-color-default)]';
const bodyClassName =
  'text-[length:var(--semantic-content-common-font-size)] leading-[length:var(--semantic-content-common-line-height)] font-[number:var(--semantic-content-common-font-weight)] text-[color:var(--semantic-content-common-text-color-default)]';

// Matches `BranchInfo-1Column-wBranchTeamPhotos` (`1:317`), shared by both
// AdvisorCard (the advisor's own office) and LocationCard (the branch
// itself) -- Address/Hours/Phone+Fax/Support-staff are each independently
// conditional, same as Figma's own "Show Office Address"/"Show Office
// Hours"/"Show OfficeContact-Inline"/"Show Branch Team" properties.
// Deliberately excludes: the optional branch photo (no field in the data
// model, out of scope) and "Branch Social" (low-fidelity placeholder
// images in Figma, unrelated to the real per-advisor LinkedIn/Facebook
// links, which live on AdvisorCard's own header instead). The address
// link is a single `Link` with `newWindow`, not a pin icon + link like
// `ContactLinks` -- Figma's own Office Address instance has no icon here.
export function OfficeDetailsPanel({
  address,
  addressHref,
  hours,
  hoursLabel = 'Office Hours',
  phone,
  fax,
  supportStaff = [],
  className,
}: OfficeDetailsPanelProps) {
  const hasContact = phone || fax;
  if (!address && !hours && !hasContact && supportStaff.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-[var(--density-spacing-fixed-large)] rounded-[var(--semantic-surface-border-radius)] bg-[var(--color-surface-background-color-neutral-1)] p-[var(--density-spacing-fixed-large)]',
        className,
      )}
    >
      <span className="text-[length:var(--semantic-content-subheading-font-size)] leading-[length:var(--semantic-content-subheading-line-height)] font-[number:var(--semantic-content-subheading-font-weight)] text-[color:var(--semantic-content-common-text-color-default)]">
        Office Information
      </span>

      {address && (
        <Link
          href={
            addressHref ??
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
          }
          newWindow
        >
          {address}
        </Link>
      )}

      {hours && (
        <div className="flex flex-col gap-[var(--density-spacing-fixed-x-small)]">
          <span className={headingClassName}>{hoursLabel}</span>
          <span className={bodyClassName}>{hours}</span>
        </div>
      )}

      {hasContact && (
        <div className="flex flex-wrap gap-[var(--density-spacing-fixed-xx-large)]">
          {phone && (
            <div className="flex flex-col gap-[var(--density-spacing-fixed-x-small)]">
              <span className={headingClassName}>Phone</span>
              <Link href={telHref(phone)}>{phone}</Link>
            </div>
          )}
          {fax && (
            <div className="flex flex-col gap-[var(--density-spacing-fixed-x-small)]">
              <span className={headingClassName}>Fax</span>
              <span className={bodyClassName}>{fax}</span>
            </div>
          )}
        </div>
      )}

      {supportStaff.length > 0 && (
        <div className="flex flex-col gap-[var(--density-spacing-fixed-large)]">
          <span className={headingClassName}>Branch Team</span>
          {supportStaff.map((staff) => (
            <div
              key={staff.id}
              className="flex items-center gap-[var(--density-spacing-fixed-med)]"
            >
              <EntityPortrait
                name={staff.name}
                photoUrl={staff.photoUrl}
                size="sm"
              />
              <div className="flex flex-col">
                <span className={bodyClassName}>{staff.name}</span>
                <span className="text-[length:var(--semantic-content-microcopy-font-size)] leading-[length:var(--semantic-content-microcopy-line-height)] font-[number:var(--semantic-content-microcopy-font-weight)] text-[color:var(--semantic-content-common-text-color-default)]">
                  {staff.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
