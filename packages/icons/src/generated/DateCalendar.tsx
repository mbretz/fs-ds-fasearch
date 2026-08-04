import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgDateCalendar = (
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
      d="M8.42 7.062V5.95h7.16v1.11a.74.74 0 0 0 1.482 0v-1.11h2.716c.409 0 .74.331.74.74v2.716H3.482V6.691c0-.409.332-.74.741-.74h2.716v1.11a.74.74 0 1 0 1.482 0m8.642-2.593h2.716c1.227 0 2.222.995 2.222 2.222v13.087A2.22 2.22 0 0 1 19.778 22H4.222A2.22 2.22 0 0 1 2 19.778V6.69c0-1.227.995-2.222 2.222-2.222h2.716V2.741a.74.74 0 1 1 1.482 0v1.728h7.16V2.741a.74.74 0 0 1 1.482 0zm-13.58 6.42v8.889c0 .409.331.74.74.74h15.556a.74.74 0 0 0 .74-.74v-8.89z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgDateCalendar);
export default ForwardRef;
