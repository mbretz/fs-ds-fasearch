import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgObjectSubtract = (
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
      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10m0-1.482a8.519 8.519 0 1 1 0-17.037 8.519 8.519 0 0 1 0 17.038M16.444 12a.74.74 0 0 1-.74.74H8.296a.74.74 0 1 1 0-1.48h7.408c.409 0 .74.33.74.74"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgObjectSubtract);
export default ForwardRef;
