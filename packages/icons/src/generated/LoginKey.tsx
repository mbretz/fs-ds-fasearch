import * as React from 'react';
import type { SVGProps } from 'react';
import { Ref, forwardRef } from 'react';
const SvgLoginKey = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    ref={ref}
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        fill="currentColor"
        d="m15.184 3.65-.84-.873.586-.587a1.27 1.27 0 0 0 .374-.9A1.28 1.28 0 0 0 13.11.383L5.777 7.717a4 4 0 1 0 1.807 1.806l2.493-2.493.507.513A1.167 1.167 0 0 0 12.23 5.89l-.453-.52.947-.947.84.847a1.194 1.194 0 0 0 1.646 0 1.174 1.174 0 0 0-.026-1.62M4.03 9.29a2 2 0 1 1 0 4 2 2 0 0 1 0-4"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
);
const ForwardRef = forwardRef(SvgLoginKey);
export default ForwardRef;
