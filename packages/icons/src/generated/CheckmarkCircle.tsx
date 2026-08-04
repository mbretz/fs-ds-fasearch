import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgCheckmarkCircle = (
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
      fill="#247E58"
      fillRule="evenodd"
      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10m0-1.482a8.518 8.518 0 1 1 0-17.036 8.518 8.518 0 0 1 0 17.037m-3.527-4.222-2.017-2.862a.74.74 0 1 1 1.211-.853l2.027 2.876a.12.12 0 0 0 .098.054q.06.004.11-.06l6.455-8.166a.74.74 0 1 1 1.162.918l-6.446 8.156a1.604 1.604 0 0 1-2.6-.063"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgCheckmarkCircle);
export default ForwardRef;
