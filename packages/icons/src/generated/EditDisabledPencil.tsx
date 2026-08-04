import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgEditDisabledPencil = (
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
      d="M20.913 3.088a3.73 3.73 0 0 0-5.298.034l-2.042 2.042-.013.012-.012.012-3.307 3.308-.072.083a.741.741 0 0 0 1.119.965l2.796-2.796 1.06 1.06-2.433 2.43a.741.741 0 0 0 1.047 1.048l2.434-2.431 1.06 1.06-2.581 2.582-.072.083a.741.741 0 0 0 1.12.965l5.164-5.165.158-.164a3.727 3.727 0 0 0-.128-5.128m-4.197 4.196L18.3 8.868l.672-.672-3.169-3.167-.671.671zm3.295-.143L16.86 3.989a2.247 2.247 0 0 1 3.007.148 2.244 2.244 0 0 1 .145 3.004M7.426 11.31l-3.7 3.7a.74.74 0 0 0-.206.358L2.025 21.07l-.019.096a.74.74 0 0 0 .923.809l5.714-1.497.093-.032a.7.7 0 0 0 .242-.161l3.889-3.888.071-.083a.741.741 0 0 0-1.119-.965l-3.11 3.11-.637-1.484 2.395-2.396a.741.741 0 0 0-1.048-1.048l-2.395 2.397-1.486-.634 2.935-2.935.072-.083a.741.741 0 0 0-1.12-.965m-3.647 8.91.96-3.657 1.891.807.81 1.89zm15.928 1.355L2.423 4.288a.741.741 0 0 1 1.048-1.047l17.283 17.288a.741.741 0 0 1-1.047 1.047"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgEditDisabledPencil);
export default ForwardRef;
