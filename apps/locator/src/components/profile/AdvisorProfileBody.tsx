import type { Advisor } from '../../data/locations';
import { advisorBios } from '../../data/advisorBios';
import { cn } from '../../utils/cn';
import { FocusAreasSection } from './FocusAreasSection';
import { ExperienceAndBackgroundSection } from './ExperienceAndBackgroundSection';
import { AboutMeSection } from './AboutMeSection';
import { MeetingDetailsSection } from './MeetingDetailsSection';

export interface AdvisorProfileBodyProps {
  advisor: Advisor;
  className?: string;
}

// Single vertical sequence -- Focus Areas, Experience & Background, About
// Me (bio + Personal Interests), Meeting Details, per the user. Experience
// and Education (formerly two separate compact meta rows) are one merged
// "Experience & Background" section -- see ExperienceAndBackgroundSection's
// own comment. Bio and Personal Interests (formerly their own separate
// blocks) are now nested inside one "About Me" section -- see
// AboutMeSection's own comment. Bio comes from advisorBios.ts, keyed by
// id -- some fixture advisors don't have one, so AboutMeSection renders no
// bio paragraph when missing (the Personal Interests block below it is
// unaffected). Meeting Details (last -- a practical "ready to book" block
// reads naturally as the closing section, no Figma composition dictates
// this ordering) renders nothing at all for advisors who aren't accepting
// new clients -- see MeetingDetailsSection's own comment.
export function AdvisorProfileBody({
  advisor,
  className,
}: AdvisorProfileBodyProps) {
  const bio = advisorBios[advisor.id];

  return (
    <div
      className={cn(
        // 48px between each subsection (Focus Areas, Experience &
        // Background, About Me), per the user -- not the smaller
        // `fixed-large` (16px) gap used *within* a subsection (e.g.
        // FocusAreasSection's own heading-to-chips spacing).
        'flex flex-col gap-[var(--density-layout-fixed-6x-large)]',
        className,
      )}
    >
      <FocusAreasSection focusAreas={advisor.focusAreas} />
      <ExperienceAndBackgroundSection advisor={advisor} />
      <AboutMeSection advisor={advisor} bio={bio} />
      <MeetingDetailsSection advisor={advisor} />
    </div>
  );
}
