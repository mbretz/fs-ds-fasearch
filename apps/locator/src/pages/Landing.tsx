import { AdvisorSearchModule } from '../components/AdvisorSearchModule/AdvisorSearchModule';
import { Start } from '../components/AdvisorSearchModule/Start';
import { ProspectPortalLite } from '../components/ProspectPortalLite/ProspectPortalLite';
import { HowItWorks } from '../components/HowItWorks/HowItWorks';
import { InvestmentServices } from '../components/InvestmentServices/InvestmentServices';

export function Landing() {
  return (
    <>
      {/* Flush-left above the search module -- same convention
          AdvisorProfile.tsx/LocationProfile.tsx use above their own
          Hero (a plain sibling, no margin of its own beyond a small
          `mb` closing the gap to the next element down), per the user,
          2026-09-26. "Search" is this page's own `favoritesFromLabel`
          (there's no single advisor/location identity here the way a
          profile page has) -- becomes the `?from=` query param /
          Favorites page's "Back to Search" link. A single instance, not
          a mobile/desktop pair like the profile pages' own two calls --
          those fork into fully separate mobile/desktop DOM trees
          further down; this page doesn't, so one instance covers every
          width (AdvisorSearchModule handles its own internal breakpoint
          changes beneath it).

          `mt-[4px]` (mobile only, reset at `md`+) -- per the user,
          2026-09-26: below `md`, SiteShell.tsx's `<main>` has zero top
          padding of its own (product pages are meant to be full-bleed
          there), which otherwise left this sitting flush against
          SiteHeader with no breathing room. `md:mt-0` reset since
          `<main>`'s own 24px top padding at `md`+ already gives this
          plenty of clearance -- this component's own margin would just
          stack on top of that unnecessarily. */}
      <ProspectPortalLite
        favoritesFromLabel="Search"
        className="mt-[4px] mb-[4px] md:mt-0"
      />
      <AdvisorSearchModule>
        <Start />
      </AdvisorSearchModule>
      <HowItWorks />
      <InvestmentServices />
    </>
  );
}
