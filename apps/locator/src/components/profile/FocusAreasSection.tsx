import { Chip } from 'ds';
import IconFocusAreas from '../../assets/profile-icons/IconFocusAreas';
import { cn } from '../../utils/cn';

export interface FocusAreasSectionProps {
  focusAreas: string[];
  className?: string;
}

// Matches Figma's profile-page "Focus Areas" frame (`1639:47543`): a
// 44px circle icon + "Heading"-style text row, then a wrapping group of
// non-dismissible Chips, one per focus area. Reuses `IconFocusAreas`
// (../../assets/profile-icons -- see that directory's README) rather than
// re-extracting the glyph from Figma's separate "Icon" component set
// (`1:2389`) that frame's own icon instance belongs to -- the two render
// the same list+magnifying-glass artwork, just with (`1:2389`) vs without
// (`1:741`, what this app already has) a circle baked into the export, so
// the circle here is built as a real background instead of a second
// duplicate icon asset.
//
// `items-start`, not `items-center` -- per the user, once the heading
// wraps to a second line the icon should stay centered against the
// FIRST line only, not re-center against the whole now-taller block
// (which is what plain `items-center` does: it centers the icon within
// the row's full height, sliding it down as more lines are added). The
// icon's own `mt` then nudges it down from that top-aligned start by
// half the gap between the heading's line-height (45px) and the icon's
// own fixed 44px size, landing its center on the first line's own
// line-box center regardless of how many lines follow.
export function FocusAreasSection({
  focusAreas,
  className,
}: FocusAreasSectionProps) {
  if (focusAreas.length === 0) return null;

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
          <IconFocusAreas
            aria-hidden="true"
            className="h-[24px] w-auto text-[color:var(--semantic-content-common-text-color-default)]"
          />
        </span>
        <span className="text-[length:var(--semantic-content-heading-font-size)] leading-[length:var(--semantic-content-heading-line-height)] font-[number:var(--semantic-content-heading-font-weight)] text-[color:var(--semantic-content-heading-color)]">
          Focus Areas
        </span>
      </div>
      <div className="flex flex-wrap gap-[var(--density-spacing-fixed-med)]">
        {focusAreas.map((area) => (
          <Chip key={area}>{area}</Chip>
        ))}
      </div>
    </div>
  );
}
