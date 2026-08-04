import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSortable = (
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
      d="M5.017 8.77a.75.75 0 0 1 .203-.692l5.857-5.858a.75.75 0 0 1 .602-.217.75.75 0 0 1 .601.217l5.858 5.858a.75.75 0 0 1 .215.452.75.75 0 0 1-.732.912H5.764a.75.75 0 0 1-.747-.672M5.017 15.23a.75.75 0 0 0 .203.692l5.857 5.858a.75.75 0 0 0 .602.217.75.75 0 0 0 .601-.217l5.858-5.858a.75.75 0 0 0 .215-.452.75.75 0 0 0-.732-.912H5.764a.75.75 0 0 0-.747.672"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgSortable);
export default ForwardRef;
