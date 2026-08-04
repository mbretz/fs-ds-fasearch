import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgMessageSend = (
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
      d="M10.848 13.146 3.486 11.38l-.029-.008a2 2 0 0 1-.087-3.822l16.818-5.483a1.384 1.384 0 0 1 1.745 1.74l-5.482 16.825A2 2 0 0 1 14.505 22a2.01 2.01 0 0 1-1.883-1.486zm7.987-9.05L3.844 8.982a.492.492 0 0 0 .012.936l7.382 1.77zm-6.53 8.659 7.604-7.601-4.89 15.008a.49.49 0 0 1-.938-.028z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgMessageSend);
export default ForwardRef;
