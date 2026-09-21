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

function BranchLineItems({ location }: { location: Location }) {
  const lines = branchLineItems(location);
  return (
    <div className="flex flex-col gap-[var(--density-spacing-fixed-small)]">
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
      <div className="relative rounded-[8px] bg-[color:var(--color-response-neutral-strong)] pt-[32px] pr-[32px] pb-[20px] pl-[320px]">
        <EntityPortrait
          name={location.name}
          photoUrl={location.officePhotoUrl}
          variant="entity"
          size="xl"
          // Pinned 40px from the banner's own top and left edges, per the
          // user -- `left-[-280px]` already lands exactly there (measured:
          // the absolutely-positioned avatar's containing block is
          // EntityPortrait's own zero-size inline wrapper, itself sitting
          // exactly at the container's own `pl-[320px]`, so `320-280=40`
          // falls out directly with no extra offset needed). `top-[-10px]`
          // needed the same kind of live measurement `top` usually does
          // here -- the wrapper's vertical position is offset ~18px below
          // the container's padded top by ordinary inline baseline
          // alignment (see AdvisorHero's own avatar comments for the full
          // explanation of that quirk), so a flat `top-[40px]` would land
          // ~19px too low; `-10px` was measured live to land the avatar's
          // own top edge (now bordered, same as `associate`) exactly 40px
          // below the container's top edge.
          avatarClassName="absolute top-[-10px] left-[-280px] size-[240px] rounded-[4px]"
        />
        <span className="mb-[12px] block text-[20px] leading-[30px] font-medium text-white">
          {street}
          <br />
          {cityStateZip}
        </span>
        <GoldUnderline />
      </div>
      <div className="pt-[8px] pb-[8px] pl-[320px]">
        <BranchLineItems location={location} />
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
              <span className="mb-[8px] block text-[18px] leading-[26px] font-medium text-white">
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
