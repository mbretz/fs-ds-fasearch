import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgCompose = (
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
      d="M12.965 14.492a.74.74 0 0 0 .419-.21L20.367 7.3l.874-.873a2.592 2.592 0 1 0-3.667-3.667l-.873.874-6.984 6.983a.74.74 0 0 0-.21.419l-.435 3.056a.74.74 0 0 0 .838.838zm-.454-1.432 6.285-6.285-1.571-1.571-6.285 6.285-.262 1.833zm7.682-7.682-.35.35-1.57-1.572.349-.35a1.111 1.111 0 0 1 1.571 1.572m-3.378 14.647v-6.173a.74.74 0 1 1 1.481 0v6.173c0 1.09-.884 1.975-1.975 1.975H3.975A1.975 1.975 0 0 1 2 20.025V7.68c0-1.091.884-1.976 1.975-1.976h6.173a.74.74 0 1 1 0 1.482H3.975a.494.494 0 0 0-.494.494v12.345c0 .273.222.494.494.494h12.346a.494.494 0 0 0 .494-.494"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgCompose);
export default ForwardRef;
