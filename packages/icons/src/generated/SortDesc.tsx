import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSortDesc = (
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
      fill="#004B70"
      fillRule="evenodd"
      d="m11.993 15.996.02.002a.77.77 0 0 0 .522-.156l.088-.078 6.133-6.298a.8.8 0 0 0 .207-.376l.018-.105A1 1 0 0 0 19 8.806a.8.8 0 0 0-.679-.799L18.215 8H5.799a.79.79 0 0 0-.778.697l-.002.022a.82.82 0 0 0 .211.747l6.133 6.298a.77.77 0 0 0 .63.232"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgSortDesc);
export default ForwardRef;
