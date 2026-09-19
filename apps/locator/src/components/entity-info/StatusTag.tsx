import { Tag } from 'ds';
import type { NewClientStatus } from '../../data/locations';
import { statusMeta } from './statusMeta';
import { Badge } from './Badge';

export interface StatusTagProps {
  status: NewClientStatus;
  size?: 'sm' | 'lg';
  /**
   * Matches Figma's own per-size default (`Show Slot Start: true` on
   * Large, `false` on Small) when left unset, but overridable either way
   * -- a caller can opt into the badge on `sm` or drop it from `lg`.
   */
  showBadge?: boolean;
  className?: string;
}

// Figma's Status Tag (`204:1971`) always uses a flat neutral background
// (Tag's own `generic` variant already matches it exactly) with only the
// border color varying by status -- that doesn't line up with stretching
// `variant` itself per status (only `accepting`'s border color happens to
// equal `teal`'s; `waitlist`/`referralOnly` match no `Tag` preset at all,
// see `statusMeta`), so this keeps `variant="generic"` for the shared
// background/text styling and overrides only the border color inline.
//
// The Large variant's own Tag instance has `Show Slot Start: true`
// (an inverse-mode `Badge`, the same component set `EntityPortrait`'s
// avatar corner badge uses); Small has `Show Slot Start: false` -- no
// badge there, confirmed against the live component set.
export function StatusTag({
  status,
  size = 'lg',
  showBadge,
  className,
}: StatusTagProps) {
  const meta = statusMeta[status];
  const displayBadge = showBadge ?? size === 'lg';
  return (
    <Tag.Root
      variant="generic"
      size={size}
      className={className}
      style={{ borderColor: meta.borderColorVar }}
    >
      {displayBadge && (
        <Badge
          icon={meta.icon}
          colorVar={meta.borderColorVar}
          mode="inverse"
          className="size-[var(--density-sizing-fixed-xx-large)]"
        />
      )}
      <Tag.Label>{meta.label}</Tag.Label>
    </Tag.Root>
  );
}
