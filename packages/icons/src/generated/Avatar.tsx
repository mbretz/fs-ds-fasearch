import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgAvatar = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
    ref={ref}
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M11.765 12.124a5.062 5.062 0 1 0 0-10.124 5.062 5.062 0 0 0 0 10.124m0-1.482a3.58 3.58 0 1 1 0-7.16 3.58 3.58 0 0 1 0 7.16m0 3.333a7.284 7.284 0 0 0-7.284 7.284.74.74 0 0 1-1.481 0 8.765 8.765 0 1 1 17.53 0 .74.74 0 0 1-1.48 0 7.284 7.284 0 0 0-7.285-7.284"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgAvatar);
export default ForwardRef;
