import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgDataVisPieChart = (
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
      d="M13.325 11.404a.73.73 0 0 1-.729-.729V2.728c0-.402.326-.728.729-.728A8.675 8.675 0 0 1 22 10.676a.73.73 0 0 1-.729.728zm7.182-1.457a7.22 7.22 0 0 0-6.454-6.454v6.454zm-9.103 2.649h7.218c.403 0 .729.326.729.729A8.675 8.675 0 0 1 10.676 22 8.675 8.675 0 0 1 2 13.325a8.675 8.675 0 0 1 8.676-8.676c.402 0 .728.326.728.728zM9.71 6.17a7.22 7.22 0 1 0 8.148 7.883h-7.183a.73.73 0 0 1-.728-.729V6.143z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgDataVisPieChart);
export default ForwardRef;
