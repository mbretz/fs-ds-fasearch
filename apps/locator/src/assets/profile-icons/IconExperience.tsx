import type { Ref, SVGProps } from 'react';
import { forwardRef } from 'react';

/**
 * Locator-local stand-in for Figma's "Profile Icon" component set's
 * Experience variant (`1:741`, inner icon group `1:744` -- the circle
 * background is intentionally excluded). Not a `packages/icons` export
 * -- see this directory's README for why, and for the running list of
 * icons staged here pending a real contribution to that package.
 *
 * Hand-written to match `packages/icons`' own generated-component shape
 * (forwardRef, spread `SVGProps`, `currentColor` swapped in for the
 * source SVG's literal `#191A1A` stroke) so swapping to the real package
 * export later is a type-compatible drop-in.
 */
const IconExperience = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={27}
    height={25}
    viewBox="0 0 27 25"
    fill="none"
    ref={ref}
    {...props}
  >
    <path
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M24.3752 5.79683H2.30438C1.45593 5.79683 0.768127 6.48464 0.768127 7.33308V22.6956C0.768127 23.5441 1.45593 24.2319 2.30438 24.2319H24.3752C25.2237 24.2319 25.9115 23.5441 25.9115 22.6956V7.33308C25.9115 6.48464 25.2237 5.79683 24.3752 5.79683Z"
    />
    <path
      stroke="currentColor"
      strokeWidth={1.53625}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.79682 11.6551H20.8726M5.79682 18.3634H20.8726M4.11718 5.79682V4.11718M22.5522 5.79682V4.11718M17.0729 1.90497C16.9592 1.57203 16.7438 1.28318 16.4572 1.07921C16.1705 0.875238 15.827 0.766432 15.4752 0.768147H11.1942C10.4773 0.768147 9.83204 1.21878 9.59648 1.90497L8.30603 5.79682H18.3634L17.0729 1.90497V1.90497Z"
    />
  </svg>
);

export default forwardRef(IconExperience);
