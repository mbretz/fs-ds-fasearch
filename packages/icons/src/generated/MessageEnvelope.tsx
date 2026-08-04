import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgMessageEnvelope = (
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
      d="M4 5h16a1.996 1.996 0 0 1 2 2v10.667a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 .46-1.277C2.828 5.281 3.38 5 4 5m-.667 2.278v10.389c0 .368.299.666.667.666h16a.667.667 0 0 0 .667-.666V7.277l-6.468 4.975a3.61 3.61 0 0 1-4.398 0zm16.374-.945-6.32 4.862a2.274 2.274 0 0 1-2.773 0L4.293 6.333z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgMessageEnvelope);
export default ForwardRef;
