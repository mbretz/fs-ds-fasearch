import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgIndentLeft = (
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
      d="M18.667 18.667H13.25a.834.834 0 0 0 0 1.666h5.417a.834.834 0 0 0 0-1.666M21.167 14.917H13.25a.834.834 0 0 0 0 1.666h7.917a.834.834 0 0 0 0-1.666M13.25 12.833h5.417a.834.834 0 0 0 0-1.666H13.25a.834.834 0 0 0 0 1.666M13.25 9.083h7.917a.833.833 0 0 0 0-1.666H13.25a.833.833 0 0 0 0 1.666M13.25 5.333h5.417a.833.833 0 0 0 0-1.666H13.25a.833.833 0 0 0 0 1.666M10.333 2a.833.833 0 0 0-.833.833v18.334a.833.833 0 0 0 1.667 0V2.833A.833.833 0 0 0 10.333 2M5.083 9.206a.626.626 0 0 0-1 .5v1.25a.21.21 0 0 1-.208.208H2.833a.834.834 0 0 0 0 1.667h1.041a.21.21 0 0 1 .208.208v1.25a.623.623 0 0 0 1 .5L8.139 12.5a.625.625 0 0 0 0-1z"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIndentLeft);
export default ForwardRef;
