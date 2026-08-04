import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgFilter = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M21.912 2.46a.83.83 0 0 0-.745-.46H2.833a.833.833 0 0 0-.666 1.333L9.5 13.186v7.147A1.68 1.68 0 0 0 11.167 22c.36 0 .711-.117 1-.333l1.666-1.25a1.67 1.67 0 0 0 .667-1.334v-5.897l7.333-9.853a.83.83 0 0 0 .079-.873M6.514 3.833l3.283 4.375c.054.072.083.16.083.25V9.5a.417.417 0 0 1-.75.25L5.017 4.333a.417.417 0 0 1 .333-.666h.833a.42.42 0 0 1 .331.166"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgFilter);
export default ForwardRef;
