import IconBriefcase from '../../assets/icons/IconBriefcase';
import { cn } from '../../utils/cn';

export interface TenureLineProps {
  years: number;
  className?: string;
}

// Figma pairs this with an "icon-briefcase" glyph -- packages/icons has no
// equivalent, so this uses the locator-local stand-in (see
// src/assets/icons/README.md) rather than a mismatched generic icon or
// going text-only.
export function TenureLine({ years, className }: TenureLineProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[var(--density-spacing-fixed-x-small)] text-[length:var(--semantic-content-common-font-size)] leading-[length:var(--semantic-content-common-line-height)] font-[number:var(--semantic-content-common-font-weight)] text-[color:var(--semantic-content-common-text-color-default)]',
        className,
      )}
    >
      <IconBriefcase
        aria-hidden="true"
        className="size-[var(--density-sizing-fixed-large)] shrink-0"
      />
      {years} {years === 1 ? 'year' : 'years'} at Edward Jones
    </span>
  );
}
