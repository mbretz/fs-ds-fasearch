import { useParams } from 'react-router-dom';
import { findLocationById } from '../utils/findAdvisor';
import { LocationHero } from '../components/hero/LocationHero';
import { cn } from '../utils/cn';

// Same mobile-flow/desktop-grid split as AdvisorProfile.tsx -- see its own
// comment for why the two breakpoints need genuinely separate trees, and
// why the Hero needs explicit `md:col-start-1`/`md:row-start-1` (not just
// `col-span-2`). The rail here is the Location Information panel (Figma's
// `BranchInfo-1Column-wBranchTeamPhotos`), not yet built.
export function LocationProfile() {
  const { id } = useParams<{ id: string }>();
  const location = id ? findLocationById(id) : undefined;

  if (!location) {
    return (
      <p className="mx-[var(--density-layout-fixed-large)] mt-[var(--density-layout-fixed-large)] md:mx-0">
        Location not found.
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-y-[var(--density-layout-fixed-large)] [overflow-anchor:none] md:hidden">
        <LocationHero location={location} />
        <p className="mx-[var(--density-layout-fixed-large)]">
          Location profile body placeholder — advisor list and hours to come.
        </p>
        <div className="mx-[var(--density-layout-fixed-large)]">
          <p className="rounded-[4px] bg-[color:var(--semantic-surface-base-default)] p-[20px] text-[color:var(--semantic-content-common-text-color-default)] shadow-[0px_3px_3px_-2px_rgba(13,13,13,0.25),0px_4px_6px_0px_rgba(75,77,78,0.2)]">
            Location information panel placeholder — office hours, contact, and
            branch team to come.
          </p>
        </div>
      </div>
      {/* `@container/location-hero` (named, `[container-type:inline-
          size]`) lives on THIS wrapper, one level above the actual
          grid -- same reasoning as AdvisorProfile.tsx's own wrapper
          (see its comment): a container query can't affect the element
          that establishes the container, confirmed live there.

          Below this container's own 940px width: single column
          (`grid-cols-1`), rail panel hidden from its overlapping
          position and moved to a third stacked row below the body
          placeholder instead (the mobile treatment, per the user --
          same as AdvisorProfile.tsx's own rail panel below its own
          threshold), and `--location-hero-portrait-size` is a flat
          240px (this banner's original fixed size) -- no rail, no
          space pressure, so the portrait resets to full size and the
          address/branch-list content below runs the Hero's own full
          width.

          At/above 940px: two columns (`grid-cols-[1fr_400px]`), rail
          panel back in its overlapping position, and the portrait
          property switches to a `clamp()`'d fluid value. Ceiling
          (240px) reached at container=1000px; floor (180px) at
          container=940px -- an 60px-wide window with the portrait
          absorbing 100% of the container's narrowing (a straight 1:1
          slope, `container - 760`). Unlike AdvisorProfile.tsx's own
          portrait+gutter combination, there's only ONE fluid value
          here (no gutter shrinking alongside it, see LocationHero.tsx's
          own comment for why), so a 1:1 slope can't create the same
          non-monotonic dip that combination produced there -- a single
          clamp()'d value against a fixed subtraction is always
          monotonic on its own. 180px floor keeps the 240:180 (1.33:1)
          ceiling:floor ratio well under `modern-web-guidance`'s
          `fluid-scaling` guide's 2.5x accessibility cap. There's no
          status-tag-style hard failure mode driving these exact numbers
          (unlike AdvisorProfile.tsx's own 216px tag-width target) --
          per the user, this is a proportionate port of the same
          structural approach, not a re-derivation against a concrete
          bug. */}
      <div className="hidden md:block @container/location-hero">
        <div
          className={cn(
            'md:grid md:grid-cols-1 md:items-start md:gap-x-[var(--density-layout-fixed-xx-large)] md:gap-y-[var(--density-layout-fixed-large)]',
            '@[940px]/location-hero:grid-cols-[1fr_400px]',
            '[--location-hero-portrait-size:240px]',
            '@[940px]/location-hero:[--location-hero-portrait-size:clamp(180px,calc(-760px+100cqi),240px)]',
          )}
        >
          <LocationHero
            location={location}
            // `@[940px]/location-hero:col-end-3` (not `col-span-2`) --
            // same shorthand-clobbering reasoning as AdvisorProfile.tsx's
            // own Hero (see its own comment): `col-span-2` sets the full
            // `grid-column` shorthand, which would reset the separately-
            // declared `md:col-start-1`'s own start line whenever it won
            // the cascade.
            className="md:col-start-1 md:row-start-1 @[940px]/location-hero:col-end-3"
          />
          <p className="md:col-start-1 md:row-start-2">
            Location profile body placeholder — advisor list and hours to come.
          </p>
          {/* `relative` -- see AdvisorProfile.tsx's own comment on why
              this card is otherwise hidden behind the Hero's positioned
              banner.
              Base `md:col-start-1 md:row-start-3` stacks this below the
              body placeholder (the mobile treatment, per the user) below
              the grid's own 940px threshold; `@[940px]/location-hero:`
              overrides restore the overlapping treatment above it --
              `row-end-3` not `row-span-2`, same shorthand-clobbering
              reasoning as the Hero's own `col-end-3` above. */}
          <div className="relative md:col-start-1 md:row-start-3 @[940px]/location-hero:col-start-2 @[940px]/location-hero:row-start-1 @[940px]/location-hero:row-end-3 @[940px]/location-hero:mt-[36px] @[940px]/location-hero:pr-[40px]">
            <p className="rounded-[4px] bg-[color:var(--semantic-surface-base-default)] p-[20px] text-[color:var(--semantic-content-common-text-color-default)] shadow-[0px_3px_3px_-2px_rgba(13,13,13,0.25),0px_4px_6px_0px_rgba(75,77,78,0.2)]">
              Location information panel placeholder — office hours, contact,
              and branch team to come.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
