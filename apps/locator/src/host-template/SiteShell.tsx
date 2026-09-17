import { Outlet } from 'react-router-dom';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';

export function SiteShell() {
  return (
    <>
      <SiteHeader />
      {/*
        Below `md` (768px, SiteHeader's own mobile/tablet cutoff): no
        padding here — product pages (e.g. AdvisorSearchModule's
        Stage=Start/InProgress) are already full-bleed with their own
        small padding, matching Figma's mobile frame.

        `md` and up: 40px vertical / 24px horizontal padding (layout.fixed
        4x-large/xx-large — see packages/tokens's density.<mode>.layout
        scale, distinct from the component-surface spacing.fixed scale).

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
        className="
          md:max-[1262px]:px-[var(--density-layout-fixed-xx-large)]
          md:py-[var(--density-layout-fixed-4x-large)]
          min-[1262px]:mx-auto
          min-[1262px]:max-w-[1214px]
          min-[1262px]:px-0
        "
      >
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}
