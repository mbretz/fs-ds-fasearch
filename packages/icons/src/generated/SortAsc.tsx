import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSortAsc = (
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
      d="m11.993 8.004.02-.002a.77.77 0 0 1 .522.156l.088.078 6.133 6.297a.8.8 0 0 1 .207.377l.018.105a1 1 0 0 1 .019.179.8.8 0 0 1-.679.799l-.106.007H5.799a.79.79 0 0 1-.778-.697l-.002-.022a.82.82 0 0 1 .211-.748l6.133-6.297a.77.77 0 0 1 .63-.232"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgSortAsc);
export default ForwardRef;
