import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgHamburger = (
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
      d="M2.87 4h18.26s.87 0 .87.842v.842s0 .842-.87.842H2.87s-.87 0-.87-.842v-.842S2 4 2.87 4m0 6.737h18.26s.87 0 .87.842v.842s0 .842-.87.842H2.87s-.87 0-.87-.842v-.842s0-.842.87-.842m18.26 6.737H2.87c-.87 0-.87.842-.87.842v.842c0 .842.87.842.87.842h18.26c.87 0 .87-.842.87-.842v-.842c0-.842-.87-.842-.87-.842"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgHamburger);
export default ForwardRef;
