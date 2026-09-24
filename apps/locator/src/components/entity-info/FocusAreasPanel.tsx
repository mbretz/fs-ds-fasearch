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
//
// The "Focus Areas" heading uses the same nanoheading/uppercase tokens as
// OfficeDetailsPanel's own sub-headings ("Phone"/"Office Hours"/etc, not
// that panel's larger "Office Information" title) and
// AdvisorsAtLocationPanel's "Branch Advisors"/"Branch Team", per the user.
export function FocusAreasPanel({
  focusAreas,
  className,
}: FocusAreasPanelProps) {
  if (focusAreas.length === 0) return null;

  return (
    <div
      className={cn(
        'flex h-full min-w-0 flex-col gap-[var(--density-spacing-fixed-small)] rounded-[var(--semantic-surface-border-radius)] bg-[var(--color-surface-background-color-neutral-1)] p-[var(--density-spacing-fixed-large)]',
        className,
      )}
    >
      <span className="uppercase text-[length:var(--semantic-content-nanoheading-font-size)] leading-[length:var(--semantic-content-nanoheading-line-height)] font-[number:var(--semantic-content-nanoheading-font-weight)] text-[color:var(--semantic-content-common-text-color-default)]">
        Focus Areas
      </span>
      {/* `min-w-0` -- without it, this flex-wrap row's own auto min-content
          contribution (used when it's stretched to fill its ancestor
          chain's width) is computed from its UNWRAPPED total chip width
          rather than its widest single chip, so at a narrow enough card
          width the row stops actually wrapping and spills its later chips
          past the card's edge instead -- confirmed live down to
          FavoriteCard's 220px floor. Same class of missing-min-width:0
          bug as Dialog.tsx's grid item and Card.Root's own default
          min-width (see both their own comments). */}
      <div className="flex min-w-0 flex-wrap gap-[var(--density-spacing-fixed-small)]">
        {focusAreas.map((area) => (
          <Chip key={area}>{area}</Chip>
        ))}
      </div>
    </div>
  );
}
