import type { Ref, SVGProps } from 'react';
import { forwardRef } from 'react';

/**
 * Locator-local stand-in for Figma's "Profile Icon" component set's
 * Education variant (`1:741`, inner icon group `1:750` -- the circle
 * background is intentionally excluded). Not a `packages/icons` export
 * -- see this directory's README for why, and for the running list of
 * icons staged here pending a real contribution to that package.
 *
 * Hand-written to match `packages/icons`' own generated-component shape
 * (forwardRef, spread `SVGProps`, `currentColor` swapped in for the
 * source SVG's literal `#191A1A` stroke) so swapping to the real package
 * export later is a type-compatible drop-in.
 */
const IconEducation = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={27}
    height={26}
    viewBox="0 0 27 26"
    fill="none"
    ref={ref}
    {...props}
  >
    <path
      stroke="currentColor"
      strokeWidth={1.55502}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.4977 25.2017V5.50479C13.4977 5.50479 10.7194 2.43621 1.36852 2.31181C1.29053 2.31041 1.21306 2.32473 1.14074 2.35393C1.06841 2.38313 1.00271 2.4266 0.947553 2.48175C0.8924 2.53691 0.848926 2.60261 0.819728 2.67494C0.790529 2.74726 0.776205 2.82473 0.777611 2.90272V21.4179C0.774796 21.5701 0.831896 21.7173 0.936608 21.8279C1.04132 21.9384 1.18526 22.0034 1.33742 22.0088C10.7194 22.1228 13.4977 25.2225 13.4977 25.2225M10.1077 12.8134C8.18255 12.1662 6.18311 11.7657 4.15719 11.6212M10.1077 17.5614C8.18238 16.9149 6.18302 16.5143 4.15719 16.3692M16.8876 12.8134C18.8128 12.1662 20.8123 11.7657 22.8382 11.6212M16.8876 17.5614C18.813 16.9149 20.8124 16.5143 22.8382 16.3692"
    />
    <path
      stroke="currentColor"
      strokeWidth={1.55502}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M22.8382 2.4362C23.6986 2.36364 24.6316 2.3118 25.6372 2.30144C25.7143 2.30142 25.7907 2.31678 25.8618 2.3466C25.9329 2.37642 25.9974 2.42011 26.0514 2.47512C26.1055 2.53013 26.148 2.59536 26.1766 2.66699C26.2051 2.73863 26.2191 2.81524 26.2178 2.89234V21.4075C26.2206 21.5597 26.1635 21.707 26.0588 21.8175C25.9541 21.928 25.8101 21.993 25.658 21.9984C16.276 22.1124 13.4977 25.2121 13.4977 25.2121M13.4977 25.2121V5.51515C13.4977 5.51515 14.7935 4.07416 18.5878 3.13078"
    />
    <path
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22.8279 8.24162V0.777511C21.3989 0.889898 19.9812 1.11522 18.5878 1.45135V8.24162L20.7027 6.54146L22.8279 8.24162Z"
    />
  </svg>
);

export default forwardRef(IconEducation);
