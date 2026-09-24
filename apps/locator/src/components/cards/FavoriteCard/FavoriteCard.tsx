import type { ReactNode } from 'react';
import { Card } from 'ds';
import type { Advisor, Location } from '../../../data/locations';
import { EntityPortrait } from '../../entity-info/EntityPortrait';
import { EntityActions } from '../../entity-info/EntityActions';
import { ContactLinks } from '../../entity-info/ContactLinks';
import { FocusAreasPanel } from '../../entity-info/FocusAreasPanel';
// `FavoriteToggle` itself (and the `useFavorites` hook it wraps) is left
// fully in place -- only its render below is commented out, per the user,
// so the unfavorite control can be reinstalled here later with a single
// uncomment rather than rebuilding it.
// import { FavoriteToggle } from '../../entity-info/FavoriteToggle';
import { NewClientInquiryDialog } from '../../entity-info/NewClientInquiryDialog';
import { getFullName } from '../../../utils/getFullName';
import { cn } from '../../../utils/cn';

export interface FavoriteCardProps {
  advisor: Advisor;
  location: Location;
  /** Figma's Card-Favorite (desktop, 379px) vs Card-Favorite-Mobile (358px)
   * -- the only structural difference between the two is this fixed width,
   * everything else in the composition is identical. Defaults to desktop. */
  variant?: 'desktop' | 'mobile';
  /** `FavoritesComparatorMobile`'s prev/dots/next control, rendered between
   * the name and the card body -- optional and unused on desktop, where
   * there's no per-slide nav at all (the dialog just wraps every card into
   * a grid). */
  nav?: ReactNode;
  /**
   * When set, the "New Client Inquiry" action calls this instead of
   * opening its own self-contained `NewClientInquiryDialog` -- required by
   * `FavoritesComparatorDialog` (the desktop host), which needs to close
   * ITS OWN Dialog before opening the inquiry one to avoid a nested-modal
   * bug (two Radix Dialogs open at once). `FavoritesComparatorMobile`
   * doesn't pass this -- it isn't inside a Dialog itself, so the default
   * self-contained behavior is fine there.
   */
  onOpenInquiry?: (advisor: Advisor) => void;
  className?: string;
}

// Desktop no longer gets a fixed width -- per the user, the comparator
// dialog's cards must never wrap onto another row, but should shrink to
// fit however many are actually favorited (up to `FAVORITES_CAP`, 3) on
// one line. `basis-[360px]` (down from Figma's 379px) is its natural size
// on the row, `grow-0` keeps it from stretching past that on a row with
// empty leftover space, and `shrink` (in place of the old `grow-0`-only,
// non-shrinking pairing with the row's own `flex-wrap`) lets it actually
// give up width once the row can't fit every card at 360px -- paired with
// `FavoritesComparatorDialog`'s own row gap also shrinking first (see its
// comment), so the cards don't have to give up as much of their own width
// to still fit 3-across at the comparator's narrowest real viewport
// (768px, `DESKTOP_QUERY` in Favorites.tsx). `min-w-[220px]` is a
// deliberate floor, not `min-w-0`, per the user -- below that, individual
// chip labels/button labels have their own un-investigated min-content
// widths that would force real content overflow rather than a clean
// shrink. It was originally set to 260px to stay clear of a real bug
// (`FocusAreasPanel`'s own chip row stopped actually wrapping and spilled
// past the card's edge below ~252px) -- that bug is now fixed at its
// actual source (see `FocusAreasPanel.tsx`'s own comment, the same
// missing-`min-width:0` class of issue as `Dialog.tsx`'s grid item and
// `Card.Root`'s own default min-width, both also fixed alongside this),
// so 220px is safe again.
// Mobile keeps the fixed width + `shrink-0` -- its own carousel
// (`FavoritesComparatorMobile`) is a deliberately horizontal-scrolling
// snap list, not a container this rule applies to.
const WIDTH_BY_VARIANT: Record<'desktop' | 'mobile', string> = {
  desktop: 'basis-[360px] grow-0 shrink min-w-[220px]',
  mobile: 'w-[358px]',
};

// Matches Figma's "Card-Favorite" (`1313:55700`)/"Card-Favorite-Mobile"
// (`1345:13549`) -- a single fixed-width vertical stack, distinct from
// `EntityCard`'s row+container-query-panel shell (that composition doesn't
// apply here: the comparator always shows this card at one fixed width per
// viewport, never needing to reflow). Built entirely from existing
// entity-info sub-parts -- `EntityActions`'s `orientation="block"` already
// matches Figma's `.FA-Card-Actions` Block variant exactly, so no new DS
// primitive is needed.
export function FavoriteCard({
  advisor,
  location,
  variant = 'desktop',
  nav,
  onOpenInquiry,
  className,
}: FavoriteCardProps) {
  const phone = advisor.phone ?? location.phone;
  const showsNewClientInquiry =
    advisor.newClientStatus === 'accepting' ||
    advisor.newClientStatus === 'waitlist';
  const fullName = getFullName(advisor);

  const primaryActionsProps = {
    primaryLabel: 'View Profile',
    primaryHref: `/advisor/${advisor.id}`,
    orientation: 'block' as const,
    // See `EntityActions`' own doc comment -- its default block-
    // orientation inset never actually shrinks in practice; this opts
    // into the real (clamped, 16px-floored) one instead, per the user.
    flexibleInset: true,
  };

  const actions = !showsNewClientInquiry ? (
    <EntityActions {...primaryActionsProps} />
  ) : onOpenInquiry ? (
    <EntityActions
      {...primaryActionsProps}
      onNewClientInquiry={() => onOpenInquiry(advisor)}
    />
  ) : (
    <NewClientInquiryDialog advisor={advisor}>
      {(openInquiryDialog) => (
        <EntityActions
          {...primaryActionsProps}
          onNewClientInquiry={openInquiryDialog}
        />
      )}
    </NewClientInquiryDialog>
  );

  return (
    <div
      className={cn(
        // Half of the original 24px (`xx-large`) gap -- `med` (12px) is
        // the real token that lands exactly there, per the user, applied
        // to both the avatar-to-name and name-to-card-body gaps since
        // this one flex column gap governs both.
        'flex shrink-0 flex-col items-center gap-[var(--density-spacing-fixed-med)]',
        WIDTH_BY_VARIANT[variant],
        className,
      )}
    >
      {/* Gold ring, not the plain white ring `EntityPortrait` defaults to
          elsewhere (AdvisorCard/LocationCard) -- matches the actual fill
          override Figma's own "Card-Favorite" component carries on its
          avatar ellipse (`#FDE272`, exactly `--semantic-brand-secondary-
          light-gold`), a deliberate "this advisor is favorited" accent
          rather than the master FA-Portrait component's own white
          default. */}
      <EntityPortrait
        name={fullName}
        photoUrl={advisor.photoUrl}
        size="xl"
        showBadge={false}
        avatarClassName="border-[color:var(--semantic-brand-secondary-light-gold)]"
      />
      <div className="flex flex-col items-center gap-[var(--density-spacing-fixed-small)]">
        {/* Reverse (white) text, not the default dark text color -- this
            card renders on FavoritesComparatorDialog's dark scrim, and
            Figma's own name text fill is white for exactly that reason. */}
        <span className="text-[length:var(--semantic-content-subheading-font-size)] leading-[length:var(--semantic-content-subheading-line-height)] font-[number:var(--semantic-content-subheading-font-weight)] text-[color:var(--semantic-content-common-text-color-reverse)]">
          {fullName}
        </span>
        {/* Unfavorite control removed from this card, per the user --
            re-add with `<FavoriteToggle advisorId={advisor.id}
            name={fullName} showLabel />` (see the commented-out import
            above) if it should come back. */}
      </div>
      {nav}
      {/* Figma's own gap here (40px) has no matching `fixed` token --
          `xxx-large` (32px) is the nearest real step: CardBody's own
          (implicit zero) gap plus the Actions block's 8px bottom padding
          plus Contact's own 24px top padding nets to 32px between the
          Actions block and Contact block in Figma, so that's the value
          that actually matters here, not the raw 40px on "Bottom" (which
          only ever separates Actions from itself in the real composition
          -- see the Contact/FocusAreas indentation note below). */}
      {/* `pt-*` after `p-*` in the same class string wins that one side
          via tailwind-merge -- bumped to double the card's own 8px base
          padding (`large`, 16px), per the user, rather than raising
          every side. `flex-1` (grow into whatever vertical space the
          wrapper above has -- it's already stretched to match the row's
          tallest card by the row's own `items-stretch`) is what actually
          makes the visible white card boxes end at the same height across
          the row, per the user -- the avatar/name above it stay their own
          natural height, only this box grows.
          `min-w-0` overrides `Card.Root`'s own default
          `min-w-[var(--component-card-min-width)]` (320px, Card.tsx's own
          base className) -- confirmed live: without this, Card.Root sat
          at a hard 320px regardless of how narrow the outer wrapper above
          shrank to, which is what actually made the card *body* look like
          it wasn't shrinking even once the wrapper's own width (and this
          className's `w-full`) were both doing the right thing. Safe to
          drop entirely here since `WIDTH_BY_VARIANT`'s own
          `min-w-[220px]` on the wrapper (mobile's fixed `w-[358px]`,
          always above 320) is what actually governs this card's floor
          now, not Card's generic one. */}
      <Card.Root className="w-full min-w-0 flex-1 items-stretch gap-[var(--density-spacing-fixed-xxx-large)] p-[var(--density-spacing-fixed-small)] pt-[var(--density-spacing-fixed-large)]">
        {actions}
        {/* Flush with `actions`' own left edge, not a deeper 24px indent
            (Figma's `.FA-Card-Contact` static 24px padding) -- per the
            user. The exact same clamp expression as `EntityActions`'
            `flexibleInset` (see its own comment) applied directly as a
            margin here, not a separate mechanism -- keeps this
            permanently flush with `actions` at every width, since both
            shrink through the identical floor/ceiling in lockstep rather
            than two independently-tuned formulas that could drift apart. */}
        <ContactLinks
          address={location.address}
          phone={phone}
          className="mx-[clamp(var(--density-spacing-fixed-small),calc(4.2vw_-_26px),var(--density-spacing-fixed-xxx-large))]"
        />
        <FocusAreasPanel focusAreas={advisor.focusAreas} />
      </Card.Root>
    </div>
  );
}
