import { Link } from 'ds';
import type { BranchSupportStaff } from '../../data/locations';
import { EntityPortrait } from './EntityPortrait';
import { cn } from '../../utils/cn';
import { splitAddressLines } from '../../utils/splitAddressLines';

export interface OfficeDetailsPanelProps {
  /** Matches Figma's "Show Component Heading" property -- defaults to
   * shown, since every confirmed usage of this panel keeps it visible. */
  showTitle?: boolean;
  /** Matches Figma's "Branch Image" slot -- `Location.officePhotoUrl`. */
  officePhotoUrl?: string;
  address?: string;
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

// Neither a real <a> nor DS `Link` has a native `disabled` attribute, so
// this fakes it the same way Start.tsx/SiteHeader.tsx/ProspectPortal do
// for every other not-really-wired-up destination in this app: an inert
// `href="#"`, aria-disabled, tabIndex -1, onClick preventDefault, and a
// `cursor-not-allowed` override. Per the user, address/phone links stay
// inactive for this prototype rather than actually opening Google Maps
// or dialing a fake `555` number.
function preventDisabledClick(event: { preventDefault: () => void }) {
  event.preventDefault();
}

const headingClassName =
  'text-[length:var(--semantic-content-heavy-font-size)] leading-[length:var(--semantic-content-heavy-line-height)] font-[number:var(--semantic-content-heavy-font-weight)] text-[color:var(--semantic-content-common-text-color-default)]';
const bodyClassName =
  'text-[length:var(--semantic-content-common-font-size)] leading-[length:var(--semantic-content-common-line-height)] font-[number:var(--semantic-content-common-font-weight)] text-[color:var(--semantic-content-common-text-color-default)]';

// Matches `BranchInfo-1Column-wBranchTeamPhotos` (`1:317`), shared by both
// AdvisorCard (the advisor's own office) and LocationCard (the branch
// itself) -- Branch Image/Address/Hours/Phone+Fax/Support-staff are each
// independently conditional, same as Figma's own "Show Branch Image"/
// "Show Office Address"/"Show Office Hours"/"Show OfficeContact-Inline"/
// "Show Branch Team" properties. Deliberately excludes "Branch Social"
// (low-fidelity placeholder images in Figma, unrelated to the real
// per-advisor LinkedIn/Facebook links, which live on AdvisorCard's own
// header instead). The address link is a single `Link`, not a pin icon +
// link like `ContactLinks` -- Figma's own Office Address instance has no
// icon here. Its street/city-state-zip split (`splitAddressLines`) and
// `newWindow` treatment match LocationCard's own card-title heading, per
// the user.
//
// The address and phone links are inert (per the user, deliberately
// inactive for this prototype) -- same `href="#"`/aria-disabled/
// tabIndex -1/preventDefault convention Start.tsx/SiteHeader.tsx/
// ProspectPortal already use for every other not-really-wired-up
// destination in this app, rather than actually opening Google Maps or
// dialing a fake `555` number. `newWindow` is still safe to combine with
// that -- the click is prevented before any navigation would occur, so
// `target="_blank"` never actually fires.
export function OfficeDetailsPanel({
  showTitle = true,
  officePhotoUrl,
  address,
  hours,
  hoursLabel = 'Office Hours',
  phone,
  fax,
  supportStaff = [],
  className,
}: OfficeDetailsPanelProps) {
  const hasContact = phone || fax;
  if (
    !officePhotoUrl &&
    !address &&
    !hours &&
    !hasContact &&
    supportStaff.length === 0
  ) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex h-full flex-col gap-[var(--density-spacing-fixed-large)] rounded-[var(--semantic-surface-border-radius)] bg-[var(--color-surface-background-color-neutral-1)] p-[var(--density-spacing-fixed-large)]',
        className,
      )}
    >
      {showTitle && (
        <span className="text-[length:var(--semantic-content-subheading-font-size)] leading-[length:var(--semantic-content-subheading-line-height)] font-[number:var(--semantic-content-subheading-font-weight)] text-[color:var(--semantic-content-common-text-color-default)]">
          Office Information
        </span>
      )}

      {officePhotoUrl && (
        <img
          src={officePhotoUrl}
          alt=""
          className="h-[210px] w-full rounded-[var(--semantic-surface-border-radius)] object-cover"
        />
      )}

      {address &&
        (() => {
          const { street, cityStateZip } = splitAddressLines(address);
          return (
            <div className="flex flex-col gap-[var(--density-spacing-fixed-x-small)]">
              <span className={headingClassName}>Office Address</span>
              <Link
                href="#"
                aria-disabled="true"
                tabIndex={-1}
                onClick={preventDisabledClick}
                newWindow
                className="cursor-not-allowed"
              >
                {street}
                <br />
                {cityStateZip}
              </Link>
            </div>
          );
        })()}

      {hours && (
        <div className="flex flex-col gap-[var(--density-spacing-fixed-x-small)]">
          <span className={headingClassName}>{hoursLabel}</span>
          {/* `Location.hours` packs multiple day-range entries into one
              comma-separated display string (e.g. "Mon-Fri 8am-6pm, Sat
              9am-1pm") -- each one gets its own line here rather than
              running together as a single wrapped sentence, per the
              user. */}
          <div className="flex flex-col">
            {hours.split(',').map((entry) => (
              <span key={entry} className={bodyClassName}>
                {entry.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {hasContact && (
        <div className="flex flex-wrap gap-[var(--density-spacing-fixed-xx-large)]">
          {phone && (
            <div className="flex flex-col gap-[var(--density-spacing-fixed-x-small)]">
              <span className={headingClassName}>Phone</span>
              <Link
                href="#"
                aria-disabled="true"
                tabIndex={-1}
                onClick={preventDisabledClick}
                className="cursor-not-allowed"
              >
                {phone}
              </Link>
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
