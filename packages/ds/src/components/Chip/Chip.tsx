import { Slot } from 'radix-ui';
import { CloseSm } from 'icons';
import { cn } from '../../utils/cn';
import type {
  ChipRootProps,
  ChipLabelProps,
  ChipCloseButtonProps,
  ChipProps,
} from './Chip.types';

function ChipRoot({ className, asChild, ref, ...props }: ChipRootProps) {
  const Comp = asChild ? Slot.Root : 'span';
  return (
    <Comp
      ref={ref}
      className={cn(
        'inline-flex w-fit shrink-0 items-center gap-[var(--component-chip-gap)] rounded-[var(--component-chip-border-radius)] border-[length:var(--component-chip-border-width)] border-[color:var(--component-chip-border-color)] bg-[var(--component-chip-background-color)] px-[var(--component-chip-padding-inline)] py-[var(--component-chip-padding-block)] text-[length:var(--component-chip-font-size)] leading-[length:var(--component-chip-line-height)] font-[number:var(--component-chip-font-weight)] text-[color:var(--component-chip-text-color)]',
        className,
      )}
      {...props}
    />
  );
}
ChipRoot.displayName = 'Chip.Root';

function ChipLabel({ className, ref, ...props }: ChipLabelProps) {
  return <span ref={ref} className={cn('min-w-0', className)} {...props} />;
}
ChipLabel.displayName = 'Chip.Label';

// Bare button, not a CloseButton reuse — CloseButton wraps a full tertiary
// Button sized for a standalone control (min-height ~40-44px), which would
// overflow Chip's own tiny box (2px block padding, 24px line-height).
function ChipCloseButton({ className, ref, ...props }: ChipCloseButtonProps) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-[var(--component-chip-border-radius)] text-[color:var(--component-chip-text-color)] hover:opacity-70 focus-visible:shadow-[inset_0_0_0_var(--semantic-control-border-width-active)_var(--component-chip-text-color)]',
        className,
      )}
      {...props}
    >
      <CloseSm className="size-[var(--component-chip-close-icon-size)]" />
    </button>
  );
}
ChipCloseButton.displayName = 'Chip.CloseButton';

function Chip({
  children,
  onDismiss,
  dismissLabel = 'Remove',
  ...props
}: ChipProps) {
  return (
    <ChipRoot {...props}>
      <ChipLabel>{children}</ChipLabel>
      {onDismiss && (
        <ChipCloseButton aria-label={dismissLabel} onClick={onDismiss} />
      )}
    </ChipRoot>
  );
}
Chip.displayName = 'Chip';
Chip.Root = ChipRoot;
Chip.Label = ChipLabel;
Chip.CloseButton = ChipCloseButton;

export { Chip };
