import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgCloseSm = (
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
      d="M1.152 1.152a.52.52 0 0 1 .733 0L8 7.266l6.115-6.114a.52.52 0 0 1 .675-.05l.058.05a.52.52 0 0 1 0 .733L8.734 8l6.114 6.115c.184.184.2.472.05.675l-.05.058a.52.52 0 0 1-.733 0L8 8.733l-6.115 6.115a.52.52 0 0 1-.675.05l-.058-.05a.52.52 0 0 1 0-.733L7.266 8 1.152 1.885a.52.52 0 0 1-.05-.675z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgCloseSm);
export default ForwardRef;
