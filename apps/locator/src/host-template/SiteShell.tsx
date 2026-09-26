import type { Location } from 'react-router-dom';
import { Outlet, useLocation, useRoutes } from 'react-router-dom';
import { routeChildren } from '../routes';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';

export function SiteShell() {
  // Standard React Router "modal route" pattern: when the current
  // navigation carries `state.backgroundLocation` (set by
  // `ProspectPortal.tsx`'s/`ProspectPortalLite.tsx`'s own
  // `navigateToFavorites`, desktop widths only), the *real* matched
  // route below (`<Outlet />`, e.g. `Favorites.tsx` rendering
  // `FavoritesComparatorDialog`) is meant to render as an overlay on top
  // of whichever page actually launched it, not replace it -- per the
  // user, 2026-09-25. This second, independent `useRoutes()` call
  // matches that ORIGIN location against the exact same route table
  // (`routeChildren`, shared with `router.tsx`'s own
  // `createBrowserRouter` call) to render that page's own element
  // separately, underneath. Hooks must run unconditionally every render,
  // so this always computes a match (falling back to the current, real
  // location when there's no background one to match instead) -- only
  // the *rendering* of its result below is conditional.
  const location = useLocation();
  const backgroundLocation = (
    location.state as { backgroundLocation?: Location } | null
  )?.backgroundLocation;
  const backgroundElement = useRoutes(
    routeChildren,
    backgroundLocation ?? location,
  );

  return (
    // `flex min-h-dvh flex-col` + `<main>`'s own `flex-1` below -- the
    // standard sticky-footer pattern, per the user, 2026-09-26: a page
    // short enough that Header+content+Footer don't fill the viewport
    // (e.g. Results' own zero-match state) used to leave SiteFooter
    // sitting directly under that short content instead of anchored to
    // the viewport's own bottom edge -- nothing here previously gave the
    // page a full-viewport-height sizing basis to grow into at all
    // (`<body>`/`#root` are both plain shrink-to-content). `min-h-dvh`,
    // not `min-h-screen` (`100vh`) -- per modern-web-guidance's
    // viewport-mechanics guidance, `dvh` is what actually accounts for a
    // mobile browser's own UI chrome (URL bar) collapsing/expanding as
    // the page scrolls, where a static `100vh` would leave a gap or
    // clip content depending on that chrome's current state; Baseline
    // Widely Available since 2022-12-05, no fallback needed either way.
    // A page taller than the viewport is completely unaffected -- this
    // only ever adds a FLOOR, never a cap, on the column's own height.
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      {/*
        Below `md` (768px, SiteHeader's own mobile/tablet cutoff): no
        padding here — product pages (e.g. AdvisorSearchModule's
        Stage=Start/InProgress) are already full-bleed with their own
        small padding, matching Figma's mobile frame.

        `md` and up: 24px top / 40px bottom / 24px horizontal padding
        (layout.fixed xx-large/4x-large/xx-large — see packages/tokens's
        density.<mode>.layout scale, distinct from the component-surface
        spacing.fixed scale). Top split out from bottom (was a single
        `py-4x-large`, both 40px) per the user, 2026-09-26 -- every
        page's own first element (AdvisorSearchModule's Start/InProgress
        on Landing/Results, a profile page's Hero, etc.) reads better
        24px below SiteHeader than 40px; bottom stays 40px since nothing
        prompted changing it.

        1262px (`min-[1262px]:`) is 1214px — SiteHeader's own desktop-tier
        maxWidth (see its `maxWidth: 1214` inline styles) — plus the 24px
        horizontal padding on each side. Past that width the horizontal
        padding collapses to 0 and this element takes over the 1214px max-
        width/centering itself, so the product content's edges land
        exactly on SiteHeader's content column instead of double-padding.

        The horizontal-padding utility is scoped to `md:max-[1262px]:`
        (not a bare `md:`) deliberately: Tailwind v4 emits arbitrary
        `min-[…]:`/`max-[…]:` variants in a separate bucket from its named
        breakpoints, ordered before them in the stylesheet regardless of
        pixel value — so a bare `md:px-*` would sit later in source order
        than `min-[1262px]:px-0` and win the cascade at 1262px+ despite
        matching a smaller breakpoint. Scoping both rules to non-
        overlapping ranges sidesteps that ordering quirk entirely. Uses
        `max-[1262px]` (not `-[1261px]`) since Tailwind v4 compiles
        `max-[…]` to a strict `<` comparison, not `<=` — `1262px` is the
        exact complement of `min-[1262px]:`'s `>=`, with no 1px gap.
      */}
      <main
        // `min-[1262px]:w-full` -- MANDATORY alongside `mx-auto`, not
        // decorative, per the user, 2026-09-26: a flex item's cross-axis
        // (width, in this column-flex wrapper) auto margins disable
        // `stretch` alignment entirely -- per spec, once EITHER cross-
        // margin is `auto`, the item's own `width: auto` resolves via
        // ordinary shrink-to-fit instead, capped by `max-width` but never
        // actually reaching it unless the item's own CONTENT happens to
        // want to be that wide. Confirmed live (Playwright): before this,
        // `<main>` on `/` (Landing) still measured a correct 1214px purely
        // by coincidence -- that page's own content happens to want to be
        // at least that wide regardless -- while `/search` (Results)
        // collapsed to ~498px, well short of the 1214px cap, revealing
        // the bug Landing's own content had been masking. This regressed
        // when `<main>` first became a flex item (this file's own
        // `flex min-h-dvh flex-col` sticky-footer wrapper, added the same
        // day) -- plain block-child layout (before that wrapper existed)
        // never had this failure mode, since shrink-to-fit vs. stretch
        // isn't a distinction that applies outside flex/grid contexts. An
        // explicit `width: 100%` makes `<main>`'s own width a DEFINITE
        // value before margins are even considered, which sidesteps the
        // auto-margin/stretch interaction entirely: `width: min(100%,
        // 1214px)` resolves to a real 1214px number, and `mx-auto` then
        // just centers that already-definite box in the remaining space,
        // exactly like it did back when this was a plain block child.
        className="
          flex-1
          md:max-[1262px]:px-[var(--density-layout-fixed-xx-large)]
          md:pt-[var(--density-layout-fixed-xx-large)]
          md:pb-[var(--density-layout-fixed-4x-large)]
          min-[1262px]:mx-auto
          min-[1262px]:w-full
          min-[1262px]:max-w-[1214px]
          min-[1262px]:px-0
        "
      >
        {/* The origin page, rendered as a second, independent tree when
            a background location is active -- see this component's own
            top-of-file comment. Ordered before `<Outlet />` in the DOM,
            though that barely matters in practice: Radix `Dialog.Content`
            (what the real `<Outlet />` renders in this case --
            `Favorites.tsx`'s desktop branch) already portals itself (and
            its own scrim) to `document.body`, outside this `<main>`
            entirely. */}
        {backgroundLocation && backgroundElement}
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
