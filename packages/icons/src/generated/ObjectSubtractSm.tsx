import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgObjectSubtractSm = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
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
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M8 1a7 7 0 1 0 7 7 7.01 7.01 0 0 0-7-7m0 12.51A5.51 5.51 0 1 1 8 2.49a5.51 5.51 0 0 1 0 11.02M3.843 8c0-.411.334-.745.745-.745h6.824a.745.745 0 1 1 0 1.49H4.588A.745.745 0 0 1 3.843 8"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgObjectSubtractSm);
export default ForwardRef;
