import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgChevronDoubleDown = (
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
      d="m12 11.345 5.254-5.136a.74.74 0 0 1 1.032 0 .7.7 0 0 1 0 1.009l-5.7 5.573a.74.74 0 0 1-.586.206.74.74 0 0 1-.585-.206L5.714 7.218a.7.7 0 0 1 0-1.01.74.74 0 0 1 1.032.001zm0 6.652c.21.02.425-.05.585-.206l5.701-5.573a.7.7 0 0 0 0-1.01.74.74 0 0 0-1.032.001L12 16.345 6.746 11.21a.74.74 0 0 0-1.032 0 .7.7 0 0 0 0 1.009l5.7 5.573c.16.157.377.225.586.206"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgChevronDoubleDown);
export default ForwardRef;
