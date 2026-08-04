import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgDataVisColumnChart = (
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
      d="M13.235 3h-2.47c-.75 0-1.358.608-1.358 1.358v14.691H8.42v-7.284c0-.75-.608-1.358-1.358-1.358h-2.47c-.75 0-1.357.609-1.357 1.358v7.284H2.74a.74.74 0 1 0 0 1.482h18.518a.74.74 0 0 0 0-1.482h-.494V8.062c0-.75-.608-1.358-1.358-1.358h-2.469c-.75 0-1.358.608-1.358 1.358v10.987h-.987V4.358c0-.75-.609-1.358-1.358-1.358m3.827 16.05h2.222V8.184h-2.222zm-3.95 0h-2.223V4.48h2.222zm-8.396 0h2.222v-7.161H4.716z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgDataVisColumnChart);
export default ForwardRef;
