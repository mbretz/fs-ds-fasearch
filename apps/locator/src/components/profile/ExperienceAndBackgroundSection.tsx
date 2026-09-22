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

// `mb-0 md:mb-[4px]` -- the 4px breathing room between "Work History"/
// "Education History" and their own value lines below (added once those
// value lines got tighter, see their own `leading-[24px]` comment) reads
// as too much on mobile once the mobile-specific spacing below was tuned
// against the real Figma frame -- per the user, 2026-09-22, mobile drops
// it back to 0 while desktop keeps the original 4px.
const subheadingClassName =
  'mb-0 text-[length:var(--semantic-content-subheading-font-size)] leading-[length:var(--semantic-content-subheading-line-height)] font-[number:var(--semantic-content-subheading-font-weight)] text-[color:var(--semantic-content-subheading-color)] md:mb-[4px]';

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
        // 8px below `md`, 24px at `md`+ -- per the mobile "Experience"
        // frame (`1445:51649`), whose root frame's own `gap: 8px` governs
        // BOTH the icon+heading-row-to-Entries gap AND the Entries-to-
        // BrokerCheck gap below, tighter than the desktop frame's
        // (`1446:52145`) already-built 24px rhythm. Confirmed live,
        // 2026-09-22.
        'flex flex-col gap-[var(--density-layout-fixed-small)] md:gap-[var(--density-layout-fixed-xx-large)]',
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
      {/* `leading-[24px]` overrides `paragraphClassName`'s own 36px line-
          height on every value line here -- per the user, 2026-09-22,
          these paired lines (org/date, school/degree) read tighter at
          24px than the "Paragraph Large" style's own default, which was
          sized for a single-line paragraph, not a stacked pair. The
          BrokerCheck disclosure paragraph below gets the same 24px
          override now too (added later the same session). */}
      {/* `gap-y-[fixed-small]` (8px) below `md` -- the mobile frame's two
          entry groups (`1445:51649`) literally stack with zero gap
          between them, but per the user that read as too cramped once
          built, so a small 8px gap was added back (not a literal Figma
          match). `md:gap-y-[...]` keeps the existing 16px gap once
          they're side by side instead of stacked. `gap-x` is unchanged --
          it only applies once both groups fit on one row, which doesn't
          happen below `md` regardless of its value. */}
      {/* `pl-[52px] md:pl-0` -- per the user, every line below the heading
          row (Work History/Education History AND the BrokerCheck
          paragraph) aligns to the same left edge as the HEADING TEXT
          above them, not the icon. 52px, not the mobile Figma frame's own
          literal 40px -- that frame's icon is a smaller ~33px (see its
          own "Icon" node), while this component keeps the same 44px icon
          at every width (matching FocusAreasSection's own established
          convention, per the user); 52px is 44px icon + 8px gap, i.e. the
          real heading-text start for THIS icon size, confirmed live
          (Playwright) against the actual rendered heading position.
          Desktop's own frame keeps Work History/Education History/
          BrokerCheck flush with the icon instead, so this indent is
          mobile-only. */}
      <div className="flex flex-wrap gap-x-[var(--density-layout-fixed-6x-large)] gap-y-[var(--density-layout-fixed-small)] pl-[52px] md:gap-y-[var(--density-layout-fixed-large)] md:pl-0">
        <div className="flex flex-col">
          <span className={subheadingClassName}>Work History</span>
          <span className={cn(paragraphClassName, 'leading-[24px]')}>
            Edward Jones
          </span>
          <span className={cn(paragraphClassName, 'leading-[24px]')}>
            {getTenureStartLabel(advisor)}
          </span>
        </div>
        {education && (
          <div className="flex flex-col">
            <span className={subheadingClassName}>Education History</span>
            <span className={cn(paragraphClassName, 'leading-[24px]')}>
              {education.school}
            </span>
            <span className={cn(paragraphClassName, 'leading-[24px]')}>
              {education.degree}
            </span>
          </div>
        )}
      </div>
      {/* `mt-[var(--density-layout-fixed-large)] md:mt-0` -- extra 16px on
          top of the outer wrapper's own 8px flex gap (see that gap's own
          comment), widening the Entries-to-BrokerCheck gap to 24px on
          mobile specifically, per the user, 2026-09-22 -- reads as too
          tight otherwise once the entry groups themselves got the
          spacing trims above. Desktop's own gap (already 24px, from the
          wrapper's `md:gap-[...]` alone) is unaffected -- `md:mt-0` drops
          this extra margin there instead of stacking on top of it. */}
      <p
        className={cn(
          paragraphClassName,
          'pl-[52px] leading-[24px] mt-[var(--density-layout-fixed-large)] md:mt-0 md:pl-0',
        )}
      >
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
