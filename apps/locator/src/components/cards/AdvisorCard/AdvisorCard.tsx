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
import { getFullName } from '../../../utils/getFullName';
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
  // Per the user: only advisors actively taking new clients or holding a
  // waitlist spot get the secondary button -- `referralOnly` advisors
  // don't. Shown regardless of whether a caller wired a real handler yet,
  // since the button's presence is status-driven, not caller-opt-in.
  const showsNewClientInquiry =
    advisor.newClientStatus === 'accepting' ||
    advisor.newClientStatus === 'waitlist';
  const fullName = getFullName(advisor);

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
        {signedIn && <FavoriteToggle name={fullName} />}
      </div>

      <div className="flex gap-[var(--density-spacing-fixed-large)]">
        {/* `xl` is Avatar's own real 104px step (`--component-avatar-
            size-x-large`) -- kept as-is (font-size/icon-size ratio and
            all) rather than an arbitrary override. The 4px white border
            (112px total) is `EntityPortrait`'s own default for `xl` now,
            not a per-call override.

            `self-start` on the avatar + `self-center` on the name column
            (not `items-center`/`items-start` on the row itself), per the
            user: with plain `items-center`, once the name column grows
            taller than the avatar (long designations/a wrapped name), the
            *avatar* is what would drift down to stay centered against it
            -- the avatar defines the row's height whenever it's the
            taller of the two, so `align-self: start` on it always pins it
            to the top with zero visible effect in that case (it's already
            sitting at position 0). It only visibly matters in the
            opposite case: once the name column *is* the taller item (and
            so defines the row's own height), `self-center` would center
            the column *within its own height* -- a no-op -- while the
            avatar, still `self-start`, stays pinned at the top and the
            column overflows past its bottom edge, per the user, rather
            than the whole row growing to re-center everything around a
            now-much-taller box. */}
        <EntityPortrait
          name={fullName}
          photoUrl={advisor.photoUrl}
          status={advisor.newClientStatus}
          size="xl"
          showBadge={showPortraitBadge}
          className="self-start"
        />
        <div className="flex flex-col gap-[var(--density-spacing-fixed-small)] self-center">
          <NameBlock
            heading={fullName}
            subheading={
              advisor.designations.length > 0
                ? advisor.designations.join(', ')
                : undefined
            }
            // Tighter than NameBlock's own default 8px (`fixed-small`) --
            // per the user, name-to-designations reads better at 4px
            // (`fixed-x-small`) than the space LocationCard's own
            // address-to-summary gap uses, which keeps the default.
            className="gap-[var(--density-spacing-fixed-x-small)]"
            subheadingClassName="leading-[length:var(--semantic-content-size-x-small-line-height)]"
          />
          <TenureLine
            years={advisor.tenureYears}
            className="leading-[length:var(--semantic-content-size-x-small-line-height)]"
          />
          {/* SocialLinks split out to its own entity-info component
              (2026-09-20, per the user) -- no longer rendered here at
              all; reserved for the individual advisor profile page
              instead. */}
        </div>
      </div>

      {/* 32px (`fixed-xxx-large`) inset -- 16px more than the Separator's
          own 16px (`fixed-large`) below, per the user, not the same inset. */}
      <ContactLinks
        address={location.address}
        phone={phone}
        className="mx-[var(--density-spacing-fixed-xxx-large)]"
      />

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
