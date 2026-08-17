import type { ComponentProps } from 'react';

// Icon vertical-align is baked in (align-middle) — no override, unlike
// Link's trailing icon (which does need one, since it sits at the end of
// variable-length wrapped text rather than fixed at the start).
export interface LinkHelpProps extends ComponentProps<'a'> {
  asChild?: boolean;
}
