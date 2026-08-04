import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgTrash = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M17.528 8.857H5.656a.4.4 0 0 0-.399.434l1.026 11.26c.074.82.762 1.45 1.586 1.449h7.446c.824 0 1.512-.628 1.586-1.449l1.024-11.26a.4.4 0 0 0-.397-.434M10.2 19.212a.597.597 0 1 1-1.195 0v-7.169a.597.597 0 1 1 1.195 0zm3.385.598c.33 0 .598-.268.598-.598v-7.169a.597.597 0 1 0-1.195 0v7.17c0 .33.267.596.597.596"
      clipRule="evenodd"
    />
    <path
      fill="#CB0B31"
      d="M18.359 5.674a9 9 0 0 0-3.128-.813 3.752 3.752 0 0 0-7.29 0 9.2 9.2 0 0 0-3.045.778A1.47 1.47 0 0 0 4 6.907a.76.76 0 0 0 .759.77h13.66a.76.76 0 0 0 .758-.748 1.42 1.42 0 0 0-.818-1.255m-6.788-2.156a2.19 2.19 0 0 1 1.99 1.19 34 34 0 0 0-3.945 0 2.15 2.15 0 0 1 1.955-1.19"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgTrash);
export default ForwardRef;
