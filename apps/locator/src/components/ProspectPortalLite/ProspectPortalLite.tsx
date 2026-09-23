import { Popover as PopoverPrimitive } from 'radix-ui';
import { lightRoomyTokens } from 'tokens';
import { Avatar, Button, Link } from 'ds';
import { useSession } from '../../session/useSession';
import { getInitials } from '../../utils/getInitials';
import { cn } from '../../utils/cn';
import type { ProspectPortalLiteProps } from './ProspectPortalLite.types';

// spacing.fixed.x-small (4px, density-invariant), same token FilterMenu's
// and SearchInput's own Popover Content sideOffset read — Popper's
// sideOffset takes a plain number, not a CSS var, so this reads
// packages/tokens' JS token output directly, same as those two.
const CONTENT_SIDE_OFFSET = lightRoomyTokens.densitySpacingFixedXSmall;

// Figma node 1306:50824 of the Find-FA-Screens file — a compact,
// logged-in-only row (Avatar + "Welcome, [username]!" + "View favorites."
// link) meant for a tighter spot than the full ProspectPortal card (e.g.
// this page's own top-left corner, above the Hero), not a replacement for
// it. No Figma frame exists yet for a logged-out state here, so it's a
// proportionate trim of ProspectPortal's own logged-out content down to
// this row's compact shape: an all-caps nanoheading label plus a single
// condensed "Sign in" button (real, not inert -- calls `signIn` directly,
// unlike "View favorites." below, which stays inert since the Saved
// Advisors page isn't built yet).
export function ProspectPortalLite({ className }: ProspectPortalLiteProps) {
  const { signedIn, fullName, signIn, signOut } = useSession();

  return (
    <section
      aria-label="Prospect portal"
      className={cn(
        // Full width, sharing the same box edges as the Hero directly
        // below it (both mobile and desktop -- see AdvisorProfile.tsx/
        // LocationProfile.tsx's own callers, which place this as a plain
        // sibling of the Hero in the same flex column / grid column, no
        // margin of its own on either), with a flat 12px left/right
        // padding at every breakpoint so its own content sits inset 12px
        // from the Hero's edge, per the user -- unlike most of this app's
        // other product content, this doesn't vary by breakpoint or rely
        // on SiteShell's `<main>` padding on desktop.
        //
        // `min-h-[32px]` -- the signed-in state's own Avatar (32px, `xs`)
        // is taller than the signed-out state's text-only content (24px,
        // measured live via Playwright), so toggling session state without
        // this shifts the Hero below it up/down by that 8px difference.
        // Matching the taller state's own height here, rather than
        // animating the transition between them, is a deliberate choice
        // per the user: `calc-size()`/`interpolate-size` (the only real
        // CSS mechanism for animating to/from an intrinsic height) is
        // Chrome/Edge-only, failing this repo's Baseline Widely Available
        // policy, and a JS-measured height transition is real complexity
        // for what's currently just a demo spoofed sign-in toggle.
        'flex w-full items-center gap-[var(--density-spacing-fixed-med)] rounded-[var(--semantic-border-radius-generous)] px-[var(--density-spacing-fixed-med)] min-h-[32px]',
        className,
      )}
    >
      {signedIn ? (
        <>
          <PopoverPrimitive.Root>
            <PopoverPrimitive.Trigger asChild>
              <button
                type="button"
                aria-label="Prospect portal menu"
                className="cursor-pointer rounded-full focus-visible:outline-none focus-visible:shadow-[0_0_0_var(--semantic-control-border-width-active)_var(--semantic-content-common-text-color-default)]"
              >
                <Avatar.Root size="xs">
                  <Avatar.Fallback>{getInitials(fullName)}</Avatar.Fallback>
                </Avatar.Root>
              </button>
            </PopoverPrimitive.Trigger>
            <PopoverPrimitive.Portal>
              <PopoverPrimitive.Content
                data-density="roomy"
                align="start"
                sideOffset={CONTENT_SIDE_OFFSET}
                className="z-index-popover flex flex-col items-start gap-[var(--density-spacing-fixed-x-small)] rounded-[var(--semantic-border-radius-generous)] bg-[var(--component-avatar-background-color)] px-[var(--density-spacing-fixed-large)] py-[var(--density-spacing-fixed-small)] shadow-elevation-raised"
              >
                <Link
                  href="#"
                  aria-disabled="true"
                  tabIndex={-1}
                  onClick={(event) => event.preventDefault()}
                  className="cursor-not-allowed text-[length:var(--semantic-content-nanocopy-font-size)] font-[number:var(--semantic-content-nanocopy-font-weight)] leading-[var(--semantic-content-nanocopy-line-height)]"
                >
                  Go to Prospect Portal.
                </Link>
                <Link
                  asChild
                  className="cursor-pointer border-0 bg-transparent p-0 text-[length:var(--semantic-content-nanocopy-font-size)] font-[number:var(--semantic-content-nanocopy-font-weight)] leading-[var(--semantic-content-nanocopy-line-height)]"
                >
                  <button type="button" onClick={signOut}>
                    Sign Out
                  </button>
                </Link>
                <PopoverPrimitive.Arrow className="fill-[var(--component-avatar-background-color)]" />
              </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
          </PopoverPrimitive.Root>
          <span className="text-[length:var(--semantic-content-nanocopy-font-size)] font-[number:var(--semantic-content-nanocopy-font-weight)] leading-[var(--semantic-content-nanocopy-line-height)] text-[color:var(--semantic-content-common-text-color-default)]">
            Welcome, {fullName}!
          </span>
          {/* Real link now that `/favorites` exists -- unlike "Go to
              Prospect Portal." above, which still has nowhere real to go. */}
          <Link
            href="/favorites"
            className="text-[length:var(--semantic-content-nanocopy-font-size)] font-[number:var(--semantic-content-nanocopy-font-weight)] leading-[var(--semantic-content-nanocopy-line-height)]"
          >
            View favorites.
          </Link>
        </>
      ) : (
        // Own inner 8px gap, distinct from the section's own gap (12px,
        // `density-spacing-fixed-med` -- shared with the signed-in state's
        // three children above) -- keeping this group in one wrapper
        // rather than three direct section children is what lets it use a
        // different gap value without touching the signed-in state's own.
        // `self-end` -- the section's own `min-h-[32px]` (added to match
        // the signed-in state's taller Avatar-driven height, see its own
        // comment) leaves 8px of slack above this shorter, 24px-tall
        // content when centered via the section's `items-center`; per
        // the user, this group should sit flush against the section's
        // own bottom edge instead of splitting that slack evenly.
        <div className="flex items-center self-end gap-[var(--density-spacing-fixed-small)]">
          <span className="text-[length:var(--semantic-content-nanoheading-font-size)] font-[number:var(--semantic-content-nanoheading-font-weight)] leading-[var(--semantic-content-nanoheading-line-height)] text-[color:var(--semantic-content-common-text-color-default)] uppercase">
            Edward Jones Prospect Portal
          </span>
          {/* `Button.Root` + `asChild`, not the flat `Button` -- same
              reasoning as AdvisorHeroMobile.tsx's own "Call" button:
              asChild only works via Button.Root, since the flat
              component always wraps its own children in a Button.Label
              span, which trips Radix Slot's single-child requirement.
              Styled to read as a plain link (the same nanocopy-sized,
              underlined, blue treatment "Learn more" had, per the user),
              not a pill button -- `className` strips every one of
              Button.Root's own layout/fill classes (padding, min-height/
              width, border, background, gap, radius) and replaces them
              with Link's own default typography/color/hover/underline
              classes directly, since asChild forfeits Link's own
              component here. */}
          <Button.Root
            variant="secondary"
            asChild
            className="min-h-0 min-w-0 gap-0 rounded-none border-0 bg-transparent p-0 text-[length:var(--semantic-content-nanocopy-font-size)] font-[number:var(--semantic-content-nanocopy-font-weight)] leading-[var(--semantic-content-nanocopy-line-height)] text-[color:var(--component-link-text-color-default)] underline decoration-[length:var(--component-link-underline-thickness)] underline-offset-[length:var(--component-link-underline-offset)] hover:border-transparent hover:bg-[var(--component-link-background-color-hover)] hover:text-[color:var(--component-link-text-color-hover)] focus-visible:shadow-none"
          >
            <button type="button" onClick={signIn}>
              <Button.Label>Sign in</Button.Label>
            </button>
          </Button.Root>
        </div>
      )}
    </section>
  );
}
