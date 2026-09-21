import { Link, Button } from 'ds';
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
}: {
  advisor: Advisor;
  phone?: string;
  showFavorite: boolean;
  fullName: string;
  tagSize?: 'sm' | 'lg';
}) {
  return (
    <div className="flex flex-col gap-[var(--density-spacing-fixed-small)]">
      {advisor.designations.length > 0 && (
        <span className="text-[18px] leading-none font-medium text-[color:var(--semantic-content-common-text-color-default)]">
          {advisor.designations.join(', ')}
        </span>
      )}
      <TenureLine years={advisor.tenureYears} />
      {phone && (
        <div className="flex items-center gap-[var(--density-spacing-fixed-x-small)]">
          <Phone
            aria-hidden="true"
            className="size-[var(--density-sizing-fixed-large)] shrink-0 text-[color:var(--component-link-text-color-default)]"
          />
          {/* Real navigation, not ContactLinks' inert `href="#"` treatment
              -- per EntityActions' own doc comment, this Hero's phone
              action is meant to actually dial, unlike every other
              placeholder destination in this prototype. */}
          <Link href={telHref(phone)}>{phone}</Link>
        </div>
      )}
      {showFavorite && (
        <FavoriteToggle
          name={fullName}
          showLabel
          className="text-[color:var(--component-link-text-color-default)]"
        />
      )}
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
  className,
}: {
  advisor: Advisor;
  phone?: string;
  signedIn: boolean;
  fullName: string;
  className?: string;
}) {
  return (
    <div className={cn('hidden md:block', className)}>
      <div className="relative rounded-[8px] bg-[color:var(--color-response-neutral-strong)] pt-[32px] pr-[32px] pb-[20px] pl-[288px]">
        <EntityPortrait
          name={fullName}
          photoUrl={advisor.photoUrl}
          size="xl"
          showBadge={false}
          // `rounded-full` overrides Avatar's own fixed 80px
          // `--component-avatar-border-radius-associate` token, which only
          // fully clips to a circle up to a 160px box (half-width <= 80px)
          // -- past that (this 188px override) it renders as a rounded
          // square instead.
          //
          // `top-[10px]` (not `top-[32px]`, matching the container's own
          // `pt-[32px]`) -- the absolutely-positioned avatar's containing
          // block is EntityPortrait's own `relative` wrapper div, not this
          // outer padded container; that wrapper is a zero-size inline-flex
          // box sitting on the same anonymous line as the name text before
          // it, which measured ~18px below the container's padded top due
          // to ordinary inline baseline alignment. 10px was measured live
          // (Playwright bounding boxes) to land the avatar ring's own top
          // edge exactly on the name text's ink-box top -- re-measure if
          // the name's font/line-height/size ever changes.
          avatarClassName="absolute top-[10px] left-[-248px] size-[188px] rounded-full"
        />
        <span className="mb-[8px] block text-[30px] leading-[1.5em] font-semibold text-white">
          {fullName}
        </span>
        <GoldUnderline />
      </div>
      <div className="pt-[8px] pb-[8px] pl-[288px]">
        <HeroContent
          advisor={advisor}
          phone={phone}
          showFavorite={signedIn}
          fullName={fullName}
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
                  <Button.Root variant="primary" asChild className="min-w-0">
                    <a href={telHref(phone)}>
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
          <div className="relative bg-[color:var(--color-response-neutral-strong)] pt-[16px] pr-[var(--density-layout-fixed-large)] pb-[16px] pl-[152px] max-[390px]:pl-[112px]">
            <EntityPortrait
              name={fullName}
              photoUrl={advisor.photoUrl}
              size="xl"
              showBadge={false}
              // Measured live (Playwright bounding boxes), same reasoning
              // as the desktop avatar's own `top-[10px]` comment above --
              // this wrapper's containing-block top sits ~18px below the
              // container's own `pt-[16px]` due to the same inline-baseline
              // quirk. `left-[-136px]` lands the avatar ring's own left
              // edge 16px from the container's left edge (per the user);
              // `top-[-18px]` lands its top edge flush with the container's
              // own `pt-[16px]` (per the user) rather than the name text's
              // own top, which sits ~8px lower. `top` doesn't need its own
              // `max-[390px]:` variant -- the container's vertical padding
              // (and the wrapper's baseline quirk) don't depend on width.
              //
              // Below 390px (per the user): the portrait scales down to
              // Avatar's real `--component-avatar-size-large` step (80px,
              // still a real token, not an invented size) and the gap to
              // the content column narrows from the ~24px implied by the
              // 152px/136px pair above to 8px -- `pl-[112px]` above
              // (=16px left margin + 88px avatar-plus-border + 8px gap)
              // pairs with `left-[-96px]` here (=112-96=16, same left-edge
              // math as the base 152/136 pair) to land the smaller
              // avatar's own left edge still 16px from the container edge.
              avatarClassName="absolute top-[-18px] left-[-136px] max-[390px]:left-[-96px] max-[390px]:size-[var(--component-avatar-size-large)]"
            />
            <span className="mb-[8px] block truncate text-[20px] leading-[24px] font-medium text-white">
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
        // instead of the intended 8px.
        <div className="-mt-[var(--density-layout-fixed-large)] max-[360px]:mt-[-2px] pr-[var(--density-layout-fixed-large)] max-[360px]:pr-[var(--density-spacing-fixed-xxx-large)] md:hidden">
          {/* `max-[360px]:pl-[var(--density-spacing-fixed-xxx-large)]` (32px)
              matches EntityActions' own block-orientation inset just below
              -- its fixed-floor `mx-large` (16px) plus its spacer's own
              unshrunk `large` basis (16px) add up to the same 32px, per the
              user. */}
          <div className="pt-[8px] pb-[8px] pl-[152px] max-[390px]:pl-[112px] max-[360px]:pl-[var(--density-spacing-fixed-xxx-large)]">
            <HeroContent
              advisor={advisor}
              phone={phone}
              showFavorite={signedIn}
              fullName={fullName}
              tagSize="sm"
            />
          </div>
          <EntityActions
            primaryLabel={phone ?? 'Call'}
            primaryHref={phone ? telHref(phone) : undefined}
            onNewClientInquiry={
              showsNewClientInquiry ? (onNewClientInquiry ?? noop) : undefined
            }
            orientation="block"
            className="mt-[var(--density-spacing-fixed-small)]"
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
