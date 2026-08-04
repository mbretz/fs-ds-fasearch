import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgZoomIn = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M15.451 16.497a8.2 8.2 0 1 1 1.047-1.048l5.285 5.286a.74.74 0 0 1-1.048 1.047zm-.523-1.525a6.718 6.718 0 1 1-9.456-9.546 6.718 6.718 0 0 1 9.456 9.546m-1.076-4.084H10.89v2.963a.74.74 0 1 1-1.48 0v-2.963H6.444a.74.74 0 1 1 0-1.481h2.963V6.444a.74.74 0 1 1 1.482 0v2.963h2.962a.74.74 0 1 1 0 1.481"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgZoomIn);
export default ForwardRef;
