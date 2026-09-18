import { Chip } from 'ds';
import { cn } from '../../utils/cn';

export interface FocusAreasPanelProps {
  focusAreas: string[];
  className?: string;
}

// Matches `FA-Card-FocusAreasSidePanel` (component set `714:20539`): a
// "Focus Areas" heading over a wrapping group of chips, one per focus
// area -- Figma models this as ~8 individually-named boolean toggles (one
// per specific focus-area string), a demo-authoring convenience, not a
// real per-category system; this maps over `focusAreas` directly instead.
// Per the user, each chip is a plain, non-dismissible DS `Chip` using its
// own default styling -- no per-category swatch colors to derive or
// maintain. Renders nothing when there's nothing to show, rather than an
// empty panel shell, so `EntityCard` never reserves a column for it.
export function FocusAreasPanel({
  focusAreas,
  className,
}: FocusAreasPanelProps) {
  if (focusAreas.length === 0) return null;

  return (
    <div
      className={cn(
        'flex flex-col gap-[var(--density-spacing-fixed-small)] rounded-[var(--semantic-surface-border-radius)] bg-[var(--color-surface-background-color-neutral-1)] p-[var(--density-spacing-fixed-large)]',
        className,
      )}
    >
      <span className="text-[length:var(--semantic-content-subheading-font-size)] leading-[length:var(--semantic-content-subheading-line-height)] font-[number:var(--semantic-content-subheading-font-weight)] text-[color:var(--semantic-content-common-text-color-default)]">
        Focus Areas
      </span>
      <div className="flex flex-wrap gap-[var(--density-spacing-fixed-small)]">
        {focusAreas.map((area) => (
          <Chip key={area}>{area}</Chip>
        ))}
      </div>
    </div>
  );
}
