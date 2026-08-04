import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSearch = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M16.488 15.455a8.198 8.198 0 1 0-1.032 1.032l5.298 5.3a.73.73 0 1 0 1.032-1.033zm-1.504-.515a6.738 6.738 0 1 0-9.572-9.485 6.738 6.738 0 0 0 9.572 9.485"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgSearch);
export default ForwardRef;
