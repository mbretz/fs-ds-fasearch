import { Link, Button, Separator } from 'ds';
import { Phone } from 'icons';
import type { Advisor, Location } from '../../data/locations';
import { EntityPortrait } from '../entity-info/EntityPortrait';
import { TenureLine } from '../entity-info/TenureLine';
import { StatusTag } from '../entity-info/StatusTag';
import { FavoriteToggle } from '../entity-info/FavoriteToggle';
import { EntityActions } from '../entity-info/EntityActions';
import { getFullName } from '../../utils/getFullName';
import { useSession } from '../../session/useSession';
import { useStuckSentinel } from '../../hooks/useStuckSentinel';
import { cn } from '../../utils/cn';

export interface AdvisorHeroProps {
  advisor: Advisor;
  location: Location;
  onNewClientInquiry?: () => void;
  /** Applied to the desktop rendering's own root -- e.g. the page's grid
   * placement classes. The mobile rendering has no single root of its own
   * (see AdvisorHeroMobile's own comment), so it isn't a target here. */
  className?: string;
}

function noop() {}

// `tel:` strips everything but digits/leading `+` -- the display string
// itself (e.g. "(555) 850-1313") stays untouched.
function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

// Neither a real <a> nor DS `Link` has a native `disabled` attribute, so
// this fakes it the same way ContactLinks.tsx/OfficeDetailsPanel.tsx/
// Start.tsx/SiteHeader.tsx/ProspectPortal do for every other not-really-
// wired-up destination in this app: an inert `href="#"`, aria-disabled,
// tabIndex -1, onClick preventDefault, and a `cursor-not-allowed`
// override. Per the user, HeroContent's own phone link now uses this
// treatment too -- an earlier version deliberately left it as real
// `tel:` navigation, called out as the one intentional exception in
// this prototype, but that's since been reversed.
function preventDisabledClick(event: { preventDefault: () => void }) {
  event.preventDefault();
}

// Shared accreditations/tenure/phone/favorite/status-tag content block --
// Figma's "Hero Content" component set (`421:6194`), Device=Desktop and
// Device=Mobile variants only differ in the caller's own left offset/width
// plus the StatusTag's own `sm` (mobile, condensed) vs `lg` (desktop) size,
// not in the rest of the content.
function HeroContent({
  advisor,
  phone,
  showFavorite,
  fullName,
  tagSize = 'lg',
  showPhoneLink = true,
  className,
}: {
  advisor: Advisor;
  phone?: string;
  showFavorite: boolean;
  fullName: string;
  tagSize?: 'sm' | 'lg';
  /** Set false once EntityActions' own primary button is also visible
   * alongside this content (currently just AdvisorHeroMobile's expanded
   * state) -- per the user, that button already surfaces the same phone
   * number (with the same phone icon, see its own `primaryIcon` comment),
   * so showing it a second time here read as redundant. Desktop has no
   * actions row, so this stays true (the default) there. */
  showPhoneLink?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-[var(--density-spacing-fixed-small)]',
        className,
      )}
    >
      {advisor.designations.length > 0 && (
        <span className="text-[18px] leading-none font-medium text-[color:var(--semantic-content-common-text-color-default)]">
          {advisor.designations.join(', ')}
        </span>
      )}
      <TenureLine years={advisor.tenureYears} />
      {phone && showPhoneLink && (
        <div className="flex items-center gap-[var(--density-spacing-fixed-x-small)]">
          <Phone
            aria-hidden="true"
            className="size-[var(--density-sizing-fixed-large)] shrink-0 text-[color:var(--component-link-text-color-default)]"
          />
          <Link
            href="#"
            aria-disabled="true"
            tabIndex={-1}
            onClick={preventDisabledClick}
            className="cursor-not-allowed"
          >
            {phone}
          </Link>
        </div>
      )}
      {/* Always mounted (not `showFavorite && <FavoriteToggle />`), so
          signing in/out animates rather than instantly inserting/removing
          this row and jumping StatusTag below it -- per the user, they're
          fine with a non-Baseline technique here since an instant jump is
          still a perfectly fine fallback. `calc-size()`/`interpolate-size`
          (modern-web-guidance's `animate-to-intrinsic-sizes` guide) is
          Chrome/Edge-only; unsupported browsers just keep today's instant
          toggle, `[block-size:0]`/`[block-size:auto]` applying with no
          transition. `interpolate-size: allow-keywords` is scoped to this
          one wrapper (not `:root`), since nothing else in this app needs
          it.

          `mt-0` / `mt-[-1*gap]` is load-bearing, not decorative -- this
          flex column spaces every child via `gap` (this block's own
          `gap-[var(--density-spacing-fixed-small)]` above), which still
          applies on BOTH sides of this wrapper even when its own
          `block-size` collapses to 0 (gap doesn't collapse just because
          an item's content does). Left alone, collapsed state would show
          gap+gap = 16px between the phone link and StatusTag instead of
          the original unmounted look's single 8px gap. Animating this
          wrapper's own `margin-top` to `-1 * gap` alongside `block-size`
          cancels exactly one of those two gaps, landing back on the
          original single-gap spacing once fully collapsed.

          `inert` (not just `aria-hidden`) removes the toggle from the tab
          order and blocks any interaction while collapsed -- `aria-hidden`
          alone hides it from assistive tech but doesn't stop a sighted
          keyboard user from tabbing into an invisible, zero-height
          control. `motion-reduce:transition-none` per the guide's own
          MANDATORY accessibility note. */}
      <div
        aria-hidden={!showFavorite}
        inert={!showFavorite}
        className={cn(
          // `flex items-center` -- without it, this plain block div puts
          // its `inline-flex` FavoriteToggle button into an anonymous
          // inline formatting context, which pads it with the classic
          // baseline/descender gap inline content gets below itself (the
          // same phantom-whitespace effect `inline-block` images/buttons
          // are known for). That both misaligns the button within this
          // wrapper and inflates the wrapper's own `auto` height beyond
          // the button's real content height. `flex` removes the inline
          // formatting context entirely; `items-center` then centers the
          // button within whatever height remains.
          'flex items-center [interpolate-size:allow-keywords] overflow-hidden transition-[block-size,opacity,margin-top] duration-300 ease-in-out motion-reduce:transition-none',
          showFavorite
            ? '[block-size:auto] mt-0 opacity-100'
            : '[block-size:0] mt-[calc(-1*var(--density-spacing-fixed-small))] opacity-0',
        )}
      >
        <FavoriteToggle
          name={fullName}
          showLabel
          // `tagSize` already doubles as this content block's one "which
          // device" signal (`lg` desktop / `sm` mobile) -- reusing it here
          // instead of threading a second, separate prop through every
          // caller for the same distinction. Matches Figma's own
          // Favorited=False/True, Device=Desktop|Mobile variants (node
          // 1302:48177) -- see FavoriteToggle.tsx's own comment.
          variant={tagSize === 'lg' ? 'expanded' : 'compact'}
          className="text-[color:var(--component-link-text-color-default)]"
        />
      </div>
      <StatusTag
        status={advisor.newClientStatus}
        size={tagSize}
        className="mt-[var(--density-spacing-fixed-small)]"
      />
    </div>
  );
}

function GoldUnderline({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'block h-[4px] w-[120px] bg-[color:var(--semantic-brand-primary-gold)]',
        className,
      )}
    />
  );
}

// Desktop: static banner + content, no scroll collapse -- Figma's
// Hero-FA (`8:5274`) has no Collapsed/Actionable variant, unlike the
// mobile-only Hero-FA-Mobile component set.
function AdvisorHeroDesktop({
  advisor,
  phone,
  signedIn,
  fullName,
  showsNewClientInquiry,
  onNewClientInquiry,
  className,
}: {
  advisor: Advisor;
  phone?: string;
  signedIn: boolean;
  fullName: string;
  showsNewClientInquiry: boolean;
  onNewClientInquiry?: () => void;
  className?: string;
}) {
  return (
    <div className={cn('hidden md:block', className)}>
      {/* One combined grid (not two stacked banner/content-below blocks)
          so the portrait can span both rows and visually overlay past
          the (short, name-driven) banner row into the row below, per the
          user -- same `items-start` + row-span technique AdvisorProfile.tsx
          already uses for its rail panel overlapping up into the Hero's
          own row (see that page's own comment): a row-spanning item
          doesn't stretch the rows it spans to fit its own height when
          `items-start` (not the grid default `stretch`) is set, so each
          row's height stays driven only by whichever *non-spanning* item
          occupies it -- the name/underline text below for row 1, and
          `HeroContent` for row 2 -- letting the (usually taller) portrait
          overflow past row 1's bottom edge instead of forcing it taller.
          `--advisor-hero-portrait-size`/`--advisor-hero-gutter` are
          declared on AdvisorProfile.tsx's own page-level grid, not here
          -- see that file's own comment for the full reasoning (the rail
          panel needs to read `--advisor-hero-gutter` too, and custom
          properties only inherit down to descendants, not across
          siblings, so a shared ancestor is required). Short version:
          both are a flat 188px/40px (this banner's original fixed
          values, "no rail present" state) below that file's own
          container-query threshold, and a `clamp()`'d fluid value above
          it (rail present, needs the extra room these free up).
          `grid-cols-[calc(var(--advisor-hero-gutter)+var(...))_1fr]`
          bakes the (flat-or-fluid) left inset into column 1's own width
          (see the portrait's own `ml` comment) -- so the dark background
          item below, which spans both columns, still reaches the
          container's true left edge instead of being inset by it too.
          `gap-x-[var(--advisor-hero-gutter)]` is the portrait-to-text
          gap, sharing the same value as the left inset. */}
      <div className="relative grid grid-cols-[calc(var(--advisor-hero-gutter)+var(--advisor-hero-portrait-size))_1fr] items-start gap-x-[var(--advisor-hero-gutter)]">
        {/* Decorative background only -- no content of its own, so it
            has no intrinsic height to contribute to row 1's auto-sizing.
            `self-stretch` (overriding the grid's own `items-start`)
            fills whatever height row 1 ends up with once the *other*
            row-1 occupant (the name/underline block below) sets it,
            rather than collapsing to 0 like an empty item normally
            would under `items-start`. `col-span-2` reaches the true
            right edge too (not just column 1) since this item has no
            padding of its own reducing its box -- the rail clearance
            below is on the TEXT item instead, so the background itself
            is free to run the container's full width, matching the
            original single-div banner's own paint extent.
            `col-start-1` is required alongside `col-span-2`, not
            redundant with it -- confirmed live (Playwright), leaving the
            column start implicit shoved this item into two *newly
            created implicit* columns 3-4 instead of the real 1-2. The
            browser's placement algorithm places every item with BOTH
            axes explicit (the portrait and both text items below, all
            `col-start-N row-start-N`) in an earlier pass than items with
            only a span and no explicit start on one axis (this item,
            row explicit / column only a span) -- regardless of DOM
            order. By the time this item's own placement pass runs,
            columns 1-2 of row 1 are already claimed by the portrait and
            the name text, so auto-placement invents new columns to fit
            it instead of reusing 1-2. */}
        <div
          aria-hidden="true"
          className="col-start-1 col-span-2 row-start-1 self-stretch rounded-[8px] bg-[color:var(--color-response-neutral-strong)]"
        />
        <EntityPortrait
          name={fullName}
          photoUrl={advisor.photoUrl}
          size="xl"
          showBadge={false}
          // `absolute` (not a `row-span-2` grid item, an earlier
          // version of this component) -- confirmed live (Playwright)
          // that a row-spanning grid item's own intrinsic size DOES get
          // distributed into the rows it spans whenever it exceeds
          // their combined natural height, `items-start` notwithstanding
          // -- that's correct, spec-compliant CSS Grid track-sizing
          // behavior (the "increase sizes to accommodate spanning
          // items" step), not a browser quirk, so `items-start` alone
          // never actually guaranteed the "doesn't stretch either row"
          // claim this comment previously made; it just happened not to
          // trigger for THIS banner's own specific numbers (188px
          // portrait + 40px margin = 228px, under row 1+2's combined
          // natural height) until LocationHero.tsx's larger 240px
          // portrait (+40px margin = 280px) exposed it there. `absolute`
          // sidesteps the whole question -- an out-of-flow element
          // makes zero contribution to grid track sizing, full stop, so
          // this is the version that's actually guaranteed correct
          // regardless of content length on either side.
          // `top-[40px] left-[var(--advisor-hero-gutter)]` -- the grid
          // container above is now `relative` (its own padding-box is
          // this element's containing block), and column 1 starts flush
          // at that container's own left edge (x=0, no padding on the
          // grid itself), so these are direct, un-derived offsets: 40px
          // down (per the user, the portrait's own distance from the
          // banner's top edge, independent of the fluid gutter -- see
          // this component's very first live-measured `top` derivation
          // for why a flat value needs no baseline-quirk correction once
          // an item is out of normal flow) and the same gutter value
          // used for column 1's own left inset (so the portrait's own
          // left edge lands exactly at the container's left edge plus
          // that gutter, matching column 1's own start).
          className="absolute top-[40px] left-[var(--advisor-hero-gutter)]"
          // `rounded-full` overrides Avatar's own fixed 80px
          // `--component-avatar-border-radius-associate` token, which only
          // fully clips to a circle up to a 160px box (half-width <= 80px)
          // -- past that (up to 188px) it renders as a rounded square
          // instead.
          //
          // `size-[var(--advisor-hero-portrait-size)]` -- the flat-or-
          // fluid size defined on the page-level grid (see the outer
          // grid's own comment above).
          avatarClassName="size-[var(--advisor-hero-portrait-size)] rounded-full"
        />
        {/* `pr-[32px]` -- below AdvisorProfile.tsx's own container-query
            threshold, the rail panel is hidden entirely and this text
            can run the banner's full width.
            `@[940px]/advisor-hero:pr-[calc(400px+var(--advisor-hero-gutter))]`
            switches to the rail's own fixed 400px column plus the same
            fluid gutter used elsewhere in this banner (its *clearance*
            portion -- the 400px rail column itself never shrinks) once
            that panel is visible again (see AdvisorProfile.tsx's own
            comment for the named container and threshold) -- without
            it, the name would simply run under the rail panel (hidden
            by its higher paint order, see that page's own comment)
            instead of stopping short of it.
            `flex flex-col justify-end` + `pb-[16px]` (no `pt`) -- per
            the user, the name/underline must stay anchored exactly
            16px above the banner's own bottom edge, including when
            `min-h-[125px]` below adds slack beyond the content's own
            natural height. Confirmed live (Playwright) that a plain
            block box with `pt`/`pb` does NOT do this: normal block flow
            has no mechanism pulling content to the bottom, so slack
            from a taller `min-height` lands entirely BELOW the
            `pb`-padded content (pushing the underline's own gap to the
            banner's bottom edge to 40px instead of the intended 16px).
            `justify-end` on a flex column is what actually anchors
            trailing content to the bottom regardless of how much extra
            height the box ends up with, so the former fixed `pt-[32px]`
            was removed entirely -- top spacing is now whatever's left
            over above the content, not a fixed value.
            `min-h-[125px]` -- per the user, the banner should be 24px
            (a real `density-spacing-fixed-xx-large` token) taller than
            its own natural single-line height (101px, confirmed live
            via Playwright) at minimum; a `min-height` on THIS item (not
            the background item, which only stretches to match whatever
            height row 1 ends up with) is what actually grows row 1's
            own auto height to match -- putting it on the background
            item instead would just make it visually overflow past row
            1's real (unchanged) height into row 2's own content below.
            Still just a floor: if the name wraps and needs more than
            125px, this doesn't cap it -- the portrait itself is
            `position: absolute` now (see its own comment above) and
            makes zero contribution to any of this sizing either way. */}
        <div className="col-start-2 row-start-1 flex min-h-[125px] flex-col justify-end pr-[32px] pb-[16px] @[940px]/advisor-hero:pr-[calc(400px+var(--advisor-hero-gutter))]">
          <span className="mb-[4px] block text-[30px] leading-[1.5em] font-semibold text-white">
            {fullName}
          </span>
          <GoldUnderline />
        </div>
        {/* Same conditional `pr` rail clearance as the text item above --
            `col-start-2 row-start-2` places this directly below it,
            sharing the same grid (and so the same column-1 width)
            without needing a second, separately-declared `grid-cols`. */}
        <HeroContent
          advisor={advisor}
          phone={phone}
          showFavorite={signedIn}
          fullName={fullName}
          className="col-start-2 row-start-2 pt-[8px] pr-[32px] pb-[8px] @[940px]/advisor-hero:pr-[calc(400px+var(--advisor-hero-gutter))]"
        />
        {/* `col-start-2 row-start-3` -- a third stacked row, below the
            status tag that ends HeroContent above, sharing the same
            grid (and so the same column-1 width) via implicit row
            auto-sizing, same as AdvisorProfile.tsx's own rail-panel
            row-start-3 below its own threshold.
            Visible below AdvisorProfile.tsx's own 940px container-query
            threshold (`@[940px]/advisor-hero:hidden` hides it again
            at/above that width) -- per the user, once the rail panel
            has moved below the body content (see AdvisorProfile.tsx's
            own comment), these actions appear directly under the status
            tag here too, matching the row AdvisorHeroMobile already
            shows via its own (viewport-width-gated, not container-
            query-gated) `inline` EntityActions instance -- same props/
            orientation, just a different gating mechanism since this
            lives in the desktop tree.
            `[&_.entity-actions-inner]:justify-start` -- per the user,
            left-aligned to match the rest of this column's own flush-
            left content (name, tenure, phone, status tag), instead of
            EntityActions' own default centered row (which suits
            AdvisorHeroMobile's own narrower instance, but would read as
            misaligned in this wider column). The actual `justify-center`
            lives on an inner, non-exposed `.entity-actions-inner` div,
            not the outer element this `className` prop reaches, so a
            plain override here wouldn't touch it -- this arbitrary
            descendant-selector variant targets it directly instead, and
            wins on specificity (a compound selector beats the single-
            class `.justify-center` rule) regardless of stylesheet
            order, unlike the plain-class `cursor-not-allowed` override
            elsewhere in this file that needed `!` for the same reason. */}
        <EntityActions
          primaryLabel={phone ?? 'Call'}
          primaryHref={phone ? telHref(phone) : undefined}
          primaryIcon={<Phone aria-hidden />}
          primaryInert
          onNewClientInquiry={
            showsNewClientInquiry ? (onNewClientInquiry ?? noop) : undefined
          }
          orientation="inline"
          className="col-start-2 row-start-3 mt-[var(--density-spacing-fixed-small)] @[940px]/advisor-hero:hidden [&_.entity-actions-inner]:justify-start"
        />
      </div>
    </div>
  );
}

// Mobile: Hero-FA-Mobile (`421:6266`) -- Expanded, scroll-collapses to a
// sticky compact bar (`View=Collapsed, State=Actionable`). The third Figma
// state (`View=Collapsed, State=Inert`, no action buttons) belongs to the
// New Client Inquiry flow's own header treatment, not scroll -- out of
// scope here (see RESUME_NOTES.txt).
//
// Renders a Fragment, not a wrapping `<div>` -- `position: sticky`'s
// stuck range is bounded by its own DIRECT parent's box, and this
// component's own children (avatar/name/actions) shrink when collapsed.
// A wrapping div here would shrink right along with them, and once
// scrolled past that shrunk box, the sticky bar would have nowhere left
// to stay pinned and would scroll away entirely (confirmed live). Instead
// this relies on whatever real box the *caller* wraps it in (the mobile
// page's own flex column, alongside the body/rail content that follows)
// to stay tall for as long as the page has content below the Hero.
function AdvisorHeroMobile({
  advisor,
  phone,
  signedIn,
  fullName,
  showsNewClientInquiry,
  onNewClientInquiry,
}: {
  advisor: Advisor;
  phone?: string;
  signedIn: boolean;
  fullName: string;
  showsNewClientInquiry: boolean;
  onNewClientInquiry?: () => void;
}) {
  const { sentinelRef, stuck } = useStuckSentinel();

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="md:hidden" />
      <div className="sticky top-0 z-10 md:hidden">
        {stuck ? (
          // Avatar + a "Banner Group" column (name+underline, then Actions
          // below it) -- per Figma's `421:6046`, Actions sits UNDER the
          // name, not beside it; an earlier version put them side by side
          // and crushed the name down to a couple of characters.
          <div className="flex items-end gap-[var(--density-spacing-fixed-xxx-large)] rounded-b-[8px] bg-[color:var(--color-response-neutral-strong)] px-[16px] py-[8px] shadow-[0px_5px_5px_-3px_rgba(13,13,13,0.55),0px_6px_10px_0px_rgba(75,77,78,0.2)]">
            <EntityPortrait
              name={fullName}
              photoUrl={advisor.photoUrl}
              size="lg"
              showBadge={false}
            />
            <div className="flex min-w-0 flex-1 flex-col gap-[var(--density-spacing-fixed-x-small)]">
              <span className="truncate text-[20px] leading-[24px] font-medium text-white">
                {fullName}
              </span>
              <GoldUnderline className="h-[2px] w-[100px]" />
              <div className="flex flex-wrap items-center gap-[var(--density-spacing-fixed-small)] pt-[var(--density-spacing-fixed-large)]">
                {phone && (
                  // Compound API, not the flat `Button` -- `asChild` only
                  // works via `Button.Root` (see EntityActions' own
                  // precedent); the flat component always wraps its own
                  // children in a `Button.Label` span, which trips
                  // Radix Slot's single-child requirement.
                  // Inert (`href="#"`/`aria-disabled`/etc, see
                  // `preventDisabledClick`'s own comment), not real
                  // `tel:` navigation -- per the user, matches
                  // HeroContent's own phone link and the EntityActions
                  // "Call" button below.
                  // `!cursor-not-allowed` -- see EntityActions.tsx's own
                  // `primaryAnchorProps` comment for why a plain
                  // `cursor-not-allowed` alone loses the cascade to
                  // `Button`'s own base `cursor-pointer` class here too.
                  <Button.Root variant="primary" asChild className="min-w-0">
                    <a
                      href="#"
                      aria-disabled="true"
                      tabIndex={-1}
                      onClick={preventDisabledClick}
                      className="!cursor-not-allowed"
                    >
                      <Button.Label>Call</Button.Label>
                    </a>
                  </Button.Root>
                )}
                {showsNewClientInquiry && (
                  <Button
                    variant="secondary"
                    onClick={onNewClientInquiry ?? noop}
                    className="min-w-0"
                  >
                    New Client Inquiry
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          // `pl-[calc(48px+clamp(104px,calc(-122.12px+40.38vw),188px))]`
          // -- per the user, the portrait fluidly scales between the
          // mobile breakpoint's own top edge (767px-ish, just below
          // `md`) and 560px, from a 188px ceiling (matching the desktop
          // Hero's own full size, for continuity across the md-breakpoint
          // switchover -- desktop's own portrait sits flat at 188px
          // through that whole range too, see AdvisorProfile.tsx's own
          // comment) down to a 104px floor (this banner's own original,
          // pre-existing flat size at `xl` -- confirmed live via
          // Playwright, matching Avatar's real `component-avatar-size-
          // x-large` token). Below 560px, this clamp()'s own floor value
          // (104px) exactly reproduces the ORIGINAL unscaled layout
          // unchanged, and the separate, pre-existing `max-[390px]:`
          // step down to 80px still overrides it below THAT breakpoint,
          // untouched by this change.
          // `clamp()`'s linear term was fit against two points: (768px
          // viewport, 188px) and (560px viewport, 104px) -- slope =
          // 84px/208px = 40.38 per 100vw (i.e. `40.38vw`); intercept
          // solved from either point. Plain viewport `vw` units, not
          // `cqi`/a container query, since this banner's own width is
          // already just the viewport minus SiteShell's fixed page
          // padding -- no nested-container precision is needed here,
          // matching this file's own PRE-EXISTING `max-[390px]:` viewport
          // breakpoints rather than introducing a new mechanism.
          // `48px` = the 16px left inset (per the user, unchanged from
          // the original design) plus the 8px avatar border (`box-
          // content`, added outside the `size-[...]` value) plus the
          // 24px gap to the text column (all three unchanged from the
          // original fixed 152px value's own math) -- so this formula
          // reproduces the *exact* original 152px at the clamp's own
          // 104px floor (48+104=152) and grows from there as the
          // portrait does.
          // No `min-h` here, deliberately -- an earlier version of this
          // container sized itself to fully contain the portrait (up to
          // 188px tall), which made the banner itself balloon up to ~212px
          // near the top of this fluid range even though the name/
          // underline it actually holds only need ~62px (pt-16 + 24px
          // line-height + mb-4 + 2px underline + pb-16), per the user.
          // Matching `AdvisorHeroDesktop`'s own precedent instead (see its
          // `min-h-[125px]` comment above): the portrait stays
          // `position: absolute` and is allowed to overflow past this
          // banner's own natural, text-driven height, same as it already
          // does past the container's top edge above. The clearance that
          // overflow needs isn't reserved here -- see the `!stuck` block
          // below's own `mt` comment for where it actually goes.
          <div className="relative bg-[color:var(--color-response-neutral-strong)] pt-[16px] pr-[var(--density-layout-fixed-large)] pb-[16px] pl-[calc(48px+clamp(104px,calc(-122.12px+40.38vw),188px))] max-[390px]:pl-[112px]">
            <EntityPortrait
              name={fullName}
              photoUrl={advisor.photoUrl}
              size="xl"
              showBadge={false}
              // Measured live (Playwright bounding boxes), same reasoning
              // as the desktop avatar's own `top-[10px]` comment above --
              // this wrapper's containing-block top sits ~18px below the
              // container's own `pt-[16px]` due to the same inline-baseline
              // quirk. `top-[-18px]` lands its top edge flush with the
              // container's own `pt-[16px]` (per the user) rather than
              // the name text's own top, which sits ~8px lower -- this
              // one does NOT need to vary with the portrait's own fluid
              // size, since it positions a corner, not a center (same
              // reasoning as the desktop Hero's own `mt-[40px]`).
              //
              // `size-[clamp(...)]` -- the same fluid expression as the
              // container's own `pl` above (see its comment for the
              // derivation).
              //
              // `left-[calc(-32px-clamp(...))]` -- this wrapper's
              // containing block sits at the container's own `pl` (the
              // text column's start, per the same quirk as `top`), so
              // this offset pulls the portrait left from there by (its
              // own current size + 32px), which always lands its own
              // left edge exactly 16px from the container's left edge
              // regardless of the portrait's current fluid size (`pl` -
              // offset = (48+size) - (32+size) = 16) -- same derivation
              // pattern as the desktop Hero's own `ml`/`pl` pair.
              //
              // `max-[390px]:left-[-96px] max-[390px]:size-[...]` --
              // unchanged from the original design; still overrides the
              // fluid values above below 390px, per the user.
              //
              // `rounded-full` -- same reasoning as the desktop Hero's
              // own override: Avatar's default `--component-avatar-
              // border-radius-associate` token only fully clips to a
              // circle up to a 160px box; this fluid range now goes as
              // wide as 188px (confirmed live -- without this, the
              // portrait visibly loses its circular clipping at the
              // wider end of the range), so it needs the same explicit
              // override this component previously didn't, since its
              // original flat 104px ceiling never exceeded 160px.
              avatarClassName="absolute top-[-18px] left-[calc(-32px-clamp(104px,calc(-122.12px+40.38vw),188px))] size-[clamp(104px,calc(-122.12px+40.38vw),188px)] rounded-full max-[390px]:left-[-96px] max-[390px]:size-[var(--component-avatar-size-large)]"
            />
            <span className="mb-[4px] block truncate text-[20px] leading-[24px] font-medium text-white">
              {fullName}
            </span>
            <GoldUnderline className="h-[2px] w-[100px]" />
          </div>
        )}
      </div>
      {!stuck && (
        // `-mt-[var(--density-layout-fixed-large)]` cancels out the page's
        // own `gap-y-[var(--density-layout-fixed-large)]` (16px) -- this
        // Fragment's children render as direct flex items of
        // AdvisorProfile's mobile flow column (see that page's own comment
        // on why AdvisorHero can't wrap them in a div), so that gap-y
        // already puts 16px between the banner above and this block,
        // before this block's own `pt-[8px]` adds on top of it. Without
        // the cancel, the designations/etc. sat 24px below the banner
        // instead of the intended 8px. (The portrait's own overflow past
        // the banner above needs separate clearance too, but that's
        // reserved further down, right above the Separator -- see its own
        // comment -- rather than here, so it doesn't also push the
        // designations/tenure text away from its own fixed 8px gap.)
        <div className="-mt-[var(--density-layout-fixed-large)] max-[360px]:mt-[-2px] pr-[var(--density-layout-fixed-large)] max-[360px]:pr-[var(--density-spacing-fixed-xxx-large)] md:hidden">
          {/* `max-[360px]:pl-[var(--density-spacing-fixed-xxx-large)]` (32px)
              matches EntityActions' own block-orientation inset just below
              -- its fixed-floor `mx-large` (16px) plus its spacer's own
              unshrunk `large` basis (16px) add up to the same 32px, per the
              user.
              Base `pl` is the same fluid expression as the banner above
              (see its own comment for the derivation) -- keeps this
              row's content aligned to the same portrait-driven text
              column start; `max-[390px]:`/`max-[360px]:` overrides are
              unchanged from the original design. */}
          <div className="pt-[8px] pb-[8px] pl-[calc(48px+clamp(104px,calc(-122.12px+40.38vw),188px))] max-[390px]:pl-[112px] max-[360px]:pl-[var(--density-spacing-fixed-xxx-large)]">
            <HeroContent
              advisor={advisor}
              phone={phone}
              showFavorite={signedIn}
              fullName={fullName}
              tagSize="sm"
              // EntityActions' own primary button below already shows
              // this same phone number -- see `showPhoneLink`'s own
              // doc comment.
              showPhoneLink={false}
            />
          </div>
          {/* EntityActions' own block-orientation buttons sit inset 32px
              (`fixed-xxx-large`) from ITS OWN box edge (a 16px `shrink
              basis` spacer plus a 16px `mx-large` on the button column,
              stacked). This wrapper's own `pr-[layout-fixed-large]`
              (16px) then adds the same extra 16px on the right for both
              the Separator and the buttons below it, which is why the
              two sides land asymmetric relative to true page edges --
              that mismatch already existed on the buttons before this
              Separator was added.
              `mx-[fixed-xx-large]` (24px) -- 8px *less* than the
              buttons' own 32px inset, per the user, so the divider
              extends 8px past the buttons on each side instead of
              lining up flush with them, reading as the buttons being
              inset from the divider rather than matching its own width.
              `w-auto` overrides Separator's own default `w-full`, per
              AdvisorCard's own precedent comment -- `w-full` sizes to
              100% of the container and then the `mx-*` margins push it
              past the right edge instead of being subtracted from the
              width, leaving the left margin visible but not the right
              one.
              `max(0px, calc(...))` added onto the base `mt` -- the
              designations/tenure block above is a fixed height regardless
              of viewport, while the portrait above the banner keeps
              growing with this range's own fluid clamp (see the banner's
              own comment on why it isn't reserved there instead) -- so
              only past a certain width does the portrait's bottom edge
              actually reach this far down. `166px` was originally derived
              as 190px (an early live measurement of `separatorTop`, since
              corrected -- see below) minus the portrait's own `20px`
              fixed offset from the banner's top (`16px` top inset + `4px`
              box-content border); `max(0px, ...)` keeps this a no-op
              everywhere the natural gap already clears it, including the
              whole flat-size range below 560px and the separate
              `max-[390px]:` flat-80px portrait, both deeply negative
              here. This is also this banner's real defense for the
              "tenure/designations hidden" case flagged when this was
              reported -- today's fixture data always renders both, so
              this clearance is never actually needed for that reason, but
              if a future advisor record omits them, this still guarantees
              the Separator/Actions row can't ride up into the portrait,
              independent of how short the content above it gets.

              Re-measured live (Playwright) at /advisor/adv-16 after a
              user-reported ~4px overlap at 730px width: the original
              170px constant left a flat, width-independent 4px of
              overlap across the whole active range once the portrait's
              growth outpaced this margin (confirmed at 715/730/745/760/
              767px -- 0px or negative below ~715px, a flat +4px from
              ~730px on). Since both the portrait's bottom edge and this
              margin grow at the exact same 1:1 rate once both are past
              their own thresholds, the overlap in that regime is a pure
              width-independent constant equal to (this constant - actual
              live-measured clearance need) -- so subtracting the
              measured 4px overlap directly from the old 170px constant
              (166px) cancels it exactly, with no re-derivation of the
              190px/20px inputs required. Re-verify live if this banner's
              content block (designations/tenure/phone/favorite) or the
              portrait's own clamp() range ever changes. */}
          <Separator className="mx-[var(--density-spacing-fixed-xx-large)] mt-[calc(var(--density-spacing-fixed-small)+max(0px,calc(clamp(104px,calc(-122.12px+40.38vw),188px)-166px)))] w-auto" />
          {/* Two EntityActions instances, toggled by viewport width, not
              one -- per the user, this row should be `inline` (side by
              side, or wrapped via that variant's own internal
              `@container/entity-actions` stacking, see EntityActions.tsx's
              own comment) from the top of this mobile range (the `md`
              breakpoint, 768px, above which AdvisorHeroDesktop takes
              over) down to 500px, and only `orientation="block"` (this
              component's own always-stacked treatment, with its own
              distinct spacer/margin styling) below that. `orientation`
              is a single literal prop, not itself responsive, and the
              two modes render genuinely different DOM (block's own
              spacer divs vs. inline's own container-query wrapper), so
              a plain CSS breakpoint swap on one shared instance isn't
              possible -- rendering both and toggling visibility is. */}
          <EntityActions
            primaryLabel={phone ?? 'Call'}
            primaryHref={phone ? telHref(phone) : undefined}
            primaryIcon={<Phone aria-hidden />}
            primaryInert
            onNewClientInquiry={
              showsNewClientInquiry ? (onNewClientInquiry ?? noop) : undefined
            }
            orientation="inline"
            className="hidden min-[500px]:block mt-[var(--density-spacing-fixed-small)]"
          />
          <EntityActions
            primaryLabel={phone ?? 'Call'}
            primaryHref={phone ? telHref(phone) : undefined}
            // Matches HeroContent's own phone icon just above (and
            // Start.tsx's own `Button.Icon` precedent for a bare,
            // unsized icon in that slot) -- per the user.
            primaryIcon={<Phone aria-hidden />}
            // Inert, not real `tel:` navigation -- per the user, matches
            // HeroContent's own phone link and the stuck sticky bar's
            // own "Call" button above.
            primaryInert
            onNewClientInquiry={
              showsNewClientInquiry ? (onNewClientInquiry ?? noop) : undefined
            }
            orientation="block"
            className="min-[500px]:hidden mt-[var(--density-spacing-fixed-small)]"
          />
        </div>
      )}
    </>
  );
}

export function AdvisorHero({
  advisor,
  location,
  onNewClientInquiry,
  className,
}: AdvisorHeroProps) {
  const { signedIn } = useSession();
  const phone = advisor.phone ?? location.phone;
  const showsNewClientInquiry =
    advisor.newClientStatus === 'accepting' ||
    advisor.newClientStatus === 'waitlist';
  const fullName = getFullName(advisor);

  return (
    <>
      <AdvisorHeroDesktop
        advisor={advisor}
        phone={phone}
        signedIn={signedIn}
        fullName={fullName}
        showsNewClientInquiry={showsNewClientInquiry}
        onNewClientInquiry={onNewClientInquiry}
        className={className}
      />
      <AdvisorHeroMobile
        advisor={advisor}
        phone={phone}
        signedIn={signedIn}
        fullName={fullName}
        showsNewClientInquiry={showsNewClientInquiry}
        onNewClientInquiry={onNewClientInquiry}
      />
    </>
  );
}
