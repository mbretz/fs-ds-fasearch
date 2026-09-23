import { Navigate, useParams } from 'react-router-dom';
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
      {/* 40px, not the app's usual 16px inter-section gap -- matches
          Figma's own `Main Content` frame (`padding: 40px 0px 0px`,
          node `1639:50449`), the space it reserves between this Hero
          and the Contact Form starting right under it. */}
      <NewClientInquiryForm
        advisor={advisor}
        className="mx-[var(--density-layout-fixed-large)] mt-[var(--density-layout-fixed-4x-large)]"
      />
    </div>
  );
}
