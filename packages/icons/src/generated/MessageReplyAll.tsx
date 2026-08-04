import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgMessageReplyAll = (
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
      d="M15.086 14.052c3 0 5.432 2.432 5.432 5.432 0 .988 1.482.988 1.482 0v-4.939a6.914 6.914 0 0 0-6.914-6.914h-.74V5.973a1.976 1.976 0 0 0-3.424-1.34L6.426 9.502a1.976 1.976 0 0 0 0 2.679l4.493 4.868a1.976 1.976 0 0 0 3.426-1.34v-1.657zm5.432 1.155v-.662c0-3-2.432-5.432-5.432-5.432h-1.482a.74.74 0 0 1-.74-.742V5.974l-.007-.084a.494.494 0 0 0-.847-.251l-4.495 4.867a.494.494 0 0 0 0 .67l4.492 4.867a.494.494 0 0 0 .856-.334V13.31c0-.41.332-.741.741-.741h1.482a6.9 6.9 0 0 1 5.432 2.637M7.016 4.634 2.524 9.502a1.976 1.976 0 0 0 0 2.679l4.492 4.868a.74.74 0 0 0 1.089-1.005l-4.493-4.868a.494.494 0 0 1 0-.67L8.105 5.64a.74.74 0 1 0-1.089-1.005"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgMessageReplyAll);
export default ForwardRef;
