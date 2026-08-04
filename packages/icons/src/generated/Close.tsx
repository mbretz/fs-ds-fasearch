import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgClose = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M2.217 2.217a.74.74 0 0 1 1.048 0L12 10.952l8.735-8.735a.74.74 0 0 1 .965-.072l.083.072a.74.74 0 0 1 0 1.048L13.048 12l8.735 8.735a.74.74 0 0 1 .072.965l-.072.083a.74.74 0 0 1-1.048 0L12 13.048l-8.735 8.735a.74.74 0 0 1-.965.072l-.083-.072a.74.74 0 0 1 0-1.048L10.952 12 2.217 3.265a.74.74 0 0 1-.072-.965z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgClose);
export default ForwardRef;
