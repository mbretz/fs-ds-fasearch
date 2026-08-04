import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgShare = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M17.836 13.668a4.14 4.14 0 0 0-2.987 1.275l-4.575-2.29q.06-.323.066-.652a4 4 0 0 0-.066-.652l4.575-2.29a4.156 4.156 0 0 0 6.948-1.662A4.16 4.16 0 0 0 19.802 2.5a4.155 4.155 0 0 0-6.13 3.67q.006.328.065.652L9.162 9.11A4.164 4.164 0 0 0 2 12a4.168 4.168 0 0 0 5.033 4.075 4.16 4.16 0 0 0 2.13-1.183l4.574 2.288q-.06.325-.066.654a4.17 4.17 0 0 0 2.571 3.85 4.162 4.162 0 0 0 5.678-3.037 4.17 4.17 0 0 0-4.084-4.98"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgShare);
export default ForwardRef;
