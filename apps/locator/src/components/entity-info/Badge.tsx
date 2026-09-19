import type { ComponentType, SVGProps } from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** A status color CSS var, e.g. `statusMeta[status].borderColorVar`. */
  colorVar: string;
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
   */
  mode?: 'default' | 'inverse';
  /**
   * Caller-supplied, token-driven box size class (e.g.
   * `size-[var(--density-sizing-fixed-large)]`) -- a passthrough rather
   * than an internal size enum since callers land on genuinely different
   * contexts (EntityPortrait's avatar-corner badge, sized off the
   * avatar's own size step; StatusTag's Large-variant badge, Figma's own
   * fixed measurement) rather than one shared scale.
   */
  className?: string;
}

// Shared by `EntityPortrait` (the avatar corner badge) and `StatusTag`
// (the Large variant's own leading badge, per Figma's `Show Slot Start`
// property on its Tag instance) -- both render the same status-colored
// circle + icon Figma component (`202:3542`), previously duplicated
// inline only in EntityPortrait.
export function Badge({
  icon: Icon,
  colorVar,
  mode = 'default',
  className,
}: BadgeProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex items-center justify-center rounded-full border-[length:var(--component-tag-border-width)]',
        className,
      )}
      style={{
        borderColor: colorVar,
        backgroundColor:
          mode === 'inverse'
            ? colorVar
            : 'var(--semantic-surface-base-default)',
        color:
          mode === 'inverse'
            ? 'var(--semantic-content-common-text-color-reverse)'
            : colorVar,
      }}
    >
      <Icon className="size-1/2" />
    </span>
  );
}
