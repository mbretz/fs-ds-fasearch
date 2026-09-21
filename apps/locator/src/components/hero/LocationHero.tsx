import type { Location } from '../../data/locations';
import { EntityPortrait } from '../entity-info/EntityPortrait';
import { useStuckSentinel } from '../../hooks/useStuckSentinel';
import { cn } from '../../utils/cn';
import { splitAddressLines } from '../../utils/splitAddressLines';

export interface LocationHeroProps {
  location: Location;
  /** Applied to the desktop rendering's own root -- see AdvisorHero's
   * own doc comment on why the mobile rendering has no equivalent. */
  className?: string;
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

// "At this Edward Jones branch:" line items -- Figma's Hero-Location
// (`327:4043`) hardcodes 3 text slots (advisors / admin staff / senior
// admin staff), each independently hideable; derived here from the real
// staff roster instead of literal Figma defaults.
function branchLineItems(location: Location) {
  const adminCount = location.supportStaff.filter(
    (staff) => staff.title === 'Branch Office Administrator',
  ).length;
  const seniorAdminCount = location.supportStaff.filter(
    (staff) => staff.title === 'Senior Branch Office Administrator',
  ).length;

  return [
    `${location.advisors.length} Financial Advisor${location.advisors.length === 1 ? '' : 's'}`,
    adminCount > 0 ? `${adminCount} Administrative Staff` : undefined,
    seniorAdminCount > 0
      ? `${seniorAdminCount} Senior Administrative Staff`
      : undefined,
  ].filter((line): line is string => Boolean(line));
}

function BranchLineItems({
  location,
  className,
}: {
  location: Location;
  className?: string;
}) {
  const lines = branchLineItems(location);
  return (
    <div
      className={cn(
        'flex flex-col gap-[var(--density-spacing-fixed-small)]',
        className,
      )}
    >
      <span className="text-[16px] leading-[1.5em] font-medium text-[color:var(--semantic-content-common-text-color-default)]">
        At this Edward Jones branch:
      </span>
      {lines.map((line) => (
        <span
          key={line}
          className="text-[16px] leading-[1.5em] font-medium text-[color:var(--semantic-content-common-text-color-default)]"
        >
          {'  - '}
          {line}
        </span>
      ))}
    </div>
  );
}

// Desktop: static banner + content, no scroll collapse (see AdvisorHero's
// own comment on why -- same reasoning applies here).
function LocationHeroDesktop({
  location,
  className,
}: {
  location: Location;
  className?: string;
}) {
  // Split into street / city-state-zip and rendered over two lines via a
  // real `<br />` (matching LocationCard's own `NameBlock` heading
  // treatment), not left to wrap naturally -- per the user, the address
  // should always be at least two lines. This also makes the banner's own
  // height deterministic instead of varying with how a single un-split
  // line happens to wrap at a given width, which is what the mobile
  // below-banner spacing fix (see this file's `LocationHeroMobile`
  // comment) actually needs.
  const { street, cityStateZip } = splitAddressLines(location.address);
  return (
    <div className={cn('hidden md:block', className)}>
      {/* CSS Grid for the background/text columns, but the portrait
          itself is `position: absolute` (NOT a row-spanning grid item)
          -- matching AdvisorHero.tsx's own desktop treatment, see that
          file's own comment for the full reasoning. Short version: a
          row-spanning grid item's own intrinsic size gets distributed
          into the rows it spans whenever it exceeds their combined
          natural height (spec-compliant CSS Grid track-sizing, not a
          quirk), which `items-start` does NOT prevent -- confirmed live
          (Playwright) that this banner's own 240px portrait (+40px
          margin = 280px) exceeded row 1+2's combined natural height and
          inflated the background/banner height well past what the
          address text alone needed. `position: absolute` sidesteps this
          entirely (zero contribution to grid track sizing), so it's the
          version that's actually guaranteed correct regardless of
          content length.
          `--location-hero-portrait-size` is declared on
          LocationProfile.tsx's own page-level grid, not here -- same
          reasoning as AdvisorHero.tsx's own (the rail panel needs to
          read it too, and it's a sibling, not a descendant). Flat 240px
          (this banner's original fixed size) below that file's own
          container-query threshold; a `clamp()`'d fluid value down to a
          180px floor above it. Left inset (40px) and the portrait-to-
          text gap (32px) stay FIXED here, unlike AdvisorHero's own
          gutter -- there's no status-tag-style pill in this banner's
          content that forced gutters to shrink too, so keeping this
          simpler (only the portrait itself is fluid) was the more
          proportionate port, per the user. */}
      <div className="relative grid grid-cols-[calc(40px+var(--location-hero-portrait-size))_1fr] items-start gap-x-[32px]">
        {/* Decorative background only -- see AdvisorHero.tsx's own
            comment for the full reasoning (no intrinsic height of its
            own, `self-stretch` fills row 1's real height, `col-start-1`
            is required alongside `col-span-2` to avoid the same
            implicit-column placement bug documented there). */}
        <div
          aria-hidden="true"
          className="col-start-1 col-span-2 row-start-1 self-stretch rounded-[8px] bg-[color:var(--color-response-neutral-strong)]"
        />
        <EntityPortrait
          name={location.name}
          photoUrl={location.officePhotoUrl}
          variant="entity"
          size="xl"
          // `top-[40px] left-[40px]` -- same reasoning as AdvisorHero.tsx's
          // own portrait (see its own comment for the full derivation);
          // the grid container above is now `relative` (its own padding-
          // box is this element's containing block), column 1 starts
          // flush at that container's own left edge, so these are
          // direct offsets, not derived from anything fluid (the left
          // inset here is a fixed 40px, see this function's own top
          // comment on why it isn't tied to a shrinking gutter).
          // `rounded-[4px]`, not `rounded-full` -- this shape has no
          // circularity concern as size changes (unlike AdvisorHero's
          // circular avatar, which needed an explicit `rounded-full`
          // override once its own fluid range exceeded 160px), so no
          // equivalent override is needed here regardless of size.
          className="absolute top-[40px] left-[40px]"
          avatarClassName="size-[var(--location-hero-portrait-size)] rounded-[4px]"
        />
        {/* `pr-[32px]` default / `@[940px]/location-hero:pr-[440px]`
            override -- same reasoning as AdvisorHero.tsx's own text
            item (see its own comment): below LocationProfile.tsx's own
            container-query threshold the rail panel is hidden (moved
            below, see that file's comment) and this text runs the
            banner's full width; at/above it, the rail's 400px column
            plus a 40px clearance is reserved instead.
            `flex flex-col justify-end` + `pb-[16px]` (no `pt`) -- same
            reasoning as AdvisorHero.tsx's own text item (see its own
            comment): the address/underline must stay anchored exactly
            16px above the banner's own bottom edge even when
            `min-h-[148px]` below adds slack -- a plain block box's
            `pt`/`pb` alone does NOT do this (confirmed live there), so
            `justify-end` is what actually anchors it regardless of how
            much extra height the box ends up with.
            `min-h-[148px]` -- same reasoning as AdvisorHero.tsx's own
            `min-h-[125px]` (see its own comment), but per the user this
            banner needed "a bit more" than that flat +24px bump: this
            address always renders as (at least) two lines already (the
            street/city-state-zip split, see this component's own top
            comment), unlike AdvisorHero's single-line name, so the
            extra headroom here is +32px (this banner's own natural
            116px height, confirmed live via Playwright, plus a real
            `density-spacing-fixed-xxx-large` token) rather than +24px
            -- still just a floor, not a cap, if the address wraps
            further. */}
        <div className="col-start-2 row-start-1 flex min-h-[148px] flex-col justify-end pr-[32px] pb-[16px] @[940px]/location-hero:pr-[440px]">
          <span className="mb-[4px] block text-[20px] leading-[30px] font-medium text-white">
            {street}
            <br />
            {cityStateZip}
          </span>
          <GoldUnderline />
        </div>
        {/* Same conditional `pr` as the text item above -- `col-start-2
            row-start-2` places this directly below it, sharing the same
            grid (and so the same column-1 width). */}
        <BranchLineItems
          location={location}
          className="col-start-2 row-start-2 pt-[8px] pr-[32px] pb-[8px] @[940px]/location-hero:pr-[440px]"
        />
      </div>
    </div>
  );
}

// Mobile: Hero-Branch-Mobile (`426:1980`) -- Expanded, scroll-collapses to
// a plain compact bar. Unlike AdvisorHero's mobile collapse, Location
// never has action buttons (per the user, its collapsed treatment always
// matches Hero-FA-Mobile's button-less "Inert" state) so the collapsed bar
// here has no elevation/rounded-corner card styling either -- it's a flush
// continuation of the same dark banner, just shorter.
//
// Renders a Fragment, not a wrapping `<div>` -- see AdvisorHeroMobile's
// own comment for why (same sticky-confinement reasoning applies here).
function LocationHeroMobile({ location }: { location: Location }) {
  const { sentinelRef, stuck } = useStuckSentinel();
  // See LocationHeroDesktop's own comment -- same two-line treatment,
  // but only for the expanded (`!stuck`) banner below. The collapsed
  // sticky bar's `truncate` is a deliberate single-line ellipsis instead
  // (not enough room for two lines in that compact state), so it keeps
  // using the raw `location.address` untouched.
  const { street, cityStateZip } = splitAddressLines(location.address);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="md:hidden" />
      <div className="sticky top-0 z-10 md:hidden">
        {stuck ? (
          <div className="flex items-end gap-[var(--density-spacing-fixed-xxx-large)] bg-[color:var(--color-response-neutral-strong)] px-[16px] py-[8px]">
            <EntityPortrait
              name={location.name}
              photoUrl={location.officePhotoUrl}
              variant="entity"
              size="lg"
              avatarClassName="rounded-[4px]"
            />
            <div className="flex min-w-0 flex-col gap-[var(--density-spacing-fixed-x-small)] pb-[8px]">
              <span className="truncate text-[18px] leading-[26px] font-medium text-white whitespace-pre-line">
                {location.address}
              </span>
              <GoldUnderline className="h-[2px] w-[100px]" />
            </div>
          </div>
        ) : (
          // `grid`, not absolute positioning -- per the user. Unlike
          // AdvisorHero's overlapping-avatar treatment (where the avatar
          // genuinely hangs outside the banner's own box, requiring
          // `position: absolute` to break out of flow), this mobile
          // avatar always lands fully inside the banner's bounds, so the
          // absolute-positioning + negative-offset trick here was only
          // ever standing in for "pull the avatar out of normal flow into
          // the left gutter", something a grid column does directly. Two
          // explicit tracks (`auto` for the avatar's own intrinsic width,
          // `1fr` for the text) since the column count is fixed and known,
          // per the `css-layout` guide's own decision tree; `items-center`
          // centers the avatar against the text block's height "for free"
          // -- no more hand-measured `top` offset, and the address/
          // underline column can vary in height (e.g. a longer city name
          // wrapping) without needing re-tuning.
          // `gap-x` doubles from 8px to 16px at 360px and above, per the
          // user -- same "more breathing room once there's more room to
          // give it" precedent as EntityActions' own two-tier spacer
          // logic (see its own comment), not a flat doubling everywhere.
          <div className="grid grid-cols-[auto_1fr] items-center gap-x-[8px] min-[360px]:gap-x-[16px] bg-[color:var(--color-response-neutral-strong)] pt-[16px] pr-[var(--density-layout-fixed-large)] pb-[16px] pl-[var(--density-layout-fixed-large)]">
            <EntityPortrait
              name={location.name}
              photoUrl={location.officePhotoUrl}
              variant="entity"
              // `lg` (Avatar's real `--component-avatar-size-large` step,
              // 80px) at every mobile width, per the user -- unlike
              // AdvisorHero, this jumps straight from the desktop size
              // (240px) to the smallest mobile step, with no intermediate
              // `xl`-then-shrink-below-390px stage.
              size="lg"
              avatarClassName="rounded-[4px]"
            />
            <div>
              <span className="mb-[4px] block text-[18px] leading-[26px] font-medium text-white">
                {street}
                <br />
                {cityStateZip}
              </span>
              <GoldUnderline className="h-[2px] w-[100px]" />
            </div>
          </div>
        )}
      </div>
      {!stuck && (
        // Same page-gap-cancel/responsive reasoning as AdvisorHero's own
        // below-banner block -- see its comments for the full explanation.
        <div className="-mt-[var(--density-layout-fixed-large)] max-[360px]:mt-[-16px] pr-[var(--density-layout-fixed-large)] md:hidden">
          {/* `min-[360px]:pl-[120px]` keeps this aligned with the banner's
              own text column above, whose start shifts from 112px to
              120px at that same breakpoint (see the banner's `gap-x`
              comment). */}
          <div className="pt-[8px] pb-[8px] pl-[112px] min-[360px]:pl-[120px] max-[360px]:pl-[var(--density-layout-fixed-large)]">
            <BranchLineItems location={location} />
          </div>
        </div>
      )}
    </>
  );
}

export function LocationHero({ location, className }: LocationHeroProps) {
  return (
    <>
      <LocationHeroDesktop location={location} className={className} />
      <LocationHeroMobile location={location} />
    </>
  );
}
