import { Tag } from 'ds';
import type { NewClientStatus } from '../../data/locations';
import { statusMeta } from './statusMeta';

export interface StatusTagProps {
  status: NewClientStatus;
  size?: 'sm' | 'lg';
  className?: string;
}

// Figma's Status Tag (`204:1971`) always uses a flat neutral background
// (Tag's own `generic` variant already matches it exactly) with only the
// border color varying by status -- that doesn't line up with stretching
// `variant` itself per status (only `accepting`'s border color happens to
// equal `teal`'s; `waitlist`/`referralOnly` match no `Tag` preset at all,
// see `statusMeta`), so this keeps `variant="generic"` for the shared
// background/text styling and overrides only the border color inline.
export function StatusTag({ status, size = 'lg', className }: StatusTagProps) {
  const meta = statusMeta[status];
  return (
    <Tag.Root
      variant="generic"
      size={size}
      className={className}
      style={{ borderColor: meta.borderColorVar }}
    >
      <Tag.Label>{meta.label}</Tag.Label>
    </Tag.Root>
  );
}
