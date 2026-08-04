import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgLockLocked = (
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
      d="M5 11.375C5 10.339 5.84 9.5 6.875 9.5h11.25c1.035 0 1.875.84 1.875 1.875v8.75C20 21.16 19.16 22 18.125 22H6.875A1.875 1.875 0 0 1 5 20.125zm1.875-.625a.625.625 0 0 0-.625.625v8.75c0 .345.28.625.625.625h11.25c.345 0 .625-.28.625-.625v-8.75a.625.625 0 0 0-.625-.625z"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M12.5 3.25A3.75 3.75 0 0 0 8.75 7v3.125a.625.625 0 1 1-1.25 0V7a5 5 0 0 1 10 0v3.125a.625.625 0 1 1-1.25 0V7a3.75 3.75 0 0 0-3.75-3.75M12.5 13.875c.345 0 .625.28.625.625V17a.625.625 0 1 1-1.25 0v-2.5c0-.345.28-.625.625-.625"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgLockLocked);
export default ForwardRef;
