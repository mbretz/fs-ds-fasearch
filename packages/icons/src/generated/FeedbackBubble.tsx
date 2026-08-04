import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgFeedbackBubble = (
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
      d="M3.875 2h16.25C21.16 2 22 2.84 22 3.875v12.5c0 1.035-.84 1.874-1.875 1.874h-8.542L6.75 21.874a.625.625 0 0 1-.994-.412l-.006-.088v-3.125H3.875c-.992 0-1.805-.77-1.87-1.746L2 16.374v-12.5C2 2.84 2.84 2 3.875 2m16.25 1.25H3.875a.625.625 0 0 0-.625.625v12.5c0 .344.28.624.625.624h2.5c.345 0 .625.28.625.625v2.5l4-3a.6.6 0 0 1 .294-.12l.081-.005h8.75c.345 0 .625-.28.625-.625v-12.5a.625.625 0 0 0-.625-.624"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgFeedbackBubble);
export default ForwardRef;
