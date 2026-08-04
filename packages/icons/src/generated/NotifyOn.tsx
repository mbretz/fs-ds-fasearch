import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgNotifyOn = (
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
      d="M14.362 19.5h-3.726a.21.21 0 0 0-.207.185q-.014.115-.013.232a2.083 2.083 0 1 0 4.153-.232.207.207 0 0 0-.207-.185M20.37 18.063a13.64 13.64 0 0 1-1.454-6.11v-.64a7.6 7.6 0 0 0-3.222-6.351 5.3 5.3 0 0 0-1.945-.765V3.25a1.25 1.25 0 0 0-2.5 0v.957a5.6 5.6 0 0 0-2.376 1.065 7.67 7.67 0 0 0-2.79 6.041v.64a13.64 13.64 0 0 1-1.456 6.11.417.417 0 0 0 .372.604h15a.417.417 0 0 0 .372-.604"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgNotifyOn);
export default ForwardRef;
