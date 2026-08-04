import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgObjectAdd = (
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
      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10m0-1.482a8.519 8.519 0 1 1 0-17.037 8.519 8.519 0 0 1 0 17.038m-.74-12.222v2.963H8.295a.74.74 0 1 0 0 1.482h2.963v2.963a.74.74 0 1 0 1.482 0V12.74h2.963a.74.74 0 1 0 0-1.482H12.74V8.296a.74.74 0 1 0-1.482 0"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgObjectAdd);
export default ForwardRef;
