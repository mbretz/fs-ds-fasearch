import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgNewWindowSm = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    ref={ref}
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M10.188 1.438c0-.242.195-.438.437-.438h3.938c.241 0 .437.196.437.438v3.937a.438.438 0 0 1-.875 0V2.494l-8.003 8.003a.438.438 0 0 1-.619-.619l8.003-8.003h-2.881a.44.44 0 0 1-.437-.437M1.383 4.008c.247-.246.58-.384.929-.384h5.25a.438.438 0 0 1 0 .875h-5.25a.437.437 0 0 0-.438.438v8.75a.44.44 0 0 0 .438.437h8.75a.44.44 0 0 0 .437-.437v-5.25a.438.438 0 0 1 .875 0v5.25A1.313 1.313 0 0 1 11.063 15h-8.75A1.313 1.313 0 0 1 1 13.688v-8.75c0-.349.138-.682.384-.929"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgNewWindowSm);
export default ForwardRef;
