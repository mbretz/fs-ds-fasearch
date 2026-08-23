import type { ComponentProps, ReactNode } from 'react';

// No `density` or `size`/`variant` prop — Chip has a single style in Figma
// (145:3802), no variant axis at all, same as Chip's Tag-shaped siblings
// that also skip density (docs/PLAN.md §1.6, established 2026-08-19 on Tag).
export interface ChipRootProps extends ComponentProps<'span'> {
  asChild?: boolean;
}

export type ChipLabelProps = ComponentProps<'span'>;

/**
 * A bare native `<button>` — unlike CloseButton, this doesn't wrap our
 * Button component (Chip's own box is too small for Button's min-height),
 * so the full native prop surface applies as-is with no allow-list needed.
 *
 * `onClick` is the one prop worth calling out: it's the dismiss hook. The
 * flat `Chip` wrapper maps its own `onDismiss` prop onto this `onClick`
 * when composing Chip.CloseButton internally; composing Chip.CloseButton
 * directly means wiring dismissal through `onClick` instead.
 */
export type ChipCloseButtonProps = ComponentProps<'button'>;

/**
 * Convenience wrapper for the common case: a label plus an optional dismiss
 * control. Content beyond that — a leading icon, a count — is added by
 * composing Chip.Root/.Label/.CloseButton directly instead.
 */
export interface ChipProps extends ChipRootProps {
  children: ReactNode;
  /** Renders Chip.CloseButton when present; omit to render a non-dismissible chip. */
  onDismiss?: () => void;
  /** Accessible name for the dismiss button. */
  dismissLabel?: string;
}
