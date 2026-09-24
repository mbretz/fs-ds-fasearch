import type { Advisor } from '../../data/locations';
import { EntityPortrait } from '../entity-info/EntityPortrait';
import { NameBlock } from '../entity-info/NameBlock';
import { TenureLine } from '../entity-info/TenureLine';
import { EntityActions } from '../entity-info/EntityActions';
import { getFullName } from '../../utils/getFullName';

export interface AdvisorPopoverContentProps {
  advisor: Advisor;
  /** Matches Figma's `FA-Map-Tile` Large/Small variants -- Large is a
   * two-column layout (portrait + status tag stacked on the left; name/
   * designations/tenure/actions stacked on the right, per the user) with
   * an 80px portrait; Small stays a single simpler row with a 48px
   * portrait and no status tag/designations/tenure. Callers pick based
   * on the map's own rendered width (see Map.tsx), not a viewport
   * breakpoint -- the popover portals to `document.body`, outside the
   * map's DOM subtree, so a CSS container query can't reach it. */
  size: 'sm' | 'lg';
  /** Closes this popover and opens `NewClientInquiryDialog` at the `Map`
   * level instead of self-triggering it in place -- a Dialog opened
   * *inside* an open `MapPinPopover` rendered behind it (DS's z-index
   * scale deliberately tiers `z-index-popover` above `z-index-modal`, so
   * a popover-inside-a-dialog can float above its own ancestor modal,
   * but that leaves a same-document-body *sibling* popover like this one
   * outranking any dialog that opens beside it), per the user. Same
   * externally-controlled-`NewClientInquiryDialog` pattern
   * `FavoritesComparatorDialog` already uses to avoid two simultaneous
   * Radix Dialogs, applied here to avoid a Dialog-behind-Popover instead. */
  onNewClientInquiry: () => void;
}

// Matches Figma's `FA-Map-Tile` (444:5737) -- reuses the same
// EntityCard-independent building blocks AdvisorCard already composes
// (EntityPortrait/StatusTag/NameBlock/TenureLine/EntityActions), not a
// separate hand-rolled layout, per this repo's Map build plan.
export function AdvisorPopoverContent({
  advisor,
  size,
  onNewClientInquiry,
}: AdvisorPopoverContentProps) {
  const fullName = getFullName(advisor);
  const showsNewClientInquiry =
    advisor.newClientStatus === 'accepting' ||
    advisor.newClientStatus === 'waitlist';
  // `density="condensed"` -- a map pin popover's own limited space wants
  // smaller buttons than this component's other (roomier) callers, per
  // the user. `noInset` -- this popover's own outer padding (see the
  // `p-[…-large]` wrapper below) already insets this row; EntityActions'
  // own default horizontal inset/spacers on top of that read as a
  // double margin, per the user.
  const actions = (onNewClientInquiry?: () => void) => (
    <EntityActions
      primaryLabel="View Profile"
      primaryHref={`/advisor/${advisor.id}`}
      onNewClientInquiry={onNewClientInquiry}
      orientation="block"
      density="condensed"
      noInset
    />
  );

  // `microcopy`'s own 14px font-size token + a 16px literal line-height --
  // no semantic bundle combines those two values (`microcopy` itself is
  // 14/24), same "no clean token, arbitrary value with a comment"
  // precedent as AdvisorCard/StatusTag/EntityPortrait's own badge-size
  // overrides. Shared by both the designations subheading and the
  // tenure line below, per the user.
  const credentialTextClassName =
    'text-[length:var(--semantic-content-microcopy-font-size)] leading-[16px]';

  if (size === 'lg') {
    return (
      // 400px, not this component's own 280px `sm` width -- Figma's
      // Large `FA-Map-Tile` is ~160px (portrait) + ~209px (right column)
      // + padding; 280px was never wide enough to hold a 160px portrait
      // beside a real right column at all. 8px (`fixed-small`) padding,
      // not this component's own default 16px (`fixed-large`), per the
      // user -- except the right edge, which gets 4px extra (12px total)
      // to visually balance the portrait's own left-side margin.
      <div className="flex w-[400px] gap-[var(--density-spacing-fixed-large)] p-[var(--density-spacing-fixed-small)] pr-[calc(var(--density-spacing-fixed-small)_+_var(--density-spacing-fixed-x-small))]">
        {/* Left column: portrait, with its status corner badge (default
            `showBadge`, not suppressed like AdvisorCard's own ResultsList
            usage) -- the sole status indicator here now; the status tag
            originally stacked below it (for visual balance against the
            right column) was dropped, per the user, since the badge
            alone already communicates status. */}
        <EntityPortrait
          name={fullName}
          photoUrl={advisor.photoUrl}
          status={advisor.newClientStatus}
          size="lg"
          // 160x160 -- Figma's own FA-Portrait "Shape=Circle, Size=MD"
          // (`1:650`), per the user -- outside DS Avatar's own size
          // scale entirely (`2xl` tops out at 144px), so this overrides
          // the box/font/icon sizing directly, same pattern LocationCard's
          // own 240px avatar override uses.
          avatarClassName="size-[160px] text-[51px] [--avatar-icon-size:96px]"
        />
        {/* Right column: name/credentials, tenure, then actions. */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Each of the three relationships in this group set
              explicitly (not one shared parent `gap`), per the user:
              4px name-to-creds (`NameBlock`'s own internal gap), 4px
              creds-to-tenure (`TenureLine`'s own `mt-` below), and 16px
              down to Actions (that div's own `mt-`, further below). */}
          <div className="flex flex-col">
            <NameBlock
              heading={fullName}
              headingClassName="text-[length:var(--semantic-content-heavy-font-size)] leading-[length:var(--semantic-content-heavy-line-height)] font-[number:var(--semantic-content-heavy-font-weight)]"
              className="gap-[var(--density-spacing-fixed-x-small)]"
              subheading={
                advisor.designations.length > 0
                  ? advisor.designations.join(', ')
                  : undefined
              }
              subheadingClassName={credentialTextClassName}
            />
            <TenureLine
              years={advisor.tenureYears}
              textClassName={credentialTextClassName}
              // `+ 3px` compensates for TenureLine's own icon, which
              // carries a permanent `mt-[-3px]` baseline-alignment nudge
              // (see that component's own comment) -- that offset pulls
              // the icon up regardless of what margin a caller puts
              // above the whole row, so a plain 4px margin here only
              // ever reads as ~1px visually. This is what actually
              // caused the "4px gap not respected" report -- not a
              // margin-collapsing/override bug, a pre-existing constant
              // this component's icon always applies.
              className="mt-[calc(var(--density-spacing-fixed-x-small)_+_3px)]"
            />
          </div>
          {/* 16px (`fixed-large`) down to Actions -- wider than the
              tighter name/creds/tenure group above, per the user. */}
          <div className="mt-[var(--density-spacing-fixed-large)]">
            {showsNewClientInquiry ? actions(onNewClientInquiry) : actions()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-[260px] flex-col gap-[var(--density-spacing-fixed-small)] p-[var(--density-spacing-fixed-small)]">
      <div className="flex gap-[var(--density-spacing-fixed-large)]">
        <EntityPortrait
          name={fullName}
          photoUrl={advisor.photoUrl}
          status={advisor.newClientStatus}
          size="md"
          showBadge={false}
        />
        <NameBlock heading={fullName} className="self-center" />
      </div>
      {showsNewClientInquiry ? actions(onNewClientInquiry) : actions()}
    </div>
  );
}
