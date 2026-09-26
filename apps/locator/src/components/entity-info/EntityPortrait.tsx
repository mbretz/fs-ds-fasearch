import { useState, type CSSProperties } from 'react';
import { Avatar } from 'ds';
import type { NewClientStatus } from '../../data/locations';
import { statusMeta } from './statusMeta';
import { Badge } from './Badge';
import { cn } from '../../utils/cn';
import { getInitials } from '../../utils/getInitials';

type PortraitSize = 'sm' | 'md' | 'lg' | 'xl';

// 32px badge + a 4px white ring = 40px total, per the user -- no real
// token lands on either 32 or 40 (`density-sizing-fixed` tops out at
// `xx-large`, 24px), same "no clean token, arbitrary value with a
// comment" precedent as AdvisorCard's own 104px+4px avatar override.
// `box-content` puts the ring outside the 32px badge instead of the
// `border-box` default eating into it. Fixed rather than scaled by
// `size` -- the badge only ever renders at `xl` today (AdvisorCard); a
// second real consumer at a different portrait size can reintroduce a
// per-size scale then.
const badgeContentSize = 'size-[32px]';
const badgeRingClassName =
  'box-content rounded-full border-[4px] border-[color:var(--semantic-surface-base-default)]';

const avatarSizeBySize: Record<PortraitSize, 'sm' | 'md' | 'lg' | 'xl'> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
};

// Content-box white border around the avatar -- applies to both
// `associate` and `entity` (2026-09-21 correction: originally `associate`
// only, since FA-Portrait, the component this scale was measured off, is
// the associate-photo component and `entity` avatars like LocationCard's
// branch photo weren't part of it and showed no border in Figma at the
// time; the user has since confirmed `entity` should carry the same
// border too, superseding that earlier read). Scaled off Figma's
// FA-Portrait component set (`1:640`):
// `xl` (104px) is a locked-in 4px per the user (Figma's own closest real
// size, "SM", uses 6px, but 4px was the explicit call here); `lg` (80px)
// is a real Figma anchor too (its "XS" variant, 80px avatar, 4px border,
// matches exactly). `sm`/`md` have no Figma equivalent at all (Figma's
// ladder starts at 80px) -- 2px there is `xl`'s ~4/104 ratio applied and
// rounded to the nearest real `sizing.fixed` step, not a value read off
// the design file.
const avatarBorderClassName: Record<PortraitSize, string> = {
  sm: 'box-content border-[length:var(--density-sizing-fixed-xx-small)] border-[color:var(--semantic-surface-base-default)]',
  md: 'box-content border-[length:var(--density-sizing-fixed-xx-small)] border-[color:var(--semantic-surface-base-default)]',
  lg: 'box-content border-[length:var(--density-sizing-fixed-x-small)] border-[color:var(--semantic-surface-base-default)]',
  xl: 'box-content border-[length:var(--density-sizing-fixed-x-small)] border-[color:var(--semantic-surface-base-default)]',
};

export interface EntityPortraitProps {
  photoUrl?: string;
  /** Used for the Avatar fallback's initials and its accessible name. */
  name: string;
  size?: PortraitSize;
  variant?: 'associate' | 'entity';
  /** Renders the corner status badge (Figma's FA-Portrait "Show Badge"
   * slot) when set. Omit entirely for contexts with no new-client status
   * to show (e.g. a location/entity avatar). */
  status?: NewClientStatus;
  /**
   * Figma's Badge component set (`202:3542`) has both a `default` mode
   * (white ellipse fill, 2px status-color stroke) and an `inverse` mode
   * (solid status-color ellipse fill, same-color stroke) per status --
   * that much is directly confirmed from the fetched node data. What
   * isn't confirmed is the icon glyph's own color in either mode: Figma
   * returns the icon as a flattened `IMAGE-SVG` node with its color baked
   * into the image data rather than an inspectable `fills` override, so
   * rendering it white in `inverse` mode below is a contrast-driven
   * assumption on this component's part, not something read from Figma.
   * Every confirmed real usage found so far (FA-Portrait's own badge
   * instance) uses `default` -- no case that actually triggers `inverse`
   * was found in the nodes fetched, so this is a manual override for a
   * caller that finds one (e.g. a dark-surface card variant) rather than
   * an automatic rule.
   */
  badgeMode?: 'default' | 'inverse';
  /** Set false to suppress the badge even when `status` is set -- e.g.
   * AdvisorCard on the Results page, where `StatusTag` already shows the
   * same status above the portrait, per the user. Defaults to true. */
  showBadge?: boolean;
  /**
   * Overrides the underlying DS `Avatar`'s own size classes -- needed
   * when a caller's real dimension (e.g. LocationCard's 240x240px, from
   * Figma's `AvatarGroup` measurement) falls outside `Avatar`'s size
   * scale entirely (`xs`...`2xl` tops out at 144px). `size` above still
   * has to be set to something for `Avatar.Root`'s own required prop,
   * but this wins the conflicting size classes via `cn`'s tailwind-merge.
   */
  avatarClassName?: string;
  className?: string;
  /** Forwarded to the root element -- e.g. a caller assigning a dynamic,
   * per-entity `view-transition-name` (a card/pin popover's portrait
   * morphing into its profile page's own Hero portrait), which needs a
   * runtime-computed value a `className` string can't express. */
  style?: CSSProperties;
}

export function EntityPortrait({
  photoUrl,
  name,
  size = 'md',
  variant = 'associate',
  status,
  badgeMode = 'default',
  showBadge = true,
  avatarClassName,
  className,
  style,
}: EntityPortraitProps) {
  const initials = getInitials(name);
  const meta = showBadge && status ? statusMeta[status] : undefined;
  const BadgeIcon = meta?.icon;
  // Tracks Radix's own `imageLoadingStatus` reaching `'error'` -- Radix
  // renders `Avatar.Fallback` for `loading` AND `error` alike, so the
  // `:has()` hide-until-loaded rule below can't tell "still loading" from
  // "never going to load" on CSS alone; this is what tells it to reveal
  // Fallback anyway rather than hiding the avatar forever on a genuinely
  // broken photo URL.
  const [imageErrored, setImageErrored] = useState(false);

  return (
    <div
      className={cn('relative inline-flex shrink-0', className)}
      style={style}
    >
      {/* `Avatar.Root` always carries a solid background
       * (`--component-avatar-background-color`, brand gold) -- Fallback's
       * own opacity has no effect on that background, since it's painted
       * by Root itself, not by Fallback; every earlier attempt here
       * (Radix's own `delayMs`, then fading just Fallback's opacity) still
       * left that gold circle visible underneath with no initials on top
       * of it. Per the user: no gold should show at all while waiting on
       * a photo -- only the resolved portrait should ever appear, no
       * partial/placeholder state first.
       *
       * `:has()` (Baseline widely available, no fallback needed per this
       * repo's browser policy) hides `Avatar.Root` ENTIRELY (not just
       * Fallback) for as long as it still contains a `Fallback` child --
       * i.e. for as long as `Avatar.Image` hasn't resolved to `loaded`
       * yet -- then a plain `transition` fades it back in the instant
       * Fallback unmounts (Image swaps in). Scoped to
       * `.entity-portrait-has-photo` (set only when a `photoUrl` was
       * actually passed) so a real no-photo avatar -- where Fallback is
       * the permanent, only content, never replaced -- isn't hidden
       * forever by the same rule.
       *
       * `.entity-portrait-errored` (driven by `imageErrored` state, via
       * `onLoadingStatusChange` below) overrides that hide rule once the
       * photo has genuinely failed rather than just being slow --
       * higher specificity (two classes + `:has()`) wins over the plain
       * hide rule without needing `!important`, revealing initials
       * instead of hiding the avatar forever. */}
      <style>{`
        @keyframes entity-portrait-image-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .entity-portrait-has-photo {
          transition: opacity 150ms ease-out;
        }
        .entity-portrait-has-photo:has(.entity-portrait-fallback) {
          opacity: 0;
          transition: none;
        }
        .entity-portrait-has-photo.entity-portrait-errored:has(.entity-portrait-fallback) {
          opacity: 1;
          transition: opacity 150ms ease-out;
        }
        .entity-portrait-image {
          animation: entity-portrait-image-fade-in 150ms ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .entity-portrait-has-photo {
            transition: none;
          }
          .entity-portrait-image {
            animation: none;
          }
        }
      `}</style>
      <Avatar.Root
        size={avatarSizeBySize[size]}
        variant={variant}
        className={cn(
          avatarBorderClassName[size],
          photoUrl && 'entity-portrait-has-photo',
          imageErrored && 'entity-portrait-errored',
          avatarClassName,
        )}
      >
        {photoUrl && (
          <Avatar.Image
            src={photoUrl}
            alt=""
            className="entity-portrait-image"
            onLoadingStatusChange={(loadingStatus) =>
              setImageErrored(loadingStatus === 'error')
            }
          />
        )}
        <Avatar.Fallback className="entity-portrait-fallback">
          {initials}
        </Avatar.Fallback>
      </Avatar.Root>
      {meta && BadgeIcon && (
        // Flush at the avatar's own top-left corner, rendered on top of
        // it (no negative offset straddling the edge) -- DOM order alone
        // puts it above the avatar since neither element sets a z-index.
        <span
          className={cn(
            'absolute top-0 left-0 inline-flex items-center justify-center',
            badgeContentSize,
            badgeRingClassName,
          )}
        >
          <Badge
            icon={BadgeIcon}
            colorVar={meta.borderColorVar}
            mode={badgeMode}
            className="size-full"
          />
        </span>
      )}
    </div>
  );
}
