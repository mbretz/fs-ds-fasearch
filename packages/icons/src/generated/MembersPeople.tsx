import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgMembersPeople = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
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
      d="M8.296 4a4.136 4.136 0 0 1 1.107 8.122c2.95.523 5.19 3.1 5.19 6.199a.74.74 0 1 1-1.482 0 4.815 4.815 0 1 0-9.63 0 .74.74 0 0 1-1.481 0c0-3.1 2.24-5.676 5.19-6.2A4.138 4.138 0 0 1 8.295 4m0 1.481a2.654 2.654 0 1 0 0 5.31 2.654 2.654 0 0 0 0-5.31m11.936 4.507a3.518 3.518 0 1 0-4.91 3.232q-.222.06-.44.141a.74.74 0 1 0 .513 1.39 3.805 3.805 0 0 1 5.124 3.57.74.74 0 1 0 1.481 0 5.29 5.29 0 0 0-3.896-5.1 3.52 3.52 0 0 0 2.128-3.233m-5.555 0a2.037 2.037 0 1 1 4.074 0 2.037 2.037 0 0 1-4.075 0"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgMembersPeople);
export default ForwardRef;
