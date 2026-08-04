import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgCaretDown = (
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
      d="M12.5 15.997c.21.02.425-.05.585-.206l5.701-5.573a.7.7 0 0 0 0-1.01.74.74 0 0 0-1.032.001L12.5 14.345 7.246 9.21a.74.74 0 0 0-1.032 0 .7.7 0 0 0 0 1.009l5.7 5.573c.16.157.377.225.586.206"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgCaretDown);
export default ForwardRef;
