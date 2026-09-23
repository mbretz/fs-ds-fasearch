import type { NewClientStatus } from '../../data/locations';
import { statusMeta } from './statusMeta';
import { Badge } from './Badge';
import { cn } from '../../utils/cn';

export interface StatusLockupProps {
  status: NewClientStatus;
  className?: string;
}

// Matches Figma's `Status` component set (`203:3757`) -- a discrete
// presentation for the same 3 `NewClientStatus` states `StatusTag`
// already covers, but a bare icon+label row with no Tag pill/border
// around it (no `fills`/`strokes` on the component frame itself, per
// the fetched node data). Built from the same `Badge`/`statusMeta`
// building blocks as `StatusTag`/`EntityPortrait`, not a new lookup of
// its own, so all three stay in sync automatically.
//
// The 32px badge is Figma's own `Status Lockup` sub-component (`1:503`,
// `Size=default`) — a real fixed dimension on that component's frame,
// not scaled off anything. `mode="default"` (white circle, status-color
// stroke+icon) matches each status instance's own `Badge` child
// (`type=<status>, mode=default`) exactly -- unlike `StatusTag`'s Large
// badge, this one is never `inverse`.
//
// Label typography is Figma's `Status Label` text style: Semibold/16px/
// 24px line-height -- an exact match for the existing
// `semantic-content-heavy-*` token trio (`BranchTeamMemberRow` already
// uses that same `-font-weight` token, mixed with different size/
// line-height tokens for its own text; this is the first consumer of
// all three together), not a new hand-added token.
export function StatusLockup({ status, className }: StatusLockupProps) {
  const meta = statusMeta[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[var(--density-spacing-fixed-small)]',
        className,
      )}
    >
      <Badge
        icon={meta.icon}
        colorVar={meta.borderColorVar}
        mode="default"
        className="size-[32px]"
      />
      <span className="text-[length:var(--semantic-content-heavy-font-size)] leading-[length:var(--semantic-content-heavy-line-height)] font-[number:var(--semantic-content-heavy-font-weight)] text-[color:var(--semantic-content-common-text-color-default)]">
        {meta.label}
      </span>
    </span>
  );
}
