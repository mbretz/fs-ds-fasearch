import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgNoticeInfo = (
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
      fill="#4B4D4E"
      fillRule="evenodd"
      d="M12 3.395a8.605 8.605 0 1 0 0 17.21 8.605 8.605 0 0 0 0-17.21M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12"
      clipRule="evenodd"
    />
    <path
      fill="#4B4D4E"
      d="M11.966 9.19a1.338 1.338 0 1 0 0-2.676 1.338 1.338 0 0 0 0 2.676M10.012 10.97c.189-.561 1.177-.75 1.877-.75.96 0 1.618.75 1.485 1.583-.357 2.171-.728 3.117-.918 4.056-.147.721 1.507.378 1.507.938s-.855.75-1.689.75c-.938 0-1.807-.673-1.688-1.506.19-1.317 1.233-4.021.939-4.322-.357-.379-1.751-.014-1.506-.75z"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgNoticeInfo);
export default ForwardRef;
