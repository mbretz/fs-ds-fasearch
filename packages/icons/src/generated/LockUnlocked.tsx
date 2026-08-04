import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgLockUnlocked = (
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
      d="M3.481 10.148V7.062a3.58 3.58 0 1 1 7.161 0v2.345H9.16a2.22 2.22 0 0 0-2.222 2.223v8.148c0 1.227.995 2.222 2.222 2.222h10.618A2.22 2.22 0 0 0 22 19.778V11.63a2.22 2.22 0 0 0-2.222-2.223h-7.654V7.062A5.062 5.062 0 0 0 2 7.062v3.086a.74.74 0 1 0 1.481 0m5.68.74h10.617c.409 0 .74.332.74.742v8.148a.74.74 0 0 1-.74.74H9.16a.74.74 0 0 1-.74-.74V11.63c0-.41.331-.741.74-.741m4.567 6.05V14.47a.74.74 0 1 1 1.482 0v2.47a.74.74 0 0 1-1.482 0"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgLockUnlocked);
export default ForwardRef;
