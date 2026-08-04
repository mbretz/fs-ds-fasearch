import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgHelpQuestionMark = (
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
      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10m0-1.482a8.519 8.519 0 1 1 0-17.037 8.519 8.519 0 0 1 0 17.038M10.272 9.532a1.728 1.728 0 1 1 2.304 1.63 1.975 1.975 0 0 0-1.317 1.863v.828a.74.74 0 1 0 1.482 0v-.828c0-.21.132-.397.329-.466A3.21 3.21 0 1 0 8.79 9.53a.74.74 0 0 0 1.482 0m.679 7.099a1.05 1.05 0 1 0 2.098 0 1.05 1.05 0 0 0-2.098 0"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgHelpQuestionMark);
export default ForwardRef;
