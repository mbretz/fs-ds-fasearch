import type { Location } from '../../data/locations';
import { AdvisorCard } from '../cards/AdvisorCard/AdvisorCard';
import { cn } from '../../utils/cn';

export interface LocationProfileBodyProps {
  location: Location;
  className?: string;
}

// DS "Heading" text style -- there's no dedicated `Heading` component in
// packages/ds to reach for instead (confirmed -- no such export there as
// of this component), so this reuses the same `semantic.content.heading`
// token set ExperienceAndBackgroundSection's own "Experience & Background"
// heading already does, for consistency across the two profile pages.
const headingClassName =
  'text-[length:var(--semantic-content-heading-font-size)] leading-[length:var(--semantic-content-heading-line-height)] font-[number:var(--semantic-content-heading-font-weight)] text-[color:var(--semantic-content-heading-color)]';

// This page's own main content (below the container/padding/border
// treatment LocationProfile.tsx shares with AdvisorProfile.tsx) -- unlike
// AdvisorProfileBody's Focus Areas/Experience/About Me/Meeting Details
// sequence, a branch has no bio content of its own to show; instead this
// renders a "Financial Advisors at this branch" heading followed by one
// AdvisorCard per `location.advisors`. Single column at every width, per
// the user -- unlike ResultsList's own 2-col (`md`)/3-col (`lg`) grid,
// this page's body content column is narrower than the full page width
// (it shares the row with the rail panel at/above the 940px container
// threshold), so a multi-column grid here would squeeze each card rather
// than giving it the same room ResultsList's own full-width grid has.
// 40px between cards, per the user -- wider than the `fixed-large` (16px)
// gap ResultsList's own multi-column grid uses, since this single column
// has no second axis to share that spacing budget with. Same
// `showPortraitBadge={false}` ResultsList uses for its own advisor cards,
// though (StatusTag above the portrait already shows status here, so the
// portrait's own corner badge would just repeat it).
//
// `className` now lands on this outer wrapper, not directly on the `<ul>`
// -- LocationProfile.tsx's own border/padding/margin/grid-placement
// classes need to apply above the heading too, not just around the card
// list. The heading's own `mb-[...]` (24px, per the user) is the gap
// between it and whatever renders below (the card list OR the empty-state
// message); the matching 24px ABOVE it comes from
// LocationProfile.tsx's own `profileBodySectionClassName` border-to-
// content padding, reduced there from AdvisorProfile.tsx's own 48px to
// 24px specifically for this page, since the heading now sits directly
// under the border -- see that file's own comment.
export function LocationProfileBody({
  location,
  className,
}: LocationProfileBodyProps) {
  return (
    <div className={className}>
      <h2
        className={cn(
          headingClassName,
          'mb-[var(--density-layout-fixed-xx-large)]',
        )}
      >
        Financial Advisors at this branch
      </h2>
      {location.advisors.length === 0 ? (
        <p>No advisors are currently listed at this location.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-[40px]">
          {location.advisors.map((advisor) => (
            <li key={advisor.id}>
              <AdvisorCard
                advisor={advisor}
                location={location}
                showPortraitBadge={false}
                // The location's own hours are already on this page
                // (LocationHero's branch-line items, and eventually the
                // rail panel) -- see AdvisorCard's own doc comment on
                // this prop.
                showOfficeDetails={false}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
