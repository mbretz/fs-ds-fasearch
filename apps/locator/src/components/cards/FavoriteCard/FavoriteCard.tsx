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
// dialog must never horizontal-scroll. `basis-[360px]` (down from Figma's
// 379px) is its natural size on the row (`FavoritesComparatorDialog`'s row
// is `flex-wrap`), `grow-0` keeps it from stretching past that on a row
// with empty leftover space, and `max-w-[min(360px,100%)]` caps it at
// *whichever is smaller* of 360px or its own container's width -- not a
// plain `max-w-full` (100% of container, no matter how large): that let a
// card with longer content than the original test fixtures (a longer
// address/phone, confirmed live) grow past 360px, which silently inflated
// `FavoritesComparatorDialog`'s row past the width its own max-width
// calc assumed and forced an unwanted wrap even when the cards should
// have fit on one line. `min(...)` still falls back to the container's
// own width for the (desktop-breakpoint-adjacent) case where even one
// card can't fit at 360px -- between `grow-0` and this cap, the card can
// never be the thing forcing the row wider than its container, which is
// what caused horizontal overflow before this: shrinking the flex item
// itself (`min-w-0`/`flex-1`) hit a content-driven floor well above what
// a narrow dialog can offer (its `EntityActions`/`ContactLinks` contents
// have their own un-investigated min-content width), so wrapping instead
// of continuing to force that shrink is what actually guarantees no
// overflow regardless of where that inner floor is.
// Mobile keeps the fixed width + `shrink-0` -- its own carousel
// (`FavoritesComparatorMobile`) is a deliberately horizontal-scrolling
// snap list, not a container this rule applies to.
const WIDTH_BY_VARIANT: Record<'desktop' | 'mobile', string> = {
  desktop: 'basis-[360px] grow-0 max-w-[min(360px,100%)]',
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
          natural height, only this box grows. */}
      <Card.Root className="w-full flex-1 items-stretch gap-[var(--density-spacing-fixed-xxx-large)] p-[var(--density-spacing-fixed-small)] pt-[var(--density-spacing-fixed-large)]">
        {actions}
        {/* 24px extra inset beyond Card.Root's own 8px padding (32px
            total from the card edge) -- matches Figma's `.FA-Card-Contact`
            own 24px padding on top of CardBody's 8px, giving this block a
            deliberately deeper indent than the flush-left action buttons
            above it. */}
        <ContactLinks
          address={location.address}
          phone={phone}
          className="mx-[var(--density-spacing-fixed-xx-large)]"
        />
        <FocusAreasPanel focusAreas={advisor.focusAreas} />
      </Card.Root>
    </div>
  );
}
