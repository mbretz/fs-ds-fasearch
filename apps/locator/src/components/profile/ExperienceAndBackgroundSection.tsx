import { Link } from 'ds';
import type { Advisor } from '../../data/locations';
import { advisorEducation } from '../../data/advisorEducation';
import { getTenureStartLabel } from '../../utils/getTenureStartLabel';
import IconExperience from '../../assets/profile-icons/IconExperience';
import { cn } from '../../utils/cn';

export interface ExperienceAndBackgroundSectionProps {
  advisor: Advisor;
  className?: string;
}

// Neither a real <a> nor DS `Link` has a native `disabled` attribute --
// same inert treatment (href="#"/aria-disabled/tabIndex -1/preventDefault)
// as every other not-really-wired-up destination in this app (see
// AdvisorHero.tsx's own `preventDisabledClick`), per the user's explicit
// "make the link inactive" ask for the BrokerCheck disclosure below.
function preventDisabledClick(event: { preventDefault: () => void }) {
  event.preventDefault();
}

const subheadingClassName =
  'text-[length:var(--semantic-content-subheading-font-size)] leading-[length:var(--semantic-content-subheading-line-height)] font-[number:var(--semantic-content-subheading-font-weight)] text-[color:var(--semantic-content-subheading-color)]';

// Figma's "Paragraph Large" text style (18px/36px/400) had no matching
// token in packages/tokens as of this component's first build -- hand-
// added as `semantic.content.paragraphLarge` (source/tokens.json) per the
// user, since neither value exists anywhere in the `ref.font.size`/
// `ref.font.lineHeight` primitive ramps either (size ramp jumps 20->16,
// lineHeight ramp jumps 30->45 -- no 18px/36px step in the correct
// dimension for either). See packages/tokens/HAND_ADDED_TOKENS.md.
const paragraphClassName =
  'text-[length:var(--semantic-content-paragraph-large-font-size)] leading-[length:var(--semantic-content-paragraph-large-line-height)] font-[number:var(--semantic-content-paragraph-large-font-weight)] text-[color:var(--semantic-content-paragraph-large-color)]';

// Matches Figma's profile-page "Experience" frame (`1446:52145`,
// "Experience & Background" heading -- same 44px circle-icon + Heading
// treatment as FocusAreasSection, per the user). Combines what were
// previously two separate compact meta rows (Experience/Education) into
// one Work History / Education History pair. Reuses `IconExperience`
// (not `IconEducation` -- kept staged in ../../assets/profile-icons for
// whenever it's actually needed elsewhere, per the user) since this
// frame's own icon instance (Figma's separate "Icon" component set,
// `1:2390`) renders the same briefcase artwork already extracted there.
//
// Education is fictional per-advisor data (advisorEducation.ts, same
// precedent as advisorBios.ts) -- no real Figma/backend source. The work-
// history date range's start month has no real data field either; per
// the user, `getTenureStartLabel` derives a stable one from the advisor's
// own id instead.
export function ExperienceAndBackgroundSection({
  advisor,
  className,
}: ExperienceAndBackgroundSectionProps) {
  const education = advisorEducation[advisor.id];

  return (
    <div
      className={cn(
        'flex flex-col gap-[var(--density-layout-fixed-xx-large)]',
        className,
      )}
    >
      <div className="flex items-start gap-[var(--density-spacing-fixed-small)]">
        <span
          aria-hidden="true"
          className="mt-[calc((var(--semantic-content-heading-line-height)_-_44px)/2)] flex size-[44px] shrink-0 items-center justify-center rounded-full bg-[color:var(--semantic-brand-secondary-light-gold)]"
        >
          <IconExperience
            aria-hidden="true"
            className="h-[24px] w-auto text-[color:var(--semantic-content-common-text-color-default)]"
          />
        </span>
        <span className="text-[length:var(--semantic-content-heading-font-size)] leading-[length:var(--semantic-content-heading-line-height)] font-[number:var(--semantic-content-heading-font-weight)] text-[color:var(--semantic-content-heading-color)]">
          Experience & Background
        </span>
      </div>
      <div className="flex flex-wrap gap-x-[var(--density-layout-fixed-6x-large)] gap-y-[var(--density-layout-fixed-large)]">
        <div className="flex flex-col">
          <span className={subheadingClassName}>Work History</span>
          <span className={paragraphClassName}>Edward Jones</span>
          <span className={paragraphClassName}>
            {getTenureStartLabel(advisor)}
          </span>
        </div>
        {education && (
          <div className="flex flex-col">
            <span className={subheadingClassName}>Education History</span>
            <span className={paragraphClassName}>{education.school}</span>
            <span className={paragraphClassName}>{education.degree}</span>
          </div>
        )}
      </div>
      <p className={paragraphClassName}>
        Check the background of this investment professional on{' '}
        <Link
          href="#"
          aria-disabled="true"
          tabIndex={-1}
          onClick={preventDisabledClick}
          className="cursor-not-allowed"
        >
          FINRA's BrokerCheck
        </Link>
        .
      </p>
    </div>
  );
}
