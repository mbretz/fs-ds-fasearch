import type { Advisor } from '../../data/locations';
import { cn } from '../../utils/cn';

export interface AboutMeSectionProps {
  advisor: Advisor;
  bio?: string;
  className?: string;
}

// "Paragraph Large" per the user -- `semantic.content.paragraphLarge`,
// hand-added to packages/tokens (18px/36px/400, see
// ExperienceAndBackgroundSection's own comment and
// packages/tokens/HAND_ADDED_TOKENS.md).
const bioTextClassName =
  'text-[length:var(--semantic-content-paragraph-large-font-size)] leading-[length:var(--semantic-content-paragraph-large-line-height)] font-[number:var(--semantic-content-paragraph-large-font-weight)] text-[color:var(--semantic-content-paragraph-large-color)]';

// Same Heading treatment as FocusAreasSection/ExperienceAndBackgroundSection
// (`--semantic-content-heading-*`), minus their 44px circle icon -- per the
// user, "About me" has no icon. No Figma frame for this section exists;
// composition (24px heading-to-bio gap, Personal Interests nested inside
// as its own Subheading + comma-delimited Heavy-style list) is per the
// user's own direction, not a Figma-matched spec.
export function AboutMeSection({
  advisor,
  bio,
  className,
}: AboutMeSectionProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-[var(--density-layout-fixed-xx-large)]',
        className,
      )}
    >
      <span className="text-[length:var(--semantic-content-heading-font-size)] leading-[length:var(--semantic-content-heading-line-height)] font-[number:var(--semantic-content-heading-font-weight)] text-[color:var(--semantic-content-heading-color)]">
        About Me
      </span>
      {bio && <p className={bioTextClassName}>{bio}</p>}
      {advisor.personalInterests.length > 0 && (
        <div className="flex flex-col gap-[var(--density-spacing-fixed-x-small)]">
          <span className="text-[length:var(--semantic-content-subheading-font-size)] leading-[length:var(--semantic-content-subheading-line-height)] font-[number:var(--semantic-content-subheading-font-weight)] text-[color:var(--semantic-content-subheading-color)]">
            Personal Interests
          </span>
          <span className="text-[length:var(--semantic-content-heavy-font-size)] leading-[length:var(--semantic-content-heavy-line-height)] font-[number:var(--semantic-content-heavy-font-weight)] text-[color:var(--semantic-content-common-text-color-default)]">
            {advisor.personalInterests.join(', ')}
          </span>
        </div>
      )}
    </div>
  );
}
