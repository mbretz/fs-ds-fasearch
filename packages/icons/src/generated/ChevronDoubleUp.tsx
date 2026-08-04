import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgChevronDoubleUp = (
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
      d="M12 6.003c.209-.02.425.05.585.206l5.701 5.573a.7.7 0 0 1 0 1.01.74.74 0 0 1-1.032-.001L12 7.655 6.746 12.79a.74.74 0 0 1-1.032 0 .7.7 0 0 1 0-1.009l5.7-5.573A.74.74 0 0 1 12 6.003m0 6.652L6.746 17.79a.74.74 0 0 1-1.032 0 .7.7 0 0 1 0-1.009l5.7-5.573a.74.74 0 0 1 .586-.206c.209-.02.425.05.585.206l5.701 5.573a.7.7 0 0 1 0 1.01.74.74 0 0 1-1.032-.001z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgChevronDoubleUp);
export default ForwardRef;
