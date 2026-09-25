import investmentServicesImage from '../../assets/investment-services.png';
// vite-imagetools-generated WebP srcset (build-time only), same pattern as
// Start.tsx's own hero image -- capped at 1186w (the source photo's own
// native width) rather than Start.tsx's wider ceiling, since this asset
// only ever renders at its own display width or smaller (fixed to the
// remaining flex space beside the 374px services panel, up to ~696px at
// the widest -- see this file's own `aspect-[696/427]`).
import investmentServicesImageSrcset from '../../assets/investment-services.png?w=400;700;1000;1186&format=webp&as=srcset';

// Figma: "Locator/Desktop/Start" FRAME #677:9031 (dark card: heading + intro
// + services list beside a photo) and "Locator/Mobile/Start" FRAME
// #1204:40716 (same copy, stacked, no photo -- mobile's own frame has no
// image node at all, so the photo is a `md:block` addition, not something
// hidden-by-default). `md` (768px), not a container query -- same
// reasoning as HowItWorks.tsx's own top comment: this is a plain page-body
// section, not a variable-width embeddable module.
const SERVICES = [
  'Investment Products',
  'Planning for Retirement',
  'Wealth Strategies',
  'Education Savings',
  'Estate Planning',
  'Savings, Cash and Credit',
  'Insurance and Annuities',
  'Business Owner Solutions',
];

export function InvestmentServices() {
  return (
    // Width: no horizontal margin at `md`+ (i.e. `md:mx-0`), per the user --
    // matches AdvisorSearchModule.tsx's own width exactly (100% of
    // `<main>`'s content box, see its own comment) there, not
    // FilterFacets/ProspectPortal-style page-margin insets. Below `md`,
    // per the user, this card gets its own inset instead of AdvisorSearch-
    // Module's full-bleed mobile treatment -- `mx-[layout.fixed.large]`
    // (16px, the same page-margin token ResultsList/HowItWorks already use
    // below `md`) plus `mb-[spacing.fixed.xxx-large]` (32px, matching
    // HowItWorks.tsx's own trailing margin) so it reads as its own
    // spaced-out card rather than bleeding to the viewport edge.
    //
    // Corner radius: rounded at every breakpoint (unconditional, no
    // `md:` split), per the user -- once this card is its own inset
    // element below `md` rather than bleeding to the viewport edge, square
    // corners read as a mistake rather than intentional, unlike
    // AdvisorSearchModule's genuinely edge-to-edge mobile treatment.
    //
    // Own padding: below `md`, per the user, roughly half of the `md`+
    // values below (48/32/48 -> 24/16/24) rather than Figma's own literal
    // mobile spec (a flat 8px) -- `xx-large`/`large`/`xx-large` are real
    // density-fixed tokens at exactly those halved values, not arbitrary
    // calc()s.
    //
    // 80px top margin from HowItWorks above, per the user -- desktop only
    // (`md:mt-*`, reset to 0 below `md`, where this card's own `mb-*` above
    // -- stacked on top of HowItWorks.tsx's existing trailing margin, not
    // replacing it -- is the mobile gap instead).
    <section
      className="
        mx-[var(--density-layout-fixed-large)]
        mb-[var(--density-spacing-fixed-xxx-large)]
        flex flex-col gap-[var(--density-spacing-fixed-xx-large)]
        rounded-[var(--semantic-border-radius-generous)]
        bg-[var(--semantic-brand-secondary-dark-cerulean)]
        px-[var(--density-spacing-fixed-xx-large)]
        pt-[var(--density-spacing-fixed-large)]
        pb-[var(--density-spacing-fixed-xx-large)]
        md:mx-0 md:mb-0
        md:mt-[var(--primitives-ref-size-13)]
        md:px-[var(--primitives-ref-space-11)]
        md:pt-[var(--density-spacing-fixed-xxx-large)]
        md:pb-[var(--primitives-ref-space-11)]
      "
    >
      <div className="flex flex-col gap-[var(--density-spacing-fixed-xx-large)]">
        <div className="flex flex-col gap-[var(--density-spacing-fixed-x-small)]">
          {/* Mobile: Heavy (16/24/600) -- same "no dedicated `heavy-color`
              token" fallback as HowItWorks.tsx's own step labels. Desktop
              (md+): Heading Large (36/54/600). Both use the shared
              `common-text-color-reverse` token (white on this dark card),
              not either style's own (dark, light-surface) default color. */}
          <h2 className="text-[length:var(--semantic-content-heavy-font-size)] leading-[length:var(--semantic-content-heavy-line-height)] font-[number:var(--semantic-content-heavy-font-weight)] text-[color:var(--semantic-content-common-text-color-reverse)] md:text-[length:var(--semantic-content-heading-large-font-size)] md:leading-[length:var(--semantic-content-heading-large-line-height)] md:font-[number:var(--semantic-content-heading-large-font-weight)]">
            Investment Services
          </h2>
          {/* Underline: matches Start.tsx's own H1 underline treatment
              (same tokens for height, same gold color), but at Figma's own
              80px/120px widths for this card specifically (Start.tsx's own
              underline is 60px/120px) -- no token models an arbitrary
              underline width, same as Start.tsx's own hardcoded values. */}
          <div className="h-[var(--density-sizing-fixed-xx-small)] w-[80px] bg-[var(--semantic-brand-secondary-light-gold)] md:h-[var(--density-sizing-fixed-x-small)] md:w-[120px]" />
        </div>
        {/* Mobile: Common (16/24/400). Desktop (md+): Subheading
            (20/30/525). */}
        <p className="text-[length:var(--semantic-content-common-font-size)] leading-[length:var(--semantic-content-common-line-height)] font-[number:var(--semantic-content-common-font-weight)] text-[color:var(--semantic-content-common-text-color-reverse)] md:text-[length:var(--semantic-content-subheading-font-size)] md:leading-[length:var(--semantic-content-subheading-line-height)] md:font-[number:var(--semantic-content-subheading-font-weight)]">
          We offer a variety of investment services and account types to help
          you plan for whatever&apos;s ahead.
        </p>
      </div>
      {/*
        Three tiers, per the user: below `md` the image is hidden entirely
        (see its own comment below) so direction doesn't matter; `md` up to
        1013px stacks the image above the list (`flex-col-reverse` --
        visual-only reorder, safe here since neither the list nor the
        decorative `alt=""` image carries any focusable/interactive content
        for `order`'s usual DOM-vs-visual-order footgun to bite); 1014px+
        goes side by side, list left/image right, matching Figma's own
        desktop reference.

        `md:max-[1013px]:`/`min-[1014px]:` (non-overlapping ranges), not a
        bare `md:` plus a bare `min-[1014px]:` -- same Tailwind v4 ordering
        quirk SiteShell.tsx's own `<main>` comment documents: arbitrary
        `min-[…]:` variants are emitted in a bucket ordered before named
        breakpoints regardless of pixel value, so an unscoped `md:flex-col-
        reverse` would still win the cascade at 1014px+ over `min-
        [1014px]:flex-row` despite matching a smaller breakpoint.
      */}
      <div className="flex flex-col gap-[var(--density-spacing-fixed-small)] md:max-[1013px]:flex-col-reverse md:max-[1013px]:gap-[var(--density-spacing-fixed-xx-large)] min-[1014px]:flex-row min-[1014px]:items-center min-[1014px]:gap-[var(--primitives-ref-space-11)]">
        {/* 374px fixed width only once the image sits beside it (1014px+,
            matching Figma's own fixed-width services panel -- same
            hardcoded-fixed-width precedent as Start.tsx's own 365px "Right
            Column"); full width while stacked (below 1014px, image hidden
            or above it). */}
        {/* Padding below `md`: half of `md`+'s own 40px/32px (px-[space-
            06]=20px, py-[large]=16px), same halving rule as this file's
            outer `<section>` padding above -- not Figma's own literal
            mobile spec (a flat 16px). */}
        <div className="flex flex-col gap-[var(--density-spacing-fixed-small)] rounded-[var(--semantic-border-radius-generous)] bg-[var(--color-intent-primary-strong)] px-[var(--primitives-ref-space-06)] py-[var(--density-spacing-fixed-large)] md:px-[var(--primitives-ref-space-09)] md:py-[var(--density-spacing-fixed-xxx-large)] min-[1014px]:w-[374px] min-[1014px]:shrink-0">
          <p className="text-[length:var(--semantic-content-common-font-size)] leading-[length:var(--semantic-content-common-line-height)] font-[number:var(--semantic-content-common-font-weight)] text-[color:var(--semantic-content-common-text-color-reverse)]">
            Our services include:
          </p>
          <ul className="flex flex-col gap-[var(--density-spacing-fixed-small)] md:gap-[var(--density-spacing-fixed-large)]">
            {SERVICES.map((service) => (
              <li
                key={service}
                className="flex gap-[var(--density-spacing-fixed-small)]"
              >
                {/* Same color as the item text itself (see that span's own
                    color comment below) -- both read from one shared
                    variable so they can never drift apart. */}
                <span
                  aria-hidden
                  className="text-[color:var(--primitives-ref-color-gold-800)]"
                >
                  •
                </span>
                {/* Mobile: Common (16/24/400), same as every other body
                    copy on this card. Desktop (md+): matches Figma's own
                    20px/30px-line-height/600-weight combo -- the same
                    size/line-height as "Subheading" (reused via its
                    tokens) but at a 600 weight override Figma applies only
                    here, not the style's own default 525, so the weight
                    itself is hardcoded rather than reaching for a
                    nonexistent "Subheading, but bold" token. Color: no
                    semantic token models this exact gold-800 tint as a
                    *text* color -- the one same-value semantic token
                    (`color-layout-background-color-primary-level-1`) is a
                    background token for an unrelated light-mode surface,
                    and reusing it here risks an unrelated future retheme
                    of that surface silently recoloring this text -- so
                    this falls back to the primitive
                    (`primitives-ref-color-gold-800`) instead. */}
                <span className="text-[length:var(--semantic-content-common-font-size)] leading-[length:var(--semantic-content-common-line-height)] font-[number:var(--semantic-content-common-font-weight)] text-[color:var(--primitives-ref-color-gold-800)] md:text-[length:var(--semantic-content-subheading-font-size)] md:leading-[length:var(--semantic-content-subheading-line-height)] md:font-[600]">
                  {service}
                </span>
              </li>
            ))}
          </ul>
        </div>
        {/* Hidden below `md` -- Figma's own mobile frame has no image node
            at all (see this file's own top comment), not a breakpoint this
            component invented. `aspect-[696/427]` matches the source
            photo's own crop (1186x727, the same ~1.63:1 ratio), so it keeps
            its own proportions rather than the intrinsic image size
            dictating a differently-cropped result at in-between widths --
            same `aspect-ratio`-over-fixed-height reasoning as Start.tsx's
            own hero image.

            `min-w-0`: at 1014px+ this is a flex row item next to the
            374px-fixed services panel, and a flex item's `min-width`
            defaults to `auto` (its content's intrinsic size) rather than
            `0` -- for a replaced element like `<img>` that intrinsic size
            is the source photo's own native 1186px width, which silently
            floors how far the browser will ever actually shrink it,
            overflowing this card at any container width narrower than
            ~1186px + the panel/gap/padding around it. `min-w-0` removes
            that floor so the image shrinks freely with the row instead
            (per modern-web-guidance's own flex-item min-size guidance) --
            confirmed this is what the user meant by "responsive... shrinks
            with the containing element," not just the `sizes`/`srcSet`
            resolution `w-full` alone already handled.

            `sizes`: `696px` was this card's *own* width at the single
            widest point (1214px page content), which overstated every
            narrower rendered width and made the browser fetch a bigger
            source than actually displayed once the image itself started
            shrinking below that -- this uses the row's real available
            width per range instead (matching the JSX's own `md:max-
            [1013px]:`/`min-[1014px]:` tiers just above): at 1014px+ the
            image shares the row with the 374px panel + 48px gap, both
            sides of the card's own 48px padding (374+48+48+48=518); from
            768-1013px it's the full stacked-card width, just the card's
            own 48px padding on each side (96). */}
        <img
          src={investmentServicesImage}
          srcSet={investmentServicesImageSrcset}
          sizes="(min-width: 1014px) calc(100vw - 518px), (min-width: 768px) calc(100vw - 96px), 0px"
          alt=""
          className="hidden aspect-[696/427] w-full min-w-0 rounded-[var(--semantic-border-radius-generous)] object-cover md:block"
        />
      </div>
    </section>
  );
}
