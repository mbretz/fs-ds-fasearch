import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'icons';
import type { Location } from '../../data/locations';
import { EntityPortrait } from '../entity-info/EntityPortrait';
import { NameBlock } from '../entity-info/NameBlock';
import { EntityActions } from '../entity-info/EntityActions';
import { splitAddressLines } from '../../utils/splitAddressLines';
import { getFullName } from '../../utils/getFullName';

export interface BranchPopoverContentProps {
  location: Location;
  /** Matches Figma's `Branch-Map-Tile` Large/Small variants -- an 80px
   * vs. 48px location portrait, per the user. Callers pick based on the
   * map's own rendered width (see Map.tsx), not a viewport breakpoint --
   * same reasoning as `AdvisorPopoverContentProps.size`. */
  size: 'sm' | 'lg';
}

// Matches Figma's `Branch-Map-Tile` (1433:40228) two-state drill-down --
// Branch (location photo/address + "View Location" + a "N Financial
// Advisors" chevron-right) and Advisors (a name list + "Back to
// Location" chevron-left) -- local `useState`, not lifted, since nothing
// else on the page needs to know which state a given popover is in.
export function BranchPopoverContent({
  location,
  size,
}: BranchPopoverContentProps) {
  const [showAdvisors, setShowAdvisors] = useState(false);
  const { street, cityStateZip } = splitAddressLines(location.address);

  if (showAdvisors) {
    return (
      <div className="flex w-[260px] flex-col gap-[var(--density-spacing-fixed-large)] p-[var(--density-spacing-fixed-large)]">
        <ul className="flex flex-col gap-[var(--density-spacing-fixed-small)]">
          {location.advisors.map((advisor) => (
            <li
              key={advisor.id}
              className="flex items-center gap-[var(--density-spacing-fixed-small)]"
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
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setShowAdvisors(false)}
          className="flex cursor-pointer items-center gap-[var(--density-spacing-fixed-small)] text-[length:var(--semantic-content-common-font-size)] leading-[length:var(--semantic-content-common-line-height)] text-[color:var(--component-link-text-color-default)]"
        >
          <ChevronLeft
            aria-hidden="true"
            className="size-[var(--density-sizing-fixed-large)]"
          />
          Back to Location
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-[260px] flex-col gap-[var(--density-spacing-fixed-large)] p-[var(--density-spacing-fixed-large)]">
      <div className="flex gap-[var(--density-spacing-fixed-large)]">
        <EntityPortrait
          name={location.name}
          photoUrl={location.officePhotoUrl}
          variant="entity"
          size={size === 'lg' ? 'lg' : 'md'}
        />
        <NameBlock
          heading={
            <>
              {street}
              <br />
              {cityStateZip}
            </>
          }
          className="self-center"
        />
      </div>
      <EntityActions
        primaryLabel="View Location"
        primaryHref={`/branch/${location.id}`}
        orientation="block"
      />
      {/* This pin type also covers a zero-advisor (support-staff-only)
          location -- see pinType.ts -- where there's no advisor list to
          drill into at all. */}
      {location.advisors.length > 0 && (
        <button
          type="button"
          onClick={() => setShowAdvisors(true)}
          className="flex cursor-pointer items-center justify-between gap-[var(--density-spacing-fixed-small)] text-[length:var(--semantic-content-common-font-size)] leading-[length:var(--semantic-content-common-line-height)] text-[color:var(--component-link-text-color-default)]"
        >
          {location.advisors.length} Financial Advisor
          {location.advisors.length === 1 ? '' : 's'}
          <ChevronRight
            aria-hidden="true"
            className="size-[var(--density-sizing-fixed-large)]"
          />
        </button>
      )}
    </div>
  );
}
