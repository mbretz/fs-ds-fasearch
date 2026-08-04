import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgHyperlinkLink = (
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
      d="M14.484 3.14a4.45 4.45 0 0 1 3.391.154A4.455 4.455 0 0 1 20.002 9.2v.002l-1.615 3.43v.002a4.454 4.454 0 0 1-5.908 2.128 4.42 4.42 0 0 1-2.295-2.556.877.877 0 0 0-1.658.573 6.18 6.18 0 0 0 3.207 3.57l.002.002a6.21 6.21 0 0 0 8.238-2.967v-.002l1.617-3.436.001-.002a6.21 6.21 0 0 0-2.966-8.236l-.005-.002a6.21 6.21 0 0 0-8.237 2.967.877.877 0 1 0 1.585.751 4.45 4.45 0 0 1 2.516-2.283M7.425 9.084a4.45 4.45 0 0 1 3.392.154 4.44 4.44 0 0 1 2.45 3.116.877.877 0 0 0 1.719-.355 6.19 6.19 0 0 0-3.422-4.349l-.004-.001a6.21 6.21 0 0 0-8.236 2.967l-1.617 3.438-.001.002a6.21 6.21 0 0 0 2.966 8.237l.005.002a6.21 6.21 0 0 0 8.237-2.966.877.877 0 1 0-1.585-.752 4.455 4.455 0 0 1-5.907 2.13 4.455 4.455 0 0 1-2.127-5.908l1.615-3.432a4.45 4.45 0 0 1 2.515-2.283"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgHyperlinkLink);
export default ForwardRef;
