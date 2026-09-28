import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Collapsible as CollapsiblePrimitive } from 'radix-ui';
import { NoticeInfo, CaretDown, CaretUp } from 'icons';
import { cn } from '../../utils/cn';
import type { PrototypeInfoTrayProps } from './PrototypeInfoTray.types';

const START_PAGE_PATH = '/';

// A persistent, non-modal disclosure docked to the bottom of the viewport
// on every route (rendered once from SiteShell.tsx, outside <main>) --
// explains this prototype's own limitations vs. a real application (why
// certain links/buttons are inert, the locator's fixture-data/distance-
// sort limitations, spoofed sign-in, etc.). Not a Dialog: it must never
// block interaction with the page underneath it. Themed to match
// ProspectPortal.tsx's own literal card treatment (teal-250 background,
// reversed text, light-gold accent) rather than ProspectPortalLite's pill,
// per the user, so it reads as the same "portal-tier" surface family --
// this is still a different, locator-local component, not a variant of
// either.
export function PrototypeInfoTray({ className }: PrototypeInfoTrayProps) {
  const location = useLocation();
  // SiteShell mounts once per full page load and never remounts on
  // client-side navigation, so this initializer only ever runs once per
  // session: open by default on a fresh load landing on the start page,
  // collapsed everywhere else, and once toggled the `open` state below
  // just persists for the rest of the session -- no storage needed to get
  // "stays collapsed once dismissed," per the user.
  const [open, setOpen] = useState(() => location.pathname === START_PAGE_PATH);

  return (
    <CollapsiblePrimitive.Root asChild open={open} onOpenChange={setOpen}>
      <section
        aria-label="About this prototype"
        className={cn(
          'fixed inset-x-0 bottom-0 z-index-persistent-tray flex justify-center',
          className,
        )}
      >
        {/* Trigger and Content share this one column so the tab's own
            right-edge offset below is relative to the visible tray's own
            edge, not the viewport's. `md:w-4/5` -- 80% width on larger
            screens rather than a fixed px cap, per the user; full width
            stays below `md` (768px, this app's own standard breakpoint)
            since there's no room to spare there. */}
        <div className="flex w-full flex-col md:w-4/5">
          {/* Tab first in DOM, affixed to the top of the tray -- a drawer-
              handle position, per the user: the whole section is bottom-
              anchored (`bottom-0`, no `top`), so as Content's grid row
              grows the section's top edge (where this tab sits) rises
              while its bottom edge stays flush with the viewport, and the
              panel below always reads as flowing down to that same fixed
              bottom edge. `self-end` + `mr-[...]` -- offset toward the
              tray's own right edge rather than centered, per the user;
              `--density-layout-fixed-4x-large` (40px) is the same token
              SiteShell.tsx's own `<main>` bottom padding reads for that
              literal 40px value, reused here rather than a bare arbitrary
              px. Top corners only, per the user -- it sits flush against
              the panel below it when open, so a rounded bottom would
              visually cut into that shared edge. Border on top/left/right
              only, no bottom.
              `calc(var(--semantic-surface-border-width) * 4)` -- 4x that
              token's real 1px value rather than a bare 4px, since no
              semantic/primitive tier has a matching border-width step of
              its own to fall back to. `--primitives-ref-color-teal-400`
              -- two steps lighter than this tray's own teal-250
              background, per the user ("a few steps lighter").
              `relative z-10` + negative `mb-[...]` equal to that same
              border width -- per the user, the panel below DOES have its
              own top border (see its own comment), so without this the
              two borders would meet and read as a doubled, bisecting
              line right where the tab and panel touch. Pulling the tab
              down by exactly the border's own thickness makes its solid
              background paint over that one segment of the panel's top
              border directly underneath it (the two share the same
              teal-250 fill, so the overlap is invisible), while the
              border still shows normally everywhere else along the
              panel's top edge -- the tab and panel read as one
              continuous surface with a seamless notch, not a literal gap
              in the panel's own border geometry (not achievable with
              plain CSS borders on their own). `z-10` is required for the
              overlap itself to paint correctly: without it, Content
              (declared after Trigger in DOM order) would draw over
              Trigger in the overlapping strip instead of the reverse.
              No `shadow-elevation-*` here, per the user -- the panel
              below already carries `shadow-elevation-floating` for the
              whole tray; the tab having its own separate shadow read as
              a second, disconnected floating layer rather than part of
              the same surface. */}
          <CollapsiblePrimitive.Trigger
            aria-label={
              open ? 'Hide prototype information' : 'Show prototype information'
            }
            className="relative z-10 mr-[var(--density-layout-fixed-4x-large)] mb-[calc(var(--semantic-surface-border-width)*-4)] flex cursor-pointer items-center gap-[var(--density-spacing-fixed-small)] self-end rounded-t-[var(--semantic-border-radius-generous)] border-t-[length:calc(var(--semantic-surface-border-width)*4)] border-x-[length:calc(var(--semantic-surface-border-width)*4)] border-[color:var(--primitives-ref-color-teal-400)] bg-[var(--primitives-ref-color-teal-250)] px-[var(--density-spacing-fixed-large)] py-[var(--density-spacing-fixed-small)]"
          >
            {/* `[&>path]:fill-current` -- NoticeInfo's own generated SVG
                carries a hardcoded `#4B4D4E` fill baked into its paths, an
                intentional, Figma-confirmed semantic accent color per
                docs/PLAN.md §1.2 (the SVGR `currentColor` swap
                deliberately only targets the neutral-default `#006DA3`
                hex, leaving this one alone) -- so `text-[color:...]`
                alone has no visible effect on it. A CSS `fill` rule on
                its child paths overrides that presentation attribute (SVG
                presentation attributes act as the lowest-priority
                default, per spec) scoped to just this usage, letting
                `fill-current` pick up this element's own
                `text-[color:...]` the normal way, without touching the
                generated icon or its confirmed-intentional default color
                anywhere else it's used. */}
            <NoticeInfo
              aria-hidden
              className="size-[var(--density-sizing-fixed-large)] text-[color:var(--semantic-content-common-text-color-reverse)] [&>path]:fill-current"
            />
            {/* Up = collapsed (click to pull the tray open), down = open
                (click to push it back closed), per the user. */}
            {open ? (
              <CaretDown
                aria-hidden
                className="size-[var(--density-sizing-fixed-large)] text-[color:var(--semantic-content-common-text-color-reverse)]"
              />
            ) : (
              <CaretUp
                aria-hidden
                className="size-[var(--density-sizing-fixed-large)] text-[color:var(--semantic-content-common-text-color-reverse)]"
              />
            )}
          </CollapsiblePrimitive.Trigger>

          {/* Same grid-template-rows collapse animation as ds's own
              Card.Body/Card.Footer (packages/ds/src/components/Card/Card.tsx)
              -- forceMount keeps this mounted at all times instead of
              Radix's default Presence unmount; `invisible` +
              `data-[state=closed]:delay-200` pull it out of the a11y
              tree/tab order only once the collapse animation has actually
              finished, not instantly. */}
          <CollapsiblePrimitive.Content
            forceMount
            className="invisible grid w-full grid-rows-[0fr] overflow-hidden transition-[grid-template-rows,visibility] duration-200 ease-out data-[state=closed]:delay-200 data-[state=open]:visible data-[state=open]:grid-rows-[1fr]"
          >
            <div className="min-h-0 overflow-hidden">
              {/* Top + left + right border, no bottom -- per the user, so
                  the tray's own open bottom edge (flush with the
                  viewport, per this component's top-of-file comment)
                  stays borderless. The top border here IS drawn full-
                  width (unlike an earlier pass that dropped it entirely
                  to dodge the seam) -- the Trigger's own negative
                  margin/z-index above is what actually keeps it from
                  reading as a doubled line under the tab; see its
                  comment. `--density-layout-fixed-5x-large` (44px), not
                  a `spacing.fixed` token -- per the user's further
                  padding increase, `spacing.fixed.xxx-large` (32px) was
                  already this component's prior value and is that
                  scale's own largest step, so going further reaches into
                  the `layout` scale instead (same one this file's own
                  40px tab offset already reads from). */}
              <div className="flex w-full flex-col gap-[var(--density-spacing-fixed-med)] rounded-t-[var(--semantic-border-radius-generous)] border-t-[length:calc(var(--semantic-surface-border-width)*4)] border-x-[length:calc(var(--semantic-surface-border-width)*4)] border-[color:var(--primitives-ref-color-teal-400)] bg-[var(--primitives-ref-color-teal-250)] px-[var(--density-layout-fixed-5x-large)] py-[var(--density-layout-fixed-5x-large)] shadow-elevation-floating">
                <span className="text-[length:var(--semantic-content-nanoheading-font-size)] font-[number:var(--semantic-content-nanoheading-font-weight)] leading-[var(--semantic-content-nanoheading-line-height)] text-[color:var(--semantic-content-common-text-color-reverse)] uppercase">
                  About this prototype
                </span>
                {/* Placeholder copy -- draft content for the user to edit,
                    not final. */}
                <ul className="flex list-disc flex-col gap-[var(--density-spacing-fixed-x-small)] pl-[var(--density-spacing-fixed-large)] text-[length:var(--semantic-content-paragraph-font-size)] font-[number:var(--semantic-content-paragraph-font-weight)] leading-[var(--semantic-content-paragraph-line-height)] text-[color:var(--semantic-content-common-text-color-reverse)]">
                  <li>
                    This is a portfolio prototype, not a connected production
                    application — no real accounts, advisors, or data sit behind
                    it.
                  </li>
                  <li>
                    Advisor and location results come from a fixed local
                    fixture, not a live directory — the roster, addresses, and
                    availability shown here won&rsquo;t match any real Edward
                    Jones branch.
                  </li>
                  <li>
                    &ldquo;Find advisors near me&rdquo; sorts by distance from a
                    single fixed fake location, not your actual device location
                    — there&rsquo;s no real geolocation or address search behind
                    it.
                  </li>
                  <li>
                    Sign-in and favorites are spoofed client-side for this demo
                    — nothing is sent to a server, and both reset on reload.
                  </li>
                  <li>
                    Some links and buttons (e.g. &ldquo;Go to Portal&rdquo;,
                    &ldquo;Learn More&rdquo;) are styled but intentionally inert
                    — they point at real destinations that don&rsquo;t exist in
                    this demo.
                  </li>
                </ul>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="cursor-pointer self-end border-0 bg-transparent p-0 text-[length:var(--semantic-content-nanocopy-font-size)] font-[number:var(--semantic-content-nanocopy-font-weight)] leading-[var(--semantic-content-nanocopy-line-height)] text-[color:var(--semantic-brand-secondary-light-gold)] underline"
                >
                  Collapse
                </button>
              </div>
            </div>
          </CollapsiblePrimitive.Content>
        </div>
      </section>
    </CollapsiblePrimitive.Root>
  );
}
