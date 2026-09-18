import { Avatar } from 'ds';
import type { NewClientStatus } from '../../data/locations';
import { statusMeta } from './statusMeta';
import { cn } from '../../utils/cn';

type PortraitSize = 'sm' | 'md' | 'lg' | 'xl';

// Figma's FA-Portrait (`1:640`) badge frame sizes (LG 52px / MD+SM 40px /
// XS 28px) aren't a clean percentage of their avatar circle, and don't
// land on the `sizing.fixed` scale either -- this maps each size to the
// closest step on that scale (rather than an arbitrary Tailwind value) so
// the badge still resolves through a real token, capping at `xx-large`
// (24px, the tier's own ceiling) for `xl` instead of reaching into the
// unrelated `layout` tier just because its larger numbered steps
// (`4x-large` etc.) happen to match Figma's pixel values -- that tier is
// documented for page-level composition spacing, not component sizing.
const badgeSizeClassName: Record<PortraitSize, string> = {
  sm: 'size-[var(--density-sizing-fixed-large)]',
  md: 'size-[var(--density-sizing-fixed-x-large)]',
  lg: 'size-[var(--density-sizing-fixed-xx-large)]',
  xl: 'size-[var(--density-sizing-fixed-xx-large)]',
};

const avatarSizeBySize: Record<PortraitSize, 'sm' | 'md' | 'lg' | 'xl'> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
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
}

export function EntityPortrait({
  photoUrl,
  name,
  size = 'md',
  variant = 'associate',
  status,
  badgeMode = 'default',
  avatarClassName,
  className,
}: EntityPortraitProps) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');
  const meta = status ? statusMeta[status] : undefined;
  const BadgeIcon = meta?.icon;

  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <Avatar.Root
        size={avatarSizeBySize[size]}
        variant={variant}
        className={avatarClassName}
      >
        {photoUrl && <Avatar.Image src={photoUrl} alt="" />}
        <Avatar.Fallback>{initials}</Avatar.Fallback>
      </Avatar.Root>
      {meta && BadgeIcon && (
        <span
          aria-hidden="true"
          className={cn(
            'absolute top-0 left-0 inline-flex -translate-x-1/4 -translate-y-1/4 items-center justify-center rounded-full border-[length:var(--component-tag-border-width)]',
            badgeSizeClassName[size],
          )}
          style={{
            borderColor: meta.borderColorVar,
            backgroundColor:
              badgeMode === 'inverse'
                ? meta.borderColorVar
                : 'var(--semantic-surface-base-default)',
            color:
              badgeMode === 'inverse'
                ? 'var(--semantic-content-common-text-color-reverse)'
                : meta.borderColorVar,
          }}
        >
          <BadgeIcon className="size-1/2" />
        </span>
      )}
    </div>
  );
}
