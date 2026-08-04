import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgAttachmentPaperclip = (
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
      d="m20.735 9.935-9.034 9.26a4.733 4.733 0 0 1-6.81 0c-1.88-1.928-1.88-5.052 0-6.979l7.421-7.603a2.92 2.92 0 0 1 2.89-.838 3 3 0 0 1 2.117 2.169 3.09 3.09 0 0 1-.808 2.953l-7.43 7.617a1.09 1.09 0 0 1-1.547-.023 1.16 1.16 0 0 1-.014-1.596l7.411-7.598a.773.773 0 0 0 0-1.073.73.73 0 0 0-1.047 0L6.462 13.83a2.707 2.707 0 0 0 .023 3.734 2.55 2.55 0 0 0 3.635.032l7.428-7.618c1.146-1.134 1.61-2.827 1.203-4.42s-1.62-2.836-3.174-3.253a4.37 4.37 0 0 0-4.322 1.242l-7.412 7.595c-2.459 2.52-2.459 6.605 0 9.125a6.19 6.19 0 0 0 8.905 0l9.034-9.26a.773.773 0 0 0 0-1.073.73.73 0 0 0-1.048 0"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgAttachmentPaperclip);
export default ForwardRef;
