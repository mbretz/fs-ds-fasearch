import { useParams } from 'react-router-dom';
import { findAdvisorById } from '../utils/findAdvisor';
import { AdvisorHero } from '../components/hero/AdvisorHero';

// Two separate trees below a `md:`/`hidden` breakpoint switch -- not one
// tree reused via responsive utility classes -- because the two
// breakpoints need genuinely different DOM relationships, not just
// different positioning of the same elements:
//
// - Mobile: Hero, body, and rail must all share ONE plain-flow parent (this
//   very `<div>`). `position: sticky`'s stuck range is bounded by its own
//   DIRECT parent's box -- AdvisorHero's mobile rendering deliberately
//   returns a Fragment, not a wrapping div (see its own comment), so that
//   parent is THIS div, not some smaller box scoped to the Hero alone. If
//   the sticky bar's parent only contained the Hero's own content, it
//   would shrink every time the Hero collapses on scroll, and the sticky
//   bar would run out of "room to stay stuck" partway down the page
//   (confirmed live: it vanished entirely once collapsed, since its
//   shrunk parent had already scrolled out of range). Keeping body+rail
//   as normal-flow siblings in this same div keeps it tall for as long as
//   the page has content, regardless of the Hero's own current height.
// - Desktop: Hero, body, and rail are separate CSS Grid items instead,
//   per the user -- the rail (Office Info / New Client Inquiry panel,
//   not yet built) needs to `row-span` into the Hero's own row so it can
//   overlap up into it (Figma's real page has the rail card starting
//   ~36px into the Hero, not flush below it), which requires them to be
//   siblings positioned by grid-column/row, not nested in one flow.
//   `md:items-start` keeps row 1 sized to the Hero's own height instead
//   of stretching to match the (taller, row-spanning) rail. The Hero
//   needs BOTH an explicit `md:row-start-1` AND `md:col-start-1` --
//   `col-span-2` alone leaves the start column to auto-placement, and
//   since the rail's own explicit placement already claims column 2 of
//   row 1, auto-placement can't find a free 2-column span there at all;
//   confirmed live, it silently grew the grid two EXTRA implicit columns
//   and rendered the Hero off in columns 3-4 instead of overlapping the
//   rail as intended.
export function AdvisorProfile() {
  const { id } = useParams<{ id: string }>();
  const found = id ? findAdvisorById(id) : undefined;

  if (!found) {
    return (
      <p className="mx-[var(--density-layout-fixed-large)] mt-[var(--density-layout-fixed-large)] md:mx-0">
        Advisor not found.
      </p>
    );
  }

  const { advisor, location } = found;

  return (
    <>
      <div className="flex flex-col gap-y-[var(--density-layout-fixed-large)] [overflow-anchor:none] md:hidden">
        <AdvisorHero advisor={advisor} location={location} />
        <p className="mx-[var(--density-layout-fixed-large)]">
          Advisor profile body placeholder — bio, focus areas, and meeting
          details to come.
        </p>
        {/* Office Info / New Client Inquiry panel -- not yet built, see
            RESUME_NOTES.txt. */}
        <div className="mx-[var(--density-layout-fixed-large)]">
          <p className="rounded-[4px] bg-[color:var(--semantic-surface-base-default)] p-[20px] text-[color:var(--semantic-content-common-text-color-default)] shadow-[0px_3px_3px_-2px_rgba(13,13,13,0.25),0px_4px_6px_0px_rgba(75,77,78,0.2)]">
            Office information panel placeholder — office hours, contact, and
            branch team to come.
          </p>
        </div>
      </div>
      <div className="hidden md:grid md:grid-cols-[1fr_400px] md:items-start md:gap-x-[var(--density-layout-fixed-xx-large)] md:gap-y-[var(--density-layout-fixed-large)]">
        <AdvisorHero
          advisor={advisor}
          location={location}
          className="md:col-span-2 md:col-start-1 md:row-start-1"
        />
        <p className="md:col-start-1 md:row-start-2">
          Advisor profile body placeholder — bio, focus areas, and meeting
          details to come.
        </p>
        {/* `relative` (z-index:auto) -- without it, this non-positioned
            card loses to the Hero's own `position: relative` banner in
            paint order regardless of DOM order (positioned elements
            always paint above static ones); confirmed live, the rail was
            fully hidden behind the banner without this. */}
        <div className="relative md:col-start-2 md:row-start-1 md:row-span-2 md:mt-[36px]">
          <p className="rounded-[4px] bg-[color:var(--semantic-surface-base-default)] p-[20px] text-[color:var(--semantic-content-common-text-color-default)] shadow-[0px_3px_3px_-2px_rgba(13,13,13,0.25),0px_4px_6px_0px_rgba(75,77,78,0.2)]">
            Office information panel placeholder — office hours, contact, and
            branch team to come.
          </p>
        </div>
      </div>
    </>
  );
}
