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
  closeButtonClassName,
  visuallyHideTitle = false,
  showScrim = true,
  scrimClassName,
  children,
  ref,
  ...props
}: DialogContentProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  return (
    <DialogPrimitive.Portal>
      {/* Plain named `@keyframes` (defined in theme.css, not a component-
          rendered `<style>` tag here -- see that file's own comment on
          this, a real bug hit live) keyed off `data-[state]`, not
          `@starting-style`/`allow-discrete` (the native `<dialog>`/
          Popover top-layer pattern) -- Content and Overlay aren't native
          top-layer elements here, Radix's own `Presence` already handles
          the "keep it mounted for the exit animation, then unmount"
          problem for us via these elements' `data-state` attribute, so a
          plain named `animation` is Radix's own idiomatic pattern:
          Presence detects the running animation and waits for
          `animationend` before actually unmounting. `motion-safe:` omits
          the animation entirely under `prefers-reduced-motion: reduce`,
          so Presence sees no animation to wait for and unmounts
          immediately, per the same reduced-motion guidance a
          `@starting-style`-based approach would also need. */}
      {showScrim && (
        <DialogPrimitive.Overlay asChild>
          <Scrim
            className={cn(
              'z-index-overlay motion-safe:data-[state=open]:animate-[dialog-scrim-fade-in_200ms_ease-out] motion-safe:data-[state=closed]:animate-[dialog-scrim-fade-out_200ms_ease-in]',
              scrimClassName,
            )}
          />
        </DialogPrimitive.Overlay>
      )}
      {/* Content itself is the scroll container, not a separate wrapper
          around it -- confirmed live, 2026-09-23, tried a wrapper div
          approach first and reverted it: Radix's own body-scroll-lock
          (`react-remove-scroll`, wired up internally by `Dialog.Content`)
          only exempts scrolling *within Content's own subtree* from the
          lock it applies to the rest of the page. A separate `overflow-
          y-auto` ancestor wrapping Content doesn't count as "within," so
          real wheel/trackpad scroll on it was silently swallowed even
          though programmatic `scrollTop` still worked in isolation.
          `top-[padding]` (not centered, no translate) anchors Content to
          the same fixed distance from the viewport's top edge every
          time, independent of where the page triggering it happens to
          be scrolled; `max-h-[100vh-2*padding]` caps its own height
          symmetrically so it can never grow taller than the viewport
          (which is what let content get cut off at both edges with no
          way to reach either one), and its own `overflow-y-auto` scrolls
          internally once real content exceeds that cap -- exactly the
          subtree Radix's scroll-lock already allows. */}
      <DialogPrimitive.Content
        ref={ref}
        data-density={density}
        className={cn(
          'fixed inset-x-0 top-[var(--component-dialog-spacing-padding)] z-index-modal mx-auto grid w-[calc(100%-2*var(--component-dialog-spacing-padding))] max-w-[var(--component-dialog-max-width)] max-h-[calc(100vh-2*var(--component-dialog-spacing-padding))] overflow-y-auto rounded-[var(--component-dialog-border-radius)] border-[length:var(--component-dialog-border-width)] border-[color:var(--component-dialog-border-color)] bg-[var(--component-dialog-background-color)] shadow-elevation-suspended motion-safe:data-[state=open]:animate-[dialog-content-fade-in_200ms_ease-out] motion-safe:data-[state=closed]:animate-[dialog-content-fade-out_200ms_ease-in]',
          // Best-effort corner fix for a scrolled Content's own native
          // scrollbar squaring off this element's top/bottom-right corner
          // -- confirmed live (Chromium): a native scrollbar isn't clipped
          // to the border-radius of the very element it scrolls, even
          // though `overflow-y-auto` and `rounded-[...]` are the same
          // declaration above. The clean fix (an outer, non-scrolling
          // `overflow-hidden` wrapper doing the clipping instead) was tried
          // and reverted already -- see this component's own comment a few
          // lines up: Radix's body-scroll-lock only exempts scrolling
          // *within Content's own subtree*, so an outer wrapper broke real
          // wheel/trackpad scrolling.
          //
          // Legacy, non-standard `::-webkit-scrollbar-*` pseudo-elements
          // (Chromium/Safari only -- Firefox has no equivalent and simply
          // keeps its own default scrollbar here, unaffected either way)
          // are the only CSS surface that exposes `border-radius` for a
          // scrollbar at all; the standard `scrollbar-color`/`scrollbar-
          // width` properties have no such knob. `-track` is made
          // transparent rather than actually rounded-and-filled -- an
          // invisible track can't visually square off a corner regardless
          // of how well the browser clips it, which sidesteps needing
          // pixel-perfect corner-clipping from a non-standard API in the
          // first place. `-thumb` gets a full pill radius and the same
          // width/color as the DS's own `ScrollArea` component
          // (`--density-sizing-dynamic-small`, `bg-neutral-subtle`) so a
          // Dialog's native scrollbar at least matches this app's other,
          // Radix-`ScrollArea`-based custom scrollbars.
          '[&::-webkit-scrollbar]:w-[var(--density-sizing-dynamic-small)] [&::-webkit-scrollbar-track]:rounded-[var(--component-dialog-border-radius)] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-subtle',
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
        {/* `min-w-0` -- without it, this grid item's implicit auto column
            track sizes to its content's own max-content width rather than
            Content's actual (explicit) width, so any consumer content wide
            enough to want to shrink (e.g. a flex-nowrap row of cards)
            silently overflows Content's box instead of ever seeing the
            narrower available width to shrink against -- the classic CSS
            Grid "blowout" gotcha, fixed the same way flexbox's analogous
            min-width:0 fix works. No effect on any Dialog whose content
            already fits its max-width, which is every existing consumer
            today. */}
        <div className="col-start-1 row-start-1 flex min-w-0 flex-col gap-[var(--component-dialog-spacing-gap)] px-[var(--component-dialog-spacing-padding)] pb-[var(--component-dialog-spacing-padding)] pt-[var(--component-dialog-spacing-padding-top)]">
          <DialogPrimitive.Title
            className={cn(
              'text-[length:var(--component-dialog-title-font-size)] font-[number:var(--component-dialog-title-font-weight)] text-[color:var(--component-dialog-text-color)]',
              visuallyHideTitle && 'sr-only',
            )}
          >
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
              className={closeButtonClassName}
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
