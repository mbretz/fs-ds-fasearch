import { useRef } from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { cn } from '../../utils/cn';
import { CloseButton } from '../CloseButton/CloseButton';
import { Scrim } from '../Scrim/Scrim';
import { Separator } from '../Separator/Separator';
import type {
  DialogRootProps,
  DialogTriggerProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogBodyProps,
  DialogFooterProps,
  DialogCloseProps,
} from './Dialog.types';

function DialogRoot({ children, ...props }: DialogRootProps) {
  return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>;
}
DialogRoot.displayName = 'Dialog.Root';

function DialogTrigger({ ref, ...props }: DialogTriggerProps) {
  return <DialogPrimitive.Trigger ref={ref} {...props} />;
}
DialogTrigger.displayName = 'Dialog.Trigger';

// Content owns its own Portal (SelectInput.Content's pattern, not Card's
// plain-wrapper style) since Dialog is genuinely portal-rendered. Renders
// the close-button row above the title rather than overlapping it per
// Figma's absolute positioning — confirmed with the user, no new
// position-offset tokens needed.
function DialogContent({
  className,
  title,
  description,
  // Defaults to 'roomy' (the DS-wide default density, docs/PLAN.md §1.4) —
  // Content is portal-rendered to document.body, escaping any ancestor
  // data-density wrapper (e.g. Storybook's per-story decorator), so without
  // a concrete fallback here every density-scoped CSS var (padding, gaps,
  // even nested Button's own padding) silently fails to resolve.
  density = 'roomy',
  closeButtonAriaLabel,
  showScrim = true,
  scrimClassName,
  children,
  ref,
  ...props
}: DialogContentProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  return (
    <DialogPrimitive.Portal>
      {showScrim && (
        <DialogPrimitive.Overlay asChild>
          <Scrim className={cn('z-index-overlay', scrimClassName)} />
        </DialogPrimitive.Overlay>
      )}
      <DialogPrimitive.Content
        ref={ref}
        data-density={density}
        className={cn(
          'fixed left-1/2 top-1/2 z-index-modal grid w-full max-w-[var(--component-dialog-max-width)] -translate-x-1/2 -translate-y-1/2 rounded-[var(--component-dialog-border-radius)] border-[length:var(--component-dialog-border-width)] border-[color:var(--component-dialog-border-color)] bg-[var(--component-dialog-background-color)] shadow-elevation-suspended',
          className,
        )}
        // Default (per user direction, 2026-08-21): focus the close button on
        // open rather than Radix's own default of focusing Content itself.
        // Placed before {...props} so a consumer-supplied onOpenAutoFocus
        // overrides it.
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          closeButtonRef.current?.focus();
        }}
        {...props}
      >
        {/* Both children share one grid cell (explicit col/row-start-1) so
            the close button overlays the padded content instead of pushing
            it down — no negative margins needed, since each piece just
            defines its own inset from Content's edge independently. The
            close button's wrapper has no padding of its own, so it sits
            flush at the true top-right corner, "outside" the content's own
            padding. pt uses a dedicated, density-invariant token (32px both
            densities, matching Figma's literal "32px 12px 12px" spec) sized
            to clear the always-condensed close button, not a calc against
            the reactive base padding + ambient button height. */}
        <div className="col-start-1 row-start-1 flex flex-col gap-[var(--component-dialog-spacing-gap)] px-[var(--component-dialog-spacing-padding)] pb-[var(--component-dialog-spacing-padding)] pt-[var(--component-dialog-spacing-padding-top)]">
          <DialogPrimitive.Title className="text-[length:var(--component-dialog-title-font-size)] font-[number:var(--component-dialog-title-font-weight)] text-[color:var(--component-dialog-text-color)]">
            {title}
          </DialogPrimitive.Title>
          {description && (
            <DialogPrimitive.Description className="text-[length:var(--component-dialog-description-font-size)] font-[number:var(--component-dialog-description-font-weight)] text-[color:var(--component-dialog-text-color)]">
              {description}
            </DialogPrimitive.Description>
          )}
          {children}
        </div>
        <div className="col-start-1 row-start-1 flex justify-self-end self-start">
          <DialogPrimitive.Close asChild>
            <CloseButton
              ref={closeButtonRef}
              density="condensed"
              aria-label={closeButtonAriaLabel}
            />
          </DialogPrimitive.Close>
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
DialogContent.displayName = 'Dialog.Content';

function DialogHeader({
  className,
  children,
  ref,
  ...props
}: DialogHeaderProps) {
  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-[var(--component-dialog-header-gap)] p-[var(--component-dialog-header-padding)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
DialogHeader.displayName = 'Dialog.Header';

function DialogBody({ className, children, ref, ...props }: DialogBodyProps) {
  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-[var(--component-dialog-body-gap)] p-[var(--component-dialog-body-padding)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
DialogBody.displayName = 'Dialog.Body';

// Row layout, not Card.Footer's column — Figma's footer slot is genuinely
// mode: row, holding side-by-side action buttons. Renders the real
// Separator component directly above itself, replacing the originally
// planned hardcoded gradient.
function DialogFooter({
  className,
  children,
  ref,
  ...props
}: DialogFooterProps) {
  return (
    <>
      <Separator orientation="horizontal" />
      <div
        ref={ref}
        className={cn(
          'flex flex-row items-center gap-[var(--component-dialog-footer-gap)] p-[var(--component-dialog-footer-padding)]',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </>
  );
}
DialogFooter.displayName = 'Dialog.Footer';

function DialogClose({ ref, ...props }: DialogCloseProps) {
  return <DialogPrimitive.Close ref={ref} {...props} />;
}
DialogClose.displayName = 'Dialog.Close';

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Content: DialogContent,
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
  Close: DialogClose,
};
