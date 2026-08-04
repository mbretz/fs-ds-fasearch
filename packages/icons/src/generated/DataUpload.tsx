import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgDataUpload = (
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
      d="M7.152 17.431h1.82c.401 0 .727.332.727.741 0 .41-.326.74-.728.74h-1.82c-1.74 0-3.151-1.436-3.151-3.21V5.21C4 3.437 5.411 2 7.152 2h9.697C18.589 2 20 3.437 20 5.21v10.493c0 1.773-1.411 3.21-3.151 3.21H15.03a.734.734 0 0 1-.727-.741c0-.41.326-.74.727-.74h1.819c.937 0 1.697-.775 1.697-1.73V5.21c0-.955-.76-1.729-1.697-1.729H7.152c-.938 0-1.697.774-1.697 1.729v10.493c0 .954.76 1.728 1.697 1.728m7.972-4.29c.663.676 1.691-.372 1.028-1.047l-3.632-3.7a.72.72 0 0 0-.518-.221h-.008a.74.74 0 0 0-.539.217l-3.604 3.704a.75.75 0 0 0 0 1.047c.284.29.744.29 1.028 0l2.395-2.44V21.26c0 .41.326.741.728.741a.734.734 0 0 0 .727-.74V10.701z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgDataUpload);
export default ForwardRef;
