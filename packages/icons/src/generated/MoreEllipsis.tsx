import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgMoreEllipsis = (
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
      d="M4.708 14.417a2.708 2.708 0 1 0 0-5.417 2.708 2.708 0 0 0 0 5.417M12 14.417A2.708 2.708 0 1 0 12 9a2.708 2.708 0 0 0 0 5.417M19.292 14.417a2.708 2.708 0 1 0 0-5.417 2.708 2.708 0 0 0 0 5.417"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgMoreEllipsis);
export default ForwardRef;
