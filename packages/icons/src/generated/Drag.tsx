import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgDrag = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M8.62 6.762A2.38 2.38 0 1 0 8.62 2a2.38 2.38 0 0 0 0 4.762m0 7.619a2.381 2.381 0 1 0 0-4.762 2.381 2.381 0 0 0 0 4.762M11 19.619a2.38 2.38 0 1 1-4.762 0 2.38 2.38 0 0 1 4.762 0m5.238-12.857a2.381 2.381 0 1 0 0-4.762 2.381 2.381 0 0 0 0 4.762M18.62 12a2.381 2.381 0 1 1-4.762 0 2.381 2.381 0 0 1 4.762 0m-2.38 10a2.38 2.38 0 1 0 0-4.762 2.38 2.38 0 0 0 0 4.762"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgDrag);
export default ForwardRef;
