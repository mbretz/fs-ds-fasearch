import { Fragment } from 'react';
import { Link } from 'ds';
import type {
  BranchSupportStaff,
  DayHours,
  DayOfWeek,
  WeeklyHours,
} from '../../data/locations';
import { cn } from '../../utils/cn';
import { splitAddressLines } from '../../utils/splitAddressLines';
import { BranchTeamMemberRow } from './BranchTeamMemberRow';

export interface OfficeDetailsPanelProps {
  /** Matches Figma's "Show Component Heading" property -- defaults to
   * shown, since every confirmed usage of this panel keeps it visible. */
  showTitle?: boolean;
  /** Matches Figma's "Branch Image" slot -- `Location.officePhotoUrl`. */
  officePhotoUrl?: string;
  address?: string;
  hours?: WeeklyHours;
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

// Matches Figma's `.Day` abbreviations exactly (`Tues`, not `Tue`).
const dayLabels: Record<DayOfWeek, string> = {
  mon: 'Mon',
  tue: 'Tues',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
};
const orderedDays: DayOfWeek[] = [
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
  'sun',
];

function formatDayHours(day: DayHours): string {
  switch (day.status) {
    case 'open':
      // `opens`/`closes` are already "8:00am"-style strings -- just
      // uppercasing the meridiem matches Figma's "8:00AM" display exactly.
      return `${day.opens.toUpperCase()} - ${day.closes.toUpperCase()}`;
    case 'byAppointment':
      return 'By Appointment Only';
    case 'closed':
      return 'Closed';
  }
}

const headingClassName =
  'uppercase text-[length:var(--semantic-content-nanoheading-font-size)] leading-[length:var(--semantic-content-nanoheading-line-height)] font-[number:var(--semantic-content-nanoheading-font-weight)] text-[color:var(--semantic-content-common-text-color-default)]';
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
    // `@container/office-details` lives on THIS wrapper, one level above
    // the actual styled panel below -- not on that div itself. A CSS
    // container query can't affect the very element that establishes the
    // container (confirmed earlier this session, AdvisorProfile.tsx's own
    // identical wrapper/grid split) -- with the grid-switch style block
    // and `@container/office-details` on the SAME div, the query silently
    // never matched at all (confirmed live, Playwright: `display` stayed
    // `flex` at 800-900px container widths, well past the 560px
    // threshold). This wrapper carries the caller's own `className`
    // (grid/flex placement from EntityCard, margin, `shadow-elevation-
    // raised` from the profile pages) and no visual styling of its own,
    // so a shadow passed in still renders flush against the inner panel's
    // own box below (which has zero padding/border between them).
    <div className={cn('@container/office-details h-full', className)}>
      <div className="office-details-panel flex h-full flex-col gap-[var(--density-spacing-fixed-large)] rounded-[var(--semantic-surface-border-radius)] bg-[var(--color-surface-background-color-neutral-1)] p-[var(--density-spacing-fixed-large)]">
        {/* Hides this panel outright once its `EntityCard` ancestor is too
          narrow for side-by-side panels (the same `@container/entity-card`
          threshold that flips `EntityCard`'s own grid to stacked) -- per
          the user, office info isn't worth keeping once there's no room
          for it, unlike `FocusAreasPanel`, which still stacks below main
          rather than disappearing. Visible by default (not gated behind a
          matching container query) so a future standalone usage outside
          any `EntityCard` -- e.g. this comment's own "full Office Details
          panel on profile pages" -- isn't silently hidden by a query that
          never has an `entity-card` container to match against.

          The 2nd rule (own `@container/office-details`, not an ancestor's)
          switches this panel from its default single flex column to a
          real 2-column CSS Grid once it's wide enough -- per the user,
          "consider container query or css column splitting"; a container
          query onto an explicit grid was chosen over CSS multicol
          (`columns: 2`) since this panel's own sections are each
          independently optional (image/address/hours/contact/team can
          each be present or absent), and plain grid auto-placement
          (each section only declares ITS OWN `grid-column: 1` or `2`,
          no `grid-template-areas`) already packs whichever sections
          exist into the two columns in DOM order with no per-section
          "is this the first/last visible one" bookkeeping needed --
          multicol's own content-driven column-balancing has no
          equivalent one-line way to pin specific sections to specific
          columns the way this design wants (image+address together on
          the left, hours/contact/team on the right). `minmax(200px,280px)`
          on column 1 is what actually fixes the oversized-image problem
          -- the image's own `w-full` now stretches to at most 280px
          instead of this panel's full (wide) width. Title still spans
          both columns via `grid-column: 1 / -1` regardless. */}
        <style>{`
        @container entity-card (max-width: 679.98px) {
          .office-details-panel {
            display: none;
          }
        }
        @container office-details (min-width: 560px) {
          .office-details-panel {
            display: grid;
            grid-template-columns: minmax(200px, 280px) 1fr;
            /* \`dense\`, not the default sparse packing -- confirmed live
               (Playwright): with sparse packing, placing Image (column 1)
               before Hours (column 2) advances the auto-placement
               cursor's row past row 2 before Hours is ever considered,
               since sparse packing's cursor only moves forward and Hours'
               search starts from wherever the cursor already sits, not
               from row 2 -- Hours landed in row 3 (beside Address, not
               beside Image), leaving row 2's own column-2 cell empty.
               Dense packing re-scans for the earliest open cell for every
               item regardless of the running cursor, which is exactly
               "start column 2's content in the same row column 1's own
               first item occupies," per the user. */
            grid-auto-flow: dense;
            align-items: start;
            column-gap: var(--density-spacing-fixed-xx-large);
            /* Left/right/bottom padding step up to \`xx-large\` (24px,
               matching the column-gap above) once in 2-column mode, per
               the user -- top stays the base \`large\` (16px) set on this
               element's own Tailwind \`p-[...]\` class, unchanged. Longhand
               \`padding-{left,right,bottom}\`, not a \`padding\` shorthand
               override, so it layers onto that existing declaration
               instead of also having to repeat its own top value here. */
            padding-left: var(--density-spacing-fixed-xx-large);
            padding-right: var(--density-spacing-fixed-xx-large);
            padding-bottom: var(--density-spacing-fixed-xx-large);
          }
          .office-details-panel > .office-details-title {
            grid-column: 1 / -1;
          }
          .office-details-panel > .office-details-image,
          .office-details-panel > .office-details-address {
            grid-column: 1;
          }
          .office-details-panel > .office-details-hours,
          .office-details-panel > .office-details-contact,
          .office-details-panel > .office-details-team {
            grid-column: 2;
          }
        }
      `}</style>
        {showTitle && (
          <span className="office-details-title text-[length:var(--semantic-content-subheading-font-size)] leading-[length:var(--semantic-content-subheading-line-height)] font-[number:var(--semantic-content-subheading-font-weight)] text-[color:var(--semantic-content-common-text-color-default)]">
            Office Information
          </span>
        )}

        {officePhotoUrl && (
          <img
            src={officePhotoUrl}
            alt=""
            className="office-details-image h-[210px] w-full rounded-[var(--semantic-surface-border-radius)] object-cover"
          />
        )}

        {address &&
          (() => {
            const { street, cityStateZip } = splitAddressLines(address);
            return (
              <div className="office-details-address flex flex-col gap-[var(--density-spacing-fixed-x-small)]">
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
          <div className="office-details-hours flex flex-col gap-[var(--density-spacing-fixed-x-small)]">
            <span className={headingClassName}>{hoursLabel}</span>
            {/* Matches Figma's `.DayRow` table (`1:347`): a two-column grid,
              day abbreviation + hours, one row per day, `Closed` shown
              explicitly rather than omitting the day. `auto` (not a fixed
              px) sizes the day column to its widest label ("Tues") -- no
              real sizing token lands on Figma's own 28px measurement, and
              intrinsic sizing here gets the same tabular alignment without
              hardcoding an off-token value. */}
            <div className="grid grid-cols-[auto_1fr] gap-x-[var(--density-spacing-fixed-large)] gap-y-[var(--density-spacing-fixed-xx-small)]">
              {orderedDays.map((day) => (
                <Fragment key={day}>
                  <span className={bodyClassName}>{dayLabels[day]}</span>
                  <span className={bodyClassName}>
                    {formatDayHours(hours[day])}
                  </span>
                </Fragment>
              ))}
            </div>
          </div>
        )}

        {hasContact && (
          // Narrower gap than the xx-large used elsewhere in this panel --
          // this panel's own column is a container-query-driven 25% slice of
          // the card (`EntityCard`'s grid), often just ~200px net after its
          // padding, so Phone/Fax's `flex-wrap` fit-or-stack outcome is
          // already tight; a smaller gap buys more of that budget back for
          // sitting side by side, per the user.
          <div className="office-details-contact flex flex-wrap gap-[var(--density-spacing-fixed-large)]">
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
          // Heading-to-list gap is half the item-to-item gap (`fixed-small`,
          // 8px, is exactly half of `fixed-large`, 16px, in both density
          // modes) -- matches AdvisorsAtLocationPanel's own "Branch Team"
          // block, per the user.
          <div className="office-details-team flex flex-col gap-[var(--density-spacing-fixed-small)]">
            <span className={headingClassName}>Branch Team</span>
            <ul className="flex flex-col gap-[var(--density-spacing-fixed-large)]">
              {supportStaff.map((staff) => (
                <BranchTeamMemberRow key={staff.id} staff={staff} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
