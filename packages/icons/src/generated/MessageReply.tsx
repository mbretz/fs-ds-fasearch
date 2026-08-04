import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgMessageReply = (
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
      d="M10.634 14.28h4.294a5.557 5.557 0 0 1 5.557 5.557H22v-5.051a7.07 7.07 0 0 0-7.072-7.072h-4.293l.002-1.694a2.021 2.021 0 0 0-3.503-1.373l-4.598 4.98a2.02 2.02 0 0 0 0 2.74l4.595 4.98a2.021 2.021 0 0 0 3.503-1.37zm9.85 5.557c0 1.01 1.516 1.01 1.516 0zm-5.556-7.072H9.876a.76.76 0 0 0-.757.758v2.453a.505.505 0 0 1-.876.342L3.65 11.34a.505.505 0 0 1 0-.685l4.598-4.979a.505.505 0 0 1 .874.344L9.12 8.47c0 .42.339.76.757.76h5.052a5.557 5.557 0 0 1 5.557 5.556v.676a7.06 7.06 0 0 0-5.557-2.697"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgMessageReply);
export default ForwardRef;
