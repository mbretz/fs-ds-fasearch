import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgRatingStarHalf = (
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
      fill="#C08D16"
      d="M11.225 2.001a1.3 1.3 0 0 0-.738.236 1.27 1.27 0 0 0-.465.615l-1.88 5.25a.43.43 0 0 1-.404.281H2.507c-.266.001-.525.083-.742.236s-.38.367-.47.615a1.28 1.28 0 0 0 .387 1.405l4.45 3.659a.425.425 0 0 1 .137.46l-1.872 5.556a1.265 1.265 0 0 0 .459 1.44 1.3 1.3 0 0 0 1.525-.002l4.586-3.335a.42.42 0 0 1 .258-.086z"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgRatingStarHalf);
export default ForwardRef;
