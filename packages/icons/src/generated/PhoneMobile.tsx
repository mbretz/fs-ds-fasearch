import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgPhoneMobile = (
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
      d="M16.167 2H7.833c-.663 0-1.299.264-1.767.734a2.5 2.5 0 0 0-.733 1.773v14.986c0 .665.264 1.303.733 1.773S7.17 22 7.833 22h8.334c.663 0 1.299-.264 1.767-.734a2.5 2.5 0 0 0 .733-1.773V4.507a2.5 2.5 0 0 0-.733-1.773A2.5 2.5 0 0 0 16.167 2M12 20.746a.832.832 0 0 1-.817-.998.84.84 0 0 1 .654-.657.83.83 0 0 1 .996.82.837.837 0 0 1-.833.835m5-3.76a.837.837 0 0 1-.833.835H7.833A.83.83 0 0 1 7 16.987V4.925a.837.837 0 0 1 .833-.836h8.334a.83.83 0 0 1 .833.836z"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgPhoneMobile);
export default ForwardRef;
