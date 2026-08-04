import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgNotifyOff = (
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
      d="M13.87 19.5h-3.73a.21.21 0 0 0-.207.185 2 2 0 0 0-.017.232A2.083 2.083 0 0 0 12.001 22a2.086 2.086 0 0 0 2.072-2.315.21.21 0 0 0-.203-.185M9.604 17.417h9.902a.417.417 0 0 0 .373-.605 13.6 13.6 0 0 1-1.457-6.109v-.64a6.7 6.7 0 0 0-.124-1.337zM2.828 21.994a.82.82 0 0 0 .59-.237L21.763 3.423a.85.85 0 0 0 0-1.178.834.834 0 0 0-1.18 0l-3.846 3.848q-.727-.62-1.535-1.131a5.3 5.3 0 0 0-1.95-.765V3.25a1.25 1.25 0 0 0-2.136-.884 1.25 1.25 0 0 0-.366.884v.957a5.6 5.6 0 0 0-2.376 1.065C6.816 6.493 5.58 7.459 5.58 10.063v1.89c0 1.984-.44 2.854-1.318 4.589l-.138.271a.417.417 0 0 0 .372.604h.909l-3.16 3.161a.828.828 0 0 0 .583 1.416"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgNotifyOff);
export default ForwardRef;
