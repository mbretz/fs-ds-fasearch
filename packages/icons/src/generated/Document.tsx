import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgDocument = (
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
      d="M3.75 3c0-.966.784-1.75 1.75-1.75h8.067c.483 0 .945.2 1.276.552l4.932 5.25c.305.324.475.752.475 1.198V21a1.75 1.75 0 0 1-1.75 1.75h-13A1.75 1.75 0 0 1 3.75 21zm1.75-.25a.25.25 0 0 0-.25.25v18c0 .138.112.25.25.25h13a.25.25 0 0 0 .25-.25V8.75H15A1.75 1.75 0 0 1 13.25 7V2.75zm9.25 1.144 3.154 3.356H15a.25.25 0 0 1-.25-.25zM7.5 7.25H11a.75.75 0 0 1 0 1.5H7.5a.75.75 0 0 1 0-1.5m9 6h-9a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5m-9-3h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1 0-1.5m9 6h-9a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgDocument);
export default ForwardRef;
