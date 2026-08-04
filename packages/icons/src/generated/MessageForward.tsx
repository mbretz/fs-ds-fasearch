import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgMessageForward = (
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
      d="M13.366 14.28H9.072a5.557 5.557 0 0 0-5.557 5.557H2v-5.051a7.07 7.07 0 0 1 7.072-7.072h4.293l-.002-1.694a2.021 2.021 0 0 1 3.503-1.373l4.598 4.98a2.02 2.02 0 0 1 0 2.74l-4.595 4.98a2.021 2.021 0 0 1-3.503-1.37zm-9.85 5.557c0 1.01-1.516 1.01-1.516 0zm5.556-7.072h5.052c.418 0 .757.34.757.758v2.453a.505.505 0 0 0 .876.342l4.594-4.978a.505.505 0 0 0 0-.685l-4.598-4.979a.505.505 0 0 0-.874.344l.002 2.45a.76.76 0 0 1-.757.76H9.072a5.557 5.557 0 0 0-5.557 5.556v.676a7.06 7.06 0 0 1 5.557-2.697"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgMessageForward);
export default ForwardRef;
