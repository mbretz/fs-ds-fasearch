import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgChevronRight = (
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
      d="M6.967 20.736a.742.742 0 0 0 1.049 1.048l8.836-8.824a1.356 1.356 0 0 0 0-1.92L8.015 2.217a.742.742 0 0 0-1.049 1.048L15.715 12z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgChevronRight);
export default ForwardRef;
