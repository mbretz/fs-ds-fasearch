import type { ReactNode } from 'react';
import { Button } from 'ds';
import { cn } from '../../utils/cn';

export interface EntityActionsProps {
  primaryLabel: string;
  primaryIcon?: ReactNode;
  /**
   * A `tel:`/`mailto:`/route href for the primary action. When set, the
   * primary action renders as a real link styled like a Button (the
   * compound `Button.Root`/`.Icon`/`.Label` `asChild` API -- see
   * `Button.stories.tsx`'s "Compound" story) instead of the flat `Button`
   * convenience component, since e.g. a phone number is navigation
   * (`tel:...`), not a click handler with nothing to actually call.
   * Takes precedence over `onPrimaryAction` when both are passed.
   */
  primaryHref?: string;
  onPrimaryAction?: () => void;
  /**
   * Renders the secondary "New Client Inquiry" button when provided --
   * identical label/behavior in both confirmed usages (AdvisorCard's
   * `.FA-Card-Actions` and the profile-page Hero's own "Actions" row),
   * gated by Figma's "Show New Client Inquiry"/"Show Inquiry Button"
   * property in each, so this is modeled as "was a handler passed in"
   * rather than a separate boolean prop.
   */
  onNewClientInquiry?: () => void;
  /** Matches Figma's Inline/Block orientation variants. */
  orientation?: 'inline' | 'block';
  className?: string;
}

// Matches `.FA-Card-Actions` (`1351:34797`) *and* the profile-page Hero's
// own "Actions" row (`421:6266`, the Hero-FA-Mobile reference) -- the same
// primary+secondary button shape reused in both places. The Hero swaps
// the card's plain "View Profile" primary button for a phone-icon
// "Call <number>" button while keeping "New Client Inquiry" identical, so
// the primary button's content is a prop here, not a hardcoded label --
// each caller supplies whatever action fits its own context.
export function EntityActions({
  primaryLabel,
  primaryIcon,
  primaryHref,
  onPrimaryAction,
  onNewClientInquiry,
  orientation = 'inline',
  className,
}: EntityActionsProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-center gap-[var(--density-spacing-fixed-large)]',
        orientation === 'block' && 'flex-col items-stretch',
        className,
      )}
    >
      {primaryHref ? (
        <Button.Root variant="primary" asChild>
          <a href={primaryHref}>
            {primaryIcon && <Button.Icon>{primaryIcon}</Button.Icon>}
            <Button.Label>{primaryLabel}</Button.Label>
          </a>
        </Button.Root>
      ) : (
        <Button
          variant="primary"
          iconStart={primaryIcon}
          onClick={onPrimaryAction}
        >
          {primaryLabel}
        </Button>
      )}
      {onNewClientInquiry && (
        <Button variant="secondary" onClick={onNewClientInquiry}>
          New Client Inquiry
        </Button>
      )}
    </div>
  );
}
