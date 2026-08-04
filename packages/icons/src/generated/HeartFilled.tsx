import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgHeartFilled = (
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
      d="M2.07 9.98a5 5 0 0 1 .496-3.132c.38-.73.933-1.363 1.617-1.847a5.5 5.5 0 0 1 2.313-.934 5.55 5.55 0 0 1 2.501.182c.807.251 1.54.683 2.14 1.26l.863.83.864-.83a5.4 5.4 0 0 1 2.14-1.26 5.55 5.55 0 0 1 2.501-.182c.837.13 1.63.45 2.313.934a5.2 5.2 0 0 1 1.617 1.847c.502.968.676 2.063.496 3.13a5.1 5.1 0 0 1-1.493 2.815l-7.986 8.022A.64.64 0 0 1 12 21a.64.64 0 0 1-.45-.185l-7.986-8.02A5.1 5.1 0 0 1 2.069 9.98"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgHeartFilled);
export default ForwardRef;
