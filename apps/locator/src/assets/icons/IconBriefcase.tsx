import type { Ref, SVGProps } from 'react';
import { forwardRef } from 'react';

/**
 * Locator-local stand-in for Figma's "icon-briefcase" (`303:4188`), used
 * next to `TenureLine`. Not a `packages/icons` export -- see this
 * directory's README for why, and for the running list of icons staged
 * here pending a real contribution to that package.
 *
 * Hand-written to match `packages/icons`' own generated-component shape
 * (forwardRef, spread `SVGProps`, `currentColor` swapped in for the
 * source SVG's literal `#191A1A` stroke) so swapping to the real package
 * export later is a type-compatible drop-in.
 */
const IconBriefcase = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={19}
    height={17}
    viewBox="0 0 19 17"
    fill="none"
    ref={ref}
    {...props}
  >
    <path
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.9401 4.0867H1.82786C1.24692 4.0867 0.775965 4.53954 0.775965 5.09814V15.2126C0.775965 15.7712 1.24692 16.224 1.82786 16.224H16.9401C17.5211 16.224 17.992 15.7712 17.992 15.2126V5.09814C17.992 4.53954 17.5211 4.0867 16.9401 4.0867Z"
    />
    <path
      stroke="currentColor"
      strokeWidth={1.55193}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.21919 7.94373H14.5418M4.21919 12.3604H14.5418M3.06911 4.08676V2.98092M15.6919 4.08676V2.98092M11.9401 1.52444C11.8623 1.30524 11.7148 1.11507 11.5185 0.980777C11.3222 0.846485 11.087 0.774849 10.8462 0.775978H7.91486C7.42397 0.775978 6.98218 1.07267 6.82088 1.52444L5.93729 4.08676H12.8237L11.9401 1.52444V1.52444Z"
    />
  </svg>
);

export default forwardRef(IconBriefcase);
