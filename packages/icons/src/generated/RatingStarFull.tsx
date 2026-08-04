import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgRatingStarFull = (
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
      d="M21.922 9.12a1.3 1.3 0 0 0-.47-.613 1.3 1.3 0 0 0-.74-.236h-5.226a.43.43 0 0 1-.404-.28l-1.87-5.264a1.3 1.3 0 0 0-.48-.587 1.288 1.288 0 0 0-1.467.015 1.27 1.27 0 0 0-.465.614L8.92 8.008a.425.425 0 0 1-.403.28H3.291c-.266 0-.525.082-.741.234-.217.152-.38.367-.47.615a1.28 1.28 0 0 0 .387 1.4l4.445 3.651a.42.42 0 0 1 .138.459L5.179 20.19a1.26 1.26 0 0 0 .459 1.437 1.3 1.3 0 0 0 1.523-.002l4.583-3.329a.42.42 0 0 1 .506 0l4.592 3.329a1.295 1.295 0 0 0 2.056-.613 1.26 1.26 0 0 0-.03-.822l-1.872-5.544a.42.42 0 0 1 .138-.459l4.454-3.659a1.28 1.28 0 0 0 .334-1.41"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgRatingStarFull);
export default ForwardRef;
