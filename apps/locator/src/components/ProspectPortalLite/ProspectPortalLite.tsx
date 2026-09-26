import { Popover as PopoverPrimitive } from 'radix-ui';
import { lightRoomyTokens } from 'tokens';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Button, Link } from 'ds';
import { HelpQuestionMark } from 'icons';
import { useSession } from '../../session/useSession';
import { getInitials } from '../../utils/getInitials';
import { cn } from '../../utils/cn';
import type { ProspectPortalLiteProps } from './ProspectPortalLite.types';

// spacing.fixed.x-small (4px, density-invariant), same token FilterMenu's
// and SearchInput's own Popover Content sideOffset read — Popper's
// sideOffset takes a plain number, not a CSS var, so this reads
// packages/tokens' JS token output directly, same as those two.
const CONTENT_SIDE_OFFSET = lightRoomyTokens.densitySpacingFixedXSmall;

// 768px -- matches `Favorites.tsx`'s own `DESKTOP_QUERY` (in turn
// SiteHeader.tsx's documented `md` breakpoint), reused rather than
// introducing a second real breakpoint value.
const FAVORITES_MOBILE_QUERY = '(max-width: 767.98px)';

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
export function ProspectPortalLite({
  favoritesFromLabel,
  className,
}: ProspectPortalLiteProps) {
  const { signedIn, fullName, signIn, signOut } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const favoritesHref = `/favorites?from=${encodeURIComponent(favoritesFromLabel)}`;

  // Always client-side now (real full-reload `<a href>` behavior is
  // fully retired, per the user, 2026-09-25), but two different
  // treatments by width:
  //
  // Mobile (below `FAVORITES_MOBILE_QUERY`): a directional slide
  // (`view-transitions.css`'s own `data-favorites-transition-
  // direction`-scoped rules) to the dedicated `FavoritesComparatorMobile`
  // route -- unchanged from the earlier pass here.
  //
  // Desktop: `FavoritesComparatorDialog` now opens as a real overlay on
  // top of *this* page instead of navigating away to a route that
  // rendered only the Dialog with nothing behind it (confirmed live --
  // that was a full reload to a blank page, not merely un-transitioned).
  // `state: { backgroundLocation: location }` is the standard React
  // Router "modal route" pattern -- `SiteShell.tsx`'s own second,
  // independent `useRoutes()` call matches this exact location a second
  // time to render this page's element *underneath* the real matched
  // route (`Favorites.tsx`, rendering the Dialog) -- see its own
  // top-of-file comment for the full mechanics.
  function navigateToFavorites(event: { preventDefault: () => void }) {
    event.preventDefault();
    if (window.matchMedia(FAVORITES_MOBILE_QUERY).matches) {
      document.documentElement.dataset.favoritesTransitionDirection = 'forward';
      // `state: { returnTo }` -- `Favorites.tsx`'s own "Back to..." link
      // reads this to navigate back via `navigate(returnTo, {
      // viewTransition: true })` instead of `navigate(-1)`, per the
      // user, 2026-09-25: a history-delta navigation's own `popstate`
      // fires asynchronously (never inside the same synchronous
      // callback a `document.startViewTransition()` call needs to
      // capture the "new" DOM from), so wrapping `navigate(-1)` in one
      // the way an earlier pass here tried never actually captured a
      // real transition -- it fell through to a plain, untransitioned
      // navigation instead. A concrete `returnTo` path lets that link
      // use React Router's own `viewTransition` navigate option instead,
      // the same reliable mechanism this link uses. Real "go back"
      // (`navigate(-1)`) is kept as the fallback there for the one case
      // this can't cover -- landing on `/favorites` with no `state` at
      // all (e.g. a direct URL visit).
      navigate(favoritesHref, {
        viewTransition: true,
        state: {
          returnTo: `${window.location.pathname}${window.location.search}`,
        },
      });
      window.setTimeout(() => {
        delete document.documentElement.dataset.favoritesTransitionDirection;
      }, 400);
      return;
    }
    navigate(favoritesHref, { state: { backgroundLocation: location } });
  }

  return (
    <section
      aria-label="Prospect portal"
      className={cn(
        // Full width, sharing the same box edges as the Hero directly
        // below it (both mobile and desktop -- see AdvisorProfile.tsx/
        // LocationProfile.tsx's own callers, which place this as a plain
        // sibling of the Hero in the same flex column / grid column, no
        // margin of its own on either), with a flat 12px (`density.
        // spacing.fixed.med`) left/right padding above 350px viewport
        // width, per the user -- unlike most of this app's other
        // product content, this doesn't vary by breakpoint or rely on
        // SiteShell's `<main>` padding on desktop.
        //
        // Below 350px, per the user, 2026-09-26: a fluid `clamp()` (not
        // a stepped breakpoint jump) shrinks that 12px down to a 4px
        // floor, reached at 320px viewport width -- a widely-used
        // practical "smallest real phone" floor elsewhere in this app
        // (see e.g. ResultsList.tsx's own fluid-margin comments) rather
        // than an arbitrarily-chosen second endpoint. Plain `vw`, not
        // container query units -- per modern-web-guidance's container-
        // vs-media-query heuristic (see LocationCard.tsx's own identical
        // citation for the opposite, correctly-`cqi` case): this
        // component's own rendered width already just IS the viewport's
        // width (a full-width sibling of the Hero, not a card whose own
        // box can be narrower than the viewport for independent
        // layout reasons), so `vw` is the right unit here, not a legacy
        // fallback for it. `4px + (100vw-320px)*4/15`: linear between
        // (320px viewport -> 4px) and (350px viewport -> 12px);
        // `clamp()`'s own floor/ceiling flatten it below 320px and above
        // 350px.
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
        'flex w-full items-center gap-[var(--density-spacing-fixed-med)] rounded-[var(--semantic-border-radius-generous)] px-[clamp(4px,calc(4px+(100vw-320px)*4/15),var(--density-spacing-fixed-med))] min-h-[32px]',
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
            href={favoritesHref}
            onClick={navigateToFavorites}
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
        //
        // Brand *light* gold pill background
        // (`--semantic-brand-secondary-light-gold`, switched from the
        // primary `--semantic-brand-primary-gold` per the user,
        // 2026-09-26 -- the closest thing to a "component" tier token
        // for this brand color, so it's read directly per this repo's
        // fallback-order rule for a genuine gap), `rounded-full` (not a
        // fixed px radius token -- this pill's own height isn't a fixed
        // component size the way Tag's/SegmentedControl's own radius
        // tokens assume, so a self-adjusting radius is what actually
        // guarantees a true pill regardless of content height) and its
        // own padding (this group had none before -- a pill shape reads
        // as broken without inset from its own rounded edge), per the
        // user, 2026-09-26.
        <div
          // `flex-wrap` + `justify-center` -- per the user, 2026-09-26:
          // "Sign in" wraps to its own line instead of ever forcing this
          // pill wider than its content actually needs, and the two
          // resulting lines center against each other/the pill's own
          // width rather than staying left-aligned once wrapped. The
          // label+icon group below is its own nested, non-wrapping flex
          // item specifically so THIS row's wrap point can only ever
          // land between that group and "Sign in" -- never between the
          // label and the icon themselves (the user's own "keep the
          // icon locked with the text").
          //
          // `gap-x-*` only, no `gap-y-*` -- per the user, 2026-09-26: the
          // row's own horizontal rhythm (label to icon to "Sign in",
          // unwrapped) stays the existing 8px, but the *wrapped* case's
          // line-to-line spacing is dropped to 0 entirely -- each
          // line's own `leading-[...]` (nanoheading/nanocopy's line-
          // height, both already taller than their own text) already
          // supplies enough visual air between the two lines without an
          // explicit gap on top of it.
          className="flex flex-wrap items-center justify-center self-end gap-x-[var(--density-spacing-fixed-small)] rounded-full bg-[color:var(--semantic-brand-secondary-light-gold)] px-[var(--density-spacing-fixed-med)] py-[var(--density-spacing-fixed-x-small)]"
        >
          <div className="flex items-center gap-[var(--density-spacing-fixed-small)]">
            <span className="text-[length:var(--semantic-content-nanoheading-font-size)] font-[number:var(--semantic-content-nanoheading-font-weight)] leading-[var(--semantic-content-nanoheading-line-height)] text-[color:var(--semantic-content-common-text-color-default)] uppercase">
              Edward Jones Prospect Portal
            </span>
            {/* 16x16 (`density.sizing.fixed.large`, same token
                SearchFormSearchInput's own suggestion-row icons read), in
                `--semantic-control-action-color-default` ("action
                default color", per the user, 2026-09-26) -- a
                lightweight "what is this" affordance, not a form
                control, so a plain icon button rather than
                `Button`/`Button.Root`. Popover content below otherwise
                matches the signed-in state's own Popover exactly
                (`data-density`, `align`, `sideOffset`, layout/padding/
                radius/elevation classes, `Arrow`), just with the
                light-gold pill background above instead of the avatar's
                dark one, per the user. */}
            <PopoverPrimitive.Root>
              <PopoverPrimitive.Trigger asChild>
                <button
                  type="button"
                  aria-label="What is the Prospect Portal?"
                  // `-ml-[4px]` -- this row's shared `gap-[fixed-small]`
                  // (8px) reads as too much air between the label text
                  // and this icon specifically, per the user, 2026-09-26;
                  // pulling just this trigger 4px closer (rather than
                  // shrinking the row's own shared gap, which would also
                  // tighten the icon-to-"Sign in" gap) tightens only the
                  // one relationship that was flagged, down to a net 4px.
                  className="-ml-[4px] cursor-pointer rounded-full focus-visible:outline-none focus-visible:shadow-[0_0_0_var(--semantic-control-border-width-active)_var(--semantic-content-common-text-color-default)]"
                >
                  <HelpQuestionMark
                    aria-hidden="true"
                    className="size-[var(--density-sizing-fixed-large)] text-[color:var(--semantic-control-action-color-default)]"
                  />
                </button>
              </PopoverPrimitive.Trigger>
              <PopoverPrimitive.Portal>
                <PopoverPrimitive.Content
                  data-density="roomy"
                  align="start"
                  sideOffset={CONTENT_SIDE_OFFSET}
                  className="z-index-popover flex flex-col items-start gap-[var(--density-spacing-fixed-x-small)] rounded-[var(--semantic-border-radius-generous)] bg-[color:var(--semantic-brand-secondary-light-gold)] px-[var(--density-spacing-fixed-large)] py-[var(--density-spacing-fixed-small)] shadow-elevation-raised"
                >
                  {/* Inert, same as the signed-in popover's own "Go to
                      Prospect Portal." above -- no real destination built
                      for this yet either. */}
                  <Link
                    href="#"
                    aria-disabled="true"
                    tabIndex={-1}
                    onClick={(event) => event.preventDefault()}
                    className="cursor-not-allowed text-[length:var(--semantic-content-nanocopy-font-size)] font-[number:var(--semantic-content-nanocopy-font-weight)] leading-[var(--semantic-content-nanocopy-line-height)]"
                  >
                    Learn more.
                  </Link>
                  <PopoverPrimitive.Arrow className="fill-[color:var(--semantic-brand-secondary-light-gold)]" />
                </PopoverPrimitive.Content>
              </PopoverPrimitive.Portal>
            </PopoverPrimitive.Root>
          </div>
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
