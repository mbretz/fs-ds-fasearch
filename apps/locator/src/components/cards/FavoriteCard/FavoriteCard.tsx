import { Card } from 'ds';
import type { Advisor, Location } from '../../../data/locations';
import { EntityPortrait } from '../../entity-info/EntityPortrait';
import { EntityActions } from '../../entity-info/EntityActions';
import { ContactLinks } from '../../entity-info/ContactLinks';
import { FocusAreasPanel } from '../../entity-info/FocusAreasPanel';
import { FavoriteToggle } from '../../entity-info/FavoriteToggle';
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
  className?: string;
}

const WIDTH_BY_VARIANT: Record<'desktop' | 'mobile', string> = {
  desktop: 'w-[379px]',
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
  className,
}: FavoriteCardProps) {
  const phone = advisor.phone ?? location.phone;
  const showsNewClientInquiry =
    advisor.newClientStatus === 'accepting' ||
    advisor.newClientStatus === 'waitlist';
  const fullName = getFullName(advisor);

  const actions = showsNewClientInquiry ? (
    <NewClientInquiryDialog advisor={advisor}>
      {(openInquiryDialog) => (
        <EntityActions
          primaryLabel="View Profile"
          primaryHref={`/advisor/${advisor.id}`}
          onNewClientInquiry={openInquiryDialog}
          orientation="block"
        />
      )}
    </NewClientInquiryDialog>
  ) : (
    <EntityActions
      primaryLabel="View Profile"
      primaryHref={`/advisor/${advisor.id}`}
      orientation="block"
    />
  );

  return (
    <div
      className={cn(
        'flex shrink-0 flex-col items-center gap-[var(--density-spacing-fixed-xx-large)]',
        WIDTH_BY_VARIANT[variant],
        className,
      )}
    >
      <EntityPortrait
        name={fullName}
        photoUrl={advisor.photoUrl}
        size="xl"
        showBadge={false}
      />
      <div className="flex flex-col items-center gap-[var(--density-spacing-fixed-small)]">
        <span className="text-[length:var(--semantic-content-subheading-font-size)] leading-[length:var(--semantic-content-subheading-line-height)] font-[number:var(--semantic-content-subheading-font-weight)] text-[color:var(--semantic-content-common-text-color-default)]">
          {fullName}
        </span>
        <FavoriteToggle advisorId={advisor.id} name={fullName} showLabel />
      </div>
      {/* Figma's own gap here (40px) has no matching `fixed` token --
          `xx-large` (24px) is the nearest real step, same "pick the
          nearest whole token" approach used elsewhere in this app. */}
      <Card.Root className="w-full items-stretch gap-[var(--density-spacing-fixed-xx-large)] p-[var(--density-spacing-fixed-small)]">
        {actions}
        <ContactLinks address={location.address} phone={phone} />
        <FocusAreasPanel focusAreas={advisor.focusAreas} />
      </Card.Root>
    </div>
  );
}
