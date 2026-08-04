import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgObjectAddSm = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    ref={ref}
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M8 15a7 7 0 1 0-7-7 7.01 7.01 0 0 0 7 7M8 2.49a5.51 5.51 0 1 1 0 11.02A5.51 5.51 0 0 1 8 2.49m-.894 6.255H4.588a.745.745 0 1 1 0-1.49h2.518a.15.15 0 0 0 .15-.149V4.588a.745.745 0 0 1 1.489 0v2.518c0 .083.066.15.149.15h2.518a.745.745 0 1 1 0 1.489H8.894a.15.15 0 0 0-.15.149v2.518a.745.745 0 1 1-1.489 0V8.894a.15.15 0 0 0-.149-.15"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgObjectAddSm);
export default ForwardRef;
