import { Navigate, useParams } from 'react-router-dom';
import { LinkNavigation } from 'ds';
import { findAdvisorById } from '../utils/findAdvisor';
import { AdvisorHeroInert } from '../components/hero/AdvisorHeroInert';
import { NewClientInquiryForm } from '../components/entity-info/NewClientInquiryForm';

/**
 * The dedicated New Client Inquiry route (`/advisor/:id/inquiry`) --
 * where the mobile Hero's own "New Client Inquiry" link navigates to
 * below the 500px width threshold (see `AdvisorHero.tsx`'s
 * `dedicatedInquiryHref`), matching Figma's `FAProfilePage/Mobile/
 * LoggedIn/InquiryForm` frame (`1639:50445`): a sticky Inert Hero
 * (`AdvisorHeroInert.tsx`) and the form panel underneath, nothing else
 * -- per the user, 2026-09-23, deliberately narrower than that Figma
 * frame's own full page (which also repeats Focus Areas/Experience &
 * Background/Meeting Details/About Me below the form).
 */
export function AdvisorInquiry() {
  const { id } = useParams<{ id: string }>();
  const found = id ? findAdvisorById(id) : undefined;

  if (!found) {
    return (
      <p className="mx-[var(--density-layout-fixed-large)] mt-[var(--density-layout-fixed-large)]">
        Advisor not found.
      </p>
    );
  }

  const { advisor } = found;
  // Same eligibility check as AdvisorProfile.tsx's own -- this route is
  // only ever linked to for accepting/waitlist advisors, but guard
  // direct URL access too rather than rendering a form for an advisor
  // who shouldn't have one.
  const showsNewClientInquiry =
    advisor.newClientStatus === 'accepting' ||
    advisor.newClientStatus === 'waitlist';

  if (!showsNewClientInquiry) {
    return <Navigate to={`/advisor/${advisor.id}`} replace />;
  }

  return (
    <div className="flex flex-col [overflow-anchor:none]">
      <AdvisorHeroInert advisor={advisor} />
      {/* Per the user, 2026-09-23: this dedicated route has no other way
          back to the profile page it branched from (unlike the inline
          form, which just lives on that same page) -- placed between the
          Hero and the form, not inside either, since it's page-level
          navigation, not part of the Hero or the Contact Form. */}
      <LinkNavigation
        href={`/advisor/${advisor.id}`}
        direction="previous"
        className="mx-[var(--density-layout-fixed-large)] mt-[var(--density-layout-fixed-large)]"
      >
        Back to profile
      </LinkNavigation>
      {/* Matches the Back-to-profile link's own `mt` above -- per the
          user, 2026-09-23, equal breathing room above and below the link
          now that it sits between the Hero and the form, rather than
          Figma's original 40px hero-to-form gap (`Main Content`'s own
          `padding: 40px 0px 0px`, node `1639:50449`) authored before
          this link existed. */}
      <NewClientInquiryForm
        advisor={advisor}
        className="mx-[var(--density-layout-fixed-large)] mt-[var(--density-layout-fixed-large)]"
      />
    </div>
  );
}
