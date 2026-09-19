import { HyperlinkLink, Share } from 'icons';
import { Separator } from 'ds';
import type { Advisor, Location } from '../../../data/locations';
import { EntityCard } from '../EntityCard/EntityCard';
import { EntityPortrait } from '../../entity-info/EntityPortrait';
import { NameBlock } from '../../entity-info/NameBlock';
import { TenureLine } from '../../entity-info/TenureLine';
import { ContactLinks } from '../../entity-info/ContactLinks';
import { StatusTag } from '../../entity-info/StatusTag';
import { FavoriteToggle } from '../../entity-info/FavoriteToggle';
import { EntityActions } from '../../entity-info/EntityActions';
import { FocusAreasPanel } from '../../entity-info/FocusAreasPanel';
import { OfficeDetailsPanel } from '../../entity-info/OfficeDetailsPanel';
import { cn } from '../../../utils/cn';
import { useSession } from '../../../session/useSession';

export interface AdvisorCardProps {
  advisor: Advisor;
  /** The advisor's branch -- supplies the office/contact details this
   * card shows alongside the advisor's own info (address, hours,
   * support staff); an advisor has no separate office of their own. */
  location: Location;
  onNewClientInquiry?: () => void;
  /** Forwarded to `EntityPortrait`'s own `showBadge` -- see its doc
   * comment. Defaults to true; ResultsList sets this false since
   * `StatusTag` already shows the same status there. */
  showPortraitBadge?: boolean;
  className?: string;
}

function preventDisabledClick(event: { preventDefault: () => void }) {
  event.preventDefault();
}

// Fallback so the button still renders (per status) when no caller has
// wired a real inquiry handler yet.
function noop() {}

// Assembles Figma's `.FA-Card-Stacked`/`.FA-Card-Header` +
// `.FA-Card-SidePanels`-class compositions from the entity-info/EntityCard
// pieces built earlier, rather than replicating `.FA-Card-Stacked`'s own
// "Card Content" section literally -- that section duplicates a second
// bare Status instance and a second `.FA-Card-Contact` on top of the ones
// already inside `.FA-Card-Header-Content`, which reads as leftover/
// overlapping Figma authoring rather than two distinct pieces of content
// worth showing twice.
export function AdvisorCard({
  advisor,
  location,
  onNewClientInquiry,
  showPortraitBadge,
  className,
}: AdvisorCardProps) {
  const { signedIn } = useSession();
  // Advisor's own direct line takes precedence; falls back to the
  // branch's main line (see `Advisor.phone`'s own doc comment).
  const phone = advisor.phone ?? location.phone;
  const hasSocial = advisor.linkedIn || advisor.facebook;
  // Per the user: only advisors actively taking new clients or holding a
  // waitlist spot get the secondary button -- `referralOnly` advisors
  // don't. Shown regardless of whether a caller wired a real handler yet
  // (same inert-until-real-destination pattern as the social icons above),
  // since the button's presence is status-driven, not caller-opt-in.
  const showsNewClientInquiry =
    advisor.newClientStatus === 'accepting' ||
    advisor.newClientStatus === 'waitlist';

  return (
    <EntityCard
      className={className}
      panels={[
        <FocusAreasPanel key="focus-areas" focusAreas={advisor.focusAreas} />,
        // `officePhotoUrl` deliberately not passed here -- per the user,
        // the branch photo is reserved for the full Office Details panel
        // on profile pages, not any card context.
        // `address`/`phone` deliberately omitted -- per the user, the main
        // card panel above (NameBlock/ContactLinks) already shows these,
        // so this panel only adds what's not already visible there
        // (hours, fax, support staff). LocationCard still passes both,
        // since its own header/panels don't repeat them.
        <OfficeDetailsPanel
          key="office-details"
          hours={location.hours}
          fax={location.fax}
          supportStaff={location.supportStaff}
          showTitle={false}
        />,
      ]}
    >
      <div className="flex items-start justify-between gap-[var(--density-spacing-fixed-large)]">
        <StatusTag status={advisor.newClientStatus} size="sm" />
        {/* Favoriting requires a signed-in prospect (`ProspectPortal`'s
            spoofed session), per the user -- hidden entirely rather than
            disabled for a signed-out visitor. */}
        {signedIn && <FavoriteToggle name={advisor.name} />}
      </div>

      <div className="flex items-start gap-[var(--density-spacing-fixed-large)]">
        {/* `xl` is Avatar's own real 104px step (`--component-avatar-
            size-x-large`) -- kept as-is (font-size/icon-size ratio and
            all) rather than an arbitrary override. The 4px white border
            (112px total) is `EntityPortrait`'s own default for `xl` now,
            not a per-call override. */}
        <EntityPortrait
          name={advisor.name}
          photoUrl={advisor.photoUrl}
          status={advisor.newClientStatus}
          size="xl"
          showBadge={showPortraitBadge}
        />
        <div className="flex flex-col gap-[var(--density-spacing-fixed-small)]">
          <NameBlock
            heading={advisor.name}
            subheading={
              advisor.designations.length > 0
                ? advisor.designations.join(', ')
                : undefined
            }
            subheadingClassName="leading-[length:var(--semantic-content-size-x-small-line-height)]"
          />
          <TenureLine
            years={advisor.tenureYears}
            className="leading-[length:var(--semantic-content-size-x-small-line-height)]"
          />
        </div>
      </div>

      <ContactLinks address={location.address} phone={phone} />

      {/* LinkedIn/Facebook icons are a placeholder (`HyperlinkLink`/
          `Share`, generic icons) -- packages/icons has neither brand icon
          yet, per the user's direction to use a stand-in rather than
          block on sourcing them. No real profile URL exists in the data
          model (`Advisor.linkedIn`/`.facebook` are booleans, not links),
          so these render inert like every other not-yet-real destination
          in this app (SiteHeader, Start.tsx's promo CTAs). */}
      {hasSocial && (
        <div className="flex gap-[var(--density-spacing-fixed-med)]">
          {advisor.linkedIn && (
            <a
              href="#"
              aria-disabled="true"
              aria-label={`${advisor.name} on LinkedIn`}
              tabIndex={-1}
              onClick={preventDisabledClick}
              className={cn(
                'cursor-not-allowed text-[color:var(--semantic-content-common-text-color-default)]',
              )}
            >
              <HyperlinkLink
                aria-hidden="true"
                className="size-[var(--density-sizing-fixed-x-large)]"
              />
            </a>
          )}
          {advisor.facebook && (
            <a
              href="#"
              aria-disabled="true"
              aria-label={`${advisor.name} on Facebook`}
              tabIndex={-1}
              onClick={preventDisabledClick}
              className="cursor-not-allowed text-[color:var(--semantic-content-common-text-color-default)]"
            >
              <Share
                aria-hidden="true"
                className="size-[var(--density-sizing-fixed-x-large)]"
              />
            </a>
          )}
        </div>
      )}

      {/* Matches `.FA-Card-Actions-Block`: a `Separator` directly above
          Actions, inset 16px on each side (that block's own horizontal
          padding in Figma) rather than spanning the column's full width.
          `w-auto` overrides Separator's own default `w-full` -- combined
          with `mx-*`, `w-full` would overflow the column by 32px (an
          explicit 100% width ignores margins), whereas `w-auto` lets the
          parent flex column's default `align-items: stretch` size it to
          fill the *remaining* width after the margins instead. `mt-auto`
          lives on the separator, not `EntityActions` itself, per the
          user -- it pins the divider (and everything after it) to the
          bottom of the main column, which is now stretched to match the
          side panels' height (EntityCard's `align-items: stretch`).
          Everything above stays stacked at its own natural height (the
          outer wrapper's default `justify-content: flex-start` already
          keeps it pinned top on its own), and the gap right before the
          separator absorbs the extra space. */}
      <Separator className="mt-auto mx-[var(--density-spacing-fixed-large)] w-auto" />
      {/* Real link, not inert -- per the user, every advisor gets an
          individual profile page later, so `/advisor/:id` renders as a
          genuine href now even though `router.tsx` has no matching route
          yet, unlike the LinkedIn/Facebook placeholders above. */}
      <EntityActions
        primaryLabel="View Profile"
        primaryHref={`/advisor/${advisor.id}`}
        onNewClientInquiry={
          showsNewClientInquiry ? (onNewClientInquiry ?? noop) : undefined
        }
      />
    </EntityCard>
  );
}
