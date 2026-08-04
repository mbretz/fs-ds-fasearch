import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgNoticeError = (
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
      fill="#CB0B31"
      fillRule="evenodd"
      d="M16.375 22h-8.75a.63.63 0 0 1-.442-.183l-5-5A.63.63 0 0 1 2 16.375v-8.75c0-.166.066-.325.183-.442l5-5A.63.63 0 0 1 7.625 2h8.75c.166 0 .325.066.442.183l5 5a.63.63 0 0 1 .183.442v8.75a.62.62 0 0 1-.183.442l-5 5a.62.62 0 0 1-.442.183M3.667 15.92l4.413 4.413h7.84l4.413-4.413V8.08L15.92 3.667H8.08L3.667 8.08zm7.5 1.147a.8.8 0 1 0 .887-.796l-.088-.004a.8.8 0 0 0-.8.8m1.6-10.134V13.6c0 .368-.358.667-.8.667s-.8-.299-.8-.667V6.933c0-.368.358-.666.8-.666.441 0 .8.298.8.666"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgNoticeError);
export default ForwardRef;
