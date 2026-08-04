import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgNoticeWarning = (
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
      fill="#D13805"
      fillRule="evenodd"
      d="M12 2c-.85 0-1.625.483-1.999 1.245L2.204 19.13a1.992 1.992 0 0 0 1.79 2.87h16.013a1.992 1.992 0 0 0 1.789-2.87L13.999 3.244A2.23 2.23 0 0 0 12 2m8.466 17.781a.51.51 0 0 1-.459.737H3.993a.51.51 0 0 1-.459-.736L11.33 3.898a.746.746 0 0 1 1.338 0zm-7.676-4.867V8.74a.74.74 0 1 0-1.481 0v6.173a.74.74 0 1 0 1.481 0M11 17.69a1.05 1.05 0 1 0 2.099 0 1.05 1.05 0 0 0-2.099 0"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgNoticeWarning);
export default ForwardRef;
