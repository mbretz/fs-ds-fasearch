import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgZoomOut = (
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
      d="M16.499 15.45a8.2 8.2 0 1 0-1.047 1.048l5.283 5.284a.74.74 0 1 0 1.048-1.047zm-1.525-.523a6.718 6.718 0 1 0-9.548-9.454 6.718 6.718 0 0 0 9.548 9.454m-8.529-4.039h7.407a.74.74 0 1 0 0-1.481H6.445a.74.74 0 0 0 0 1.481"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgZoomOut);
export default ForwardRef;
