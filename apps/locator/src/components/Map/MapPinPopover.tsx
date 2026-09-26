import { useRef, type ReactNode } from 'react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { lightRoomyTokens } from 'tokens';
import { cn } from '../../utils/cn';

// Popper's `sideOffset` takes a plain number, not a CSS var -- same
// `lightRoomyTokens` JS-token read as FilterMenu's/SearchInput's/
// ProspectPortalLite's own Popover Content.
const CONTENT_SIDE_OFFSET = lightRoomyTokens.densitySpacingFixedXSmall;

export interface MapPinPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Live screen position of the pin this popover anchors to -- read via
   * Radix Popper's `virtualRef` (a `{ getBoundingClientRect() }` shape,
   * not a real DOM element), since a MapLibre marker is a plain
   * imperatively-created div, not something a declarative `Popover.
   * Trigger`/`Anchor asChild` can wrap. No DS `Popover` export exists yet
   * (see this repo's Map build plan) -- built directly on
   * `PopoverPrimitive`, same as `FilterMenu`/`ProspectPortalLite`. */
  getAnchorRect: () => DOMRect;
  /** The map surface's own outer element -- passed straight through as
   * Popper's `collisionBoundary` so the popover flips/shifts to stay
   * fully inside the visible map, not just the viewport (its default
   * boundary, which let it overhang the map's own edges/rounded corners
   * whenever a pin sat near them). */
  collisionBoundary: Element | null;
  children: ReactNode;
}

export function MapPinPopover({
  open,
  onOpenChange,
  getAnchorRect,
  collisionBoundary,
  children,
}: MapPinPopoverProps) {
  // A stable ref object whose `getBoundingClientRect` always calls
  // through to the latest `getAnchorRect` -- Radix reads this ref's
  // current method whenever it repositions, so the closure itself never
  // needs to change identity across renders.
  const virtualRef = useRef({ getBoundingClientRect: getAnchorRect });
  virtualRef.current.getBoundingClientRect = getAnchorRect;

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <PopoverPrimitive.Anchor virtualRef={virtualRef} />
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          data-density="roomy"
          side="top"
          align="center"
          sideOffset={CONTENT_SIDE_OFFSET}
          collisionBoundary={collisionBoundary}
          collisionPadding={CONTENT_SIDE_OFFSET}
          onOpenAutoFocus={(event) => event.preventDefault()}
          className={cn(
            // 16px radius (`ample`), a 2px `primitives.ref.color.
            // neutral-800` border (no semantic/component-tier alias
            // resolves to this value, same "primitives reference
            // directly" precedent as Map.tsx's own container border),
            // and the `levitating` elevation recipe -- all per the user.
            //
            // Fade in/out, timed to match `MapPin.tsx`'s own default<->
            // selected color transition (200ms), per the user, 2026-09-26
            // -- same `data-[state=open]`/`data-[state=closed]` + local
            // `@keyframes` convention `Dialog.tsx` already uses for its
            // own content fade, not a shared/global keyframe (this is the
            // only consumer). `motion-safe:` guards both, matching every
            // other transition in this app's Map subtree.
            'z-index-popover rounded-[var(--semantic-border-radius-ample)] border-[2px] border-[color:var(--primitives-ref-color-neutral-800)] bg-[var(--semantic-surface-base-default)] shadow-elevation-levitating motion-safe:data-[state=open]:animate-[map-pin-popover-fade-in_200ms_ease-out] motion-safe:data-[state=closed]:animate-[map-pin-popover-fade-out_200ms_ease-in]',
          )}
        >
          <style>{`
            @keyframes map-pin-popover-fade-in {
              from { opacity: 0; }
            }
            @keyframes map-pin-popover-fade-out {
              to { opacity: 0; }
            }
          `}</style>
          {/* No `Popover.Arrow` -- Radix's arrow has no way to carry the
              Content's own 2px border around its own triangle edges, so
              the border visibly cut through/dead-ended at the arrow
              instead of outlining it, per the user. Dropped rather than
              restyled. */}
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
