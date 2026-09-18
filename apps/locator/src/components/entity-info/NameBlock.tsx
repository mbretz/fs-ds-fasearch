import { cn } from '../../utils/cn';

export interface NameBlockProps {
  /** An FA's name on AdvisorCard, or a location's address on LocationCard --
   * Figma's `.FA-Name+Accreditations` (`1:611`) repurposes the same slot
   * for both. */
  heading: string;
  /**
   * Designations ("CFP®, CLU®") on AdvisorCard, or a branch summary
   * ("6 Financial Advisors / 2 Administrative Staff") on LocationCard.
   * Omitted entirely when there's nothing to show.
   */
  subheading?: string;
  className?: string;
}

// No single semantic content-token bundle matches Figma's exact heading
// style (Bold 700 / 20px / 24px line-height) or subheading style (Medium
// 500 / 16px / 18px line-height) -- both are ad hoc overrides in Figma
// itself, not named reusable text styles. `subheading` (20px/525weight/
// 30px line-height) and `common` (16px/400weight/24px line-height) are
// the closest existing bundles by font-size, same "pick the nearest whole
// bundle rather than reconstruct an unlisted combination" approach
// FilterFacets already used for its own microcopy text.
export function NameBlock({ heading, subheading, className }: NameBlockProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-[var(--density-spacing-fixed-small)]',
        className,
      )}
    >
      <span className="text-[length:var(--semantic-content-subheading-font-size)] leading-[length:var(--semantic-content-subheading-line-height)] font-[number:var(--semantic-content-subheading-font-weight)] text-[color:var(--semantic-content-common-text-color-default)]">
        {heading}
      </span>
      {subheading && (
        <span className="text-[length:var(--semantic-content-common-font-size)] leading-[length:var(--semantic-content-common-line-height)] font-[number:var(--semantic-content-common-font-weight)] text-[color:var(--semantic-content-common-text-color-default)]">
          {subheading}
        </span>
      )}
    </div>
  );
}
