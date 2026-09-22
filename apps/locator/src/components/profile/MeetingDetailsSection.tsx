import type { Advisor } from '../../data/locations';
import { advisorMeetingDetails } from '../../data/advisorMeetingDetails';
import { cn } from '../../utils/cn';

export interface MeetingDetailsSectionProps {
  advisor: Advisor;
  className?: string;
}

const subheadingClassName =
  'text-[length:var(--semantic-content-subheading-font-size)] leading-[length:var(--semantic-content-subheading-line-height)] font-[number:var(--semantic-content-subheading-font-weight)] text-[color:var(--semantic-content-subheading-color)]';

// Same "Paragraph Large" style as ExperienceAndBackgroundSection's own
// Work/Education History columns -- `semantic.content.paragraphLarge`,
// hand-added to packages/tokens (see that component's own comment and
// packages/tokens/HAND_ADDED_TOKENS.md).
const paragraphClassName =
  'text-[length:var(--semantic-content-paragraph-large-font-size)] leading-[length:var(--semantic-content-paragraph-large-line-height)] font-[number:var(--semantic-content-paragraph-large-font-weight)] text-[color:var(--semantic-content-paragraph-large-color)]';

// Matches Figma's profile-page "MeetingDetails" frame (`1639:47582`): a
// light-gold card (`#FFF7D6`, an exact match for the real
// `--primitives-ref-color-gold-900` token -- no `semantic`/`color`-tier
// token shares that exact value, the closest is
// `--color-surface-background-color-gold` at `#FFFCF0`, a visibly
// different shade) holding a Heading, then a Minimum Investment /
// Meeting Availability pair (Subheading + Paragraph Large, same shape as
// ExperienceAndBackgroundSection's own Work/Education History columns).
//
// Only renders for advisors with `newClientStatus === 'accepting'`, per
// the user -- fictional per-advisor criteria live in
// advisorMeetingDetails.ts (same precedent as advisorBios.ts/
// advisorEducation.ts), keyed only for accepting advisors, so a missing
// entry here also renders nothing rather than throwing.
export function MeetingDetailsSection({
  advisor,
  className,
}: MeetingDetailsSectionProps) {
  if (advisor.newClientStatus !== 'accepting') return null;

  const details = advisorMeetingDetails[advisor.id];
  if (!details) return null;

  return (
    <div
      className={cn(
        'flex flex-col gap-[var(--density-layout-fixed-xx-large)] rounded-[var(--semantic-surface-border-radius)] bg-[color:var(--primitives-ref-color-gold-900)] px-[var(--density-layout-fixed-4x-large)] py-[var(--density-layout-fixed-xx-large)]',
        className,
      )}
    >
      <span className="text-[length:var(--semantic-content-heading-font-size)] leading-[length:var(--semantic-content-heading-line-height)] font-[number:var(--semantic-content-heading-font-weight)] text-[color:var(--semantic-content-heading-color)]">
        Meeting Details
      </span>
      <div className="flex flex-wrap gap-x-[var(--density-layout-fixed-6x-large)] gap-y-[var(--density-layout-fixed-large)]">
        <div className="flex flex-col">
          <span className={subheadingClassName}>Minimum Investment</span>
          <span className={paragraphClassName}>
            {details.minimumInvestment}
          </span>
        </div>
        <div className="flex flex-col">
          <span className={subheadingClassName}>Meeting Availability</span>
          <span className={paragraphClassName}>
            {details.meetingAvailability.join(', ')}
          </span>
        </div>
      </div>
    </div>
  );
}
