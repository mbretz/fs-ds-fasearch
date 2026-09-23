import type { Ref, SVGProps } from 'react';
import { forwardRef } from 'react';

/**
 * Locator-local stand-in for Figma's "stopwatch 1" (`1:474`, the `Badge`
 * component set's "waitlist" glyph, `202:3542`). Not a `packages/icons`
 * export -- see this directory's README for why, and for the running
 * list of icons staged here pending a real contribution to that package.
 *
 * Hand-written to match `packages/icons`' own generated-component shape
 * (forwardRef, spread `SVGProps`, `currentColor` swapped in for the
 * source SVG's literal `#D13805` stroke) so swapping to the real package
 * export later is a type-compatible drop-in. Previously wrongly mapped
 * to `packages/icons`' `DateClock` (a plain round clock face) -- Figma's
 * actual glyph is a stopwatch with a crown/stem and start button on top.
 */
const IconWaitlist = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    ref={ref}
    {...props}
  >
    <g clipPath="url(#icon-waitlist-clip)">
      <path
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 15.5C11.3137 15.5 14 12.8137 14 9.5C14 6.18629 11.3137 3.5 8 3.5C4.68629 3.5 2 6.18629 2 9.5C2 12.8137 4.68629 15.5 8 15.5Z"
      />
      <path
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 5L13.25 3.75"
      />
      <path
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 3.5L13.5 4"
      />
      <path
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 3.5V0.5"
      />
      <path
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.5 0.5H6.5"
      />
      <path
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 10L5.5 7.23267"
      />
    </g>
    <defs>
      <clipPath id="icon-waitlist-clip">
        <rect width={16} height={16} fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default forwardRef(IconWaitlist);
