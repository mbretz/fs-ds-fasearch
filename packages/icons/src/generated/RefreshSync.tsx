import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgRefreshSync = (
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
      d="M9.455 5.442a7.55 7.55 0 0 1 8.352 2.284c.26.315.216.78-.1 1.04a.743.743 0 0 1-1.042-.1 6.06 6.06 0 0 0-6.71-1.835 6.03 6.03 0 0 0-4.004 5.667v.064l1.204-1.2a.743.743 0 0 1 1.048 0c.29.288.29.755 0 1.043l-2.435 2.426a.74.74 0 0 1-1.117 0l-2.434-2.426a.736.736 0 0 1 0-1.043.743.743 0 0 1 1.048 0l1.204 1.2v-.064a7.5 7.5 0 0 1 4.986-7.056M14.78 19.47a7.55 7.55 0 0 1-8.257-1.823.736.736 0 0 1 .03-1.044.743.743 0 0 1 1.047.03 6.07 6.07 0 0 0 6.633 1.465 6.03 6.03 0 0 0 3.788-5.02l-1.176 1.172a.743.743 0 0 1-1.048 0 .736.736 0 0 1 0-1.043l2.466-2.457.03-.029a.74.74 0 0 1 .773-.137q.137.054.248.163l2.47 2.46c.288.288.288.755 0 1.043a.743.743 0 0 1-1.049 0l-1.223-1.219a7.51 7.51 0 0 1-4.732 6.439"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgRefreshSync);
export default ForwardRef;
