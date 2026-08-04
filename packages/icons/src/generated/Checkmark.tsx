import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgCheckmark = (
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
      d="M21.478 2.234a1.25 1.25 0 0 0-1.744.288L8.038 18.838l-3.904-3.91a1.25 1.25 0 1 0-1.768 1.769l4.946 4.948a1.27 1.27 0 0 0 1.899-.155L21.766 3.98a1.25 1.25 0 0 0-.288-1.746"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgCheckmark);
export default ForwardRef;
