import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgRatingStarEmpty = (
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
      fill="#7D8082"
      fillRule="evenodd"
      d="M11.998 2.667a.06.06 0 0 0-.054.032L8.975 8.585a.67.67 0 0 1-.529.363l-5.735.568a.049.049 0 0 0-.03.083l4.714 4.67c.171.169.238.418.174.65l-1.745 6.338v.002a.056.056 0 0 0 .08.063l.003-.002 5.795-2.87a.67.67 0 0 1 .592 0l5.806 2.875a.056.056 0 0 0 .08-.063v-.001l-1.745-6.339a.67.67 0 0 1 .173-.65l4.71-4.669a.049.049 0 0 0-.03-.083l-.01-.001-5.724-.567a.67.67 0 0 1-.53-.363L12.053 2.7a.061.061 0 0 0-.055-.033m-.728-1.129a1.395 1.395 0 0 1 1.97.554v.004l2.81 5.565 5.355.53a1.382 1.382 0 0 1 .852 2.359l-4.433 4.394 1.644 5.975a1.39 1.39 0 0 1-1.965 1.599l-.002-.002-5.503-2.725-5.496 2.722H6.5a1.389 1.389 0 0 1-1.965-1.598l.002-.006 1.643-5.968-4.437-4.394a1.383 1.383 0 0 1 .852-2.36l5.355-.53 2.805-5.561.002-.004c.117-.228.294-.42.513-.554"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgRatingStarEmpty);
export default ForwardRef;
