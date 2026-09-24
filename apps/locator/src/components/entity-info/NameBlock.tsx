import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface NameBlockProps {
  /** An FA's name on AdvisorCard, or a location's address on LocationCard --
   * Figma's `.FA-Name+Accreditations` (`1:611`) repurposes the same slot
   * for both. `ReactNode`, not just `string`, so LocationCard can split
   * its address across two forced lines (street, then city/state/zip)
   * rather than one plain string. */
  heading: ReactNode;
  /**
   * Designations ("CFP®, CLU®") on AdvisorCard, or a branch summary on
   * LocationCard (an intro sentence + a list of counts, `ReactNode` for
   * that reason, not just `string`). Omitted entirely when there's
   * nothing to show.
   */
  subheading?: ReactNode;
  className?: string;
  /** Override for the heading's own classes -- the map pin popover's
   * name needs the real `Heavy` text style (`semantic.content.heavy`,
   * 600/16px/24px) instead of this component's own default `subheading`
   * bundle, per the user, without affecting every other caller that
   * keeps the default. */
  headingClassName?: string;
  /** Override for the subheading's own classes -- AdvisorCard needs its
   * designations line at the token-accurate 18px line-height without
   * affecting LocationCard's branch-summary subheading, which shares this
   * component but keeps the default. */
  subheadingClassName?: string;
}

// No single semantic content-token bundle matches Figma's exact heading
// style (Bold 700 / 20px / 24px line-height) or subheading style (Medium
// 500 / 16px / 18px line-height) -- both are ad hoc overrides in Figma
// itself, not named reusable text styles. `subheading` (20px/525weight/
// 30px line-height) and `common` (16px/400weight/24px line-height) are
// the closest existing bundles by font-size, same "pick the nearest whole
// bundle rather than reconstruct an unlisted combination" approach
// FilterFacets already used for its own microcopy text.
export function NameBlock({
  heading,
  subheading,
  className,
  headingClassName,
  subheadingClassName,
}: NameBlockProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-[var(--density-spacing-fixed-small)]',
        className,
      )}
    >
      <span
        className={cn(
          'text-[length:var(--semantic-content-subheading-font-size)] leading-[length:var(--semantic-content-subheading-line-height)] font-[number:var(--semantic-content-subheading-font-weight)] text-[color:var(--semantic-content-common-text-color-default)]',
          headingClassName,
        )}
      >
        {heading}
      </span>
      {subheading && (
        <div
          className={cn(
            'text-[length:var(--semantic-content-common-font-size)] leading-[length:var(--semantic-content-common-line-height)] font-[number:var(--semantic-content-common-font-weight)] text-[color:var(--semantic-content-common-text-color-default)]',
            subheadingClassName,
          )}
        >
          {subheading}
        </div>
      )}
    </div>
  );
}
