import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgTransferArrows = (
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
      d="m2.218 9.735 2.468 2.468a.74.74 0 1 0 1.048-1.048L4.529 9.951h8.706a.74.74 0 0 0 0-1.482H4.529l1.205-1.204a.74.74 0 1 0-1.048-1.048l-2.469 2.47a.74.74 0 0 0 .001 1.048m16.048 7.406a.74.74 0 0 1 0-1.047l1.205-1.205h-8.706a.74.74 0 1 1 0-1.482h8.706l-1.205-1.204a.74.74 0 0 1 1.048-1.048l2.469 2.47a.74.74 0 0 1 0 1.047l-2.47 2.47a.74.74 0 0 1-1.047 0"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgTransferArrows);
export default ForwardRef;
