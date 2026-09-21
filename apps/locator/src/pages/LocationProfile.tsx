import { useParams } from 'react-router-dom';
import { findLocationById } from '../utils/findAdvisor';
import { LocationHero } from '../components/hero/LocationHero';

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
      <div className="hidden md:grid md:grid-cols-[1fr_400px] md:items-start md:gap-x-[var(--density-layout-fixed-xx-large)] md:gap-y-[var(--density-layout-fixed-large)]">
        <LocationHero
          location={location}
          className="md:col-span-2 md:col-start-1 md:row-start-1"
        />
        <p className="md:col-start-1 md:row-start-2">
          Location profile body placeholder — advisor list and hours to come.
        </p>
        {/* `relative` -- see AdvisorProfile.tsx's own comment on why this
            card is otherwise hidden behind the Hero's positioned banner. */}
        <div className="relative md:col-start-2 md:row-start-1 md:row-span-2 md:mt-[36px]">
          <p className="rounded-[4px] bg-[color:var(--semantic-surface-base-default)] p-[20px] text-[color:var(--semantic-content-common-text-color-default)] shadow-[0px_3px_3px_-2px_rgba(13,13,13,0.25),0px_4px_6px_0px_rgba(75,77,78,0.2)]">
            Location information panel placeholder — office hours, contact, and
            branch team to come.
          </p>
        </div>
      </div>
    </>
  );
}
