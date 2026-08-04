import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgGridTwo = (
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
      d="M8.962 3.5H3.5v5.462h5.462zM3.5 2H2v8.462h8.462V2H3.5m0 13.039h5.462V20.5H3.5zm-1.5-1.5h8.462V22H2v-8.461m13.039 1.5H20.5V20.5h-5.461zm-1.5-1.5H22V22h-8.461v-8.461m1.5-10.039H20.5v5.462h-5.461zm-1.5-1.5H22v8.462h-8.461V2"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgGridTwo);
export default ForwardRef;
