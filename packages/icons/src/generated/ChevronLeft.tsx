import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgChevronLeft = (
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
      d="m8.535 12 8.748-8.735a.742.742 0 0 0-1.049-1.048L7.398 11.04a1.356 1.356 0 0 0 0 1.92l8.836 8.823a.742.742 0 0 0 1.049-1.048z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgChevronLeft);
export default ForwardRef;
