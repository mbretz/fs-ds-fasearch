import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgCheckmarkSquare = (
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
      d="M21.608 2.233a1.05 1.05 0 0 0-1.48.16l-9.79 12.14-3.383-3.382a1.053 1.053 0 0 0-1.489 1.489l4.21 4.21a1.064 1.064 0 0 0 1.564-.084L21.766 3.714a1.05 1.05 0 0 0-.158-1.48"
    />
    <path
      fill="currentColor"
      d="M18 11.474a.84.84 0 0 0-.843.842v7.79a.21.21 0 0 1-.21.21H3.895a.21.21 0 0 1-.21-.21V7.052a.21.21 0 0 1 .21-.21h9.473a.842.842 0 0 0 0-1.684H3.684A1.684 1.684 0 0 0 2 6.843v13.473A1.684 1.684 0 0 0 3.684 22h13.473a1.685 1.685 0 0 0 1.685-1.684v-8a.84.84 0 0 0-.842-.842"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgCheckmarkSquare);
export default ForwardRef;
