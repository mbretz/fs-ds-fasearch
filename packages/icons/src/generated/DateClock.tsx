import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgDateClock = (
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
      d="M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2m0 18.333A8.333 8.333 0 1 1 20.333 12 8.34 8.34 0 0 1 12 20.333"
    />
    <path
      fill="currentColor"
      d="m16.278 15.175-3.861-3.54V7.416a.833.833 0 1 0-1.667 0V12a.83.83 0 0 0 .27.615l4.133 3.787a.84.84 0 0 0 1.177-.05.834.834 0 0 0-.052-1.177"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgDateClock);
export default ForwardRef;
