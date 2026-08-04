import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgDataDownload = (
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
      d="M16.849 6.569h-1.82a.734.734 0 0 1-.728-.741c0-.41.326-.74.728-.74h1.82c1.74 0 3.151 1.436 3.151 3.21V18.79c0 1.773-1.411 3.21-3.151 3.21H7.152C5.41 22 4 20.563 4 18.79V8.297c0-1.773 1.411-3.21 3.152-3.21H8.97c.401 0 .727.332.727.741 0 .41-.326.74-.727.74H7.152c-.938 0-1.697.775-1.697 1.73V18.79c0 .955.76 1.729 1.697 1.729h9.697c.937 0 1.697-.774 1.697-1.729V8.297c0-.954-.76-1.728-1.697-1.728m-7.973 4.29c-.663-.676-1.691.372-1.028 1.047l3.636 3.704.033.032a.72.72 0 0 0 .482.185h.007a.74.74 0 0 0 .539-.217l3.604-3.703a.75.75 0 0 0 0-1.048.72.72 0 0 0-1.029 0l-2.394 2.439V2.741c0-.41-.326-.741-.728-.741a.734.734 0 0 0-.727.74v10.558z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgDataDownload);
export default ForwardRef;
