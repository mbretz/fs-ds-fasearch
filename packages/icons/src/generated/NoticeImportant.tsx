import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgNoticeImportant = (
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
      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10m0-1.482a8.519 8.519 0 1 1 0-17.037 8.519 8.519 0 0 1 0 17.038m.74-7.283v-6.79a.74.74 0 1 0-1.48 0v6.79a.74.74 0 1 0 1.48 0m-1.79 2.777a1.05 1.05 0 1 0 2.1 0 1.05 1.05 0 0 0-2.1 0"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgNoticeImportant);
export default ForwardRef;
