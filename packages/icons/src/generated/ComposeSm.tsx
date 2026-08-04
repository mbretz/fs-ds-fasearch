import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgComposeSm = (
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
      d="M12.962 1.34a1.22 1.22 0 0 1 1.685 0c.465.465.465 1.22 0 1.685l-.63.632-.035.024a.29.29 0 0 1-.386-.024L12.33 2.393a.3.3 0 0 1-.087-.211.3.3 0 0 1 .062-.173l.025-.037zm-1.054 1.474a.306.306 0 0 0-.42 0L6.832 7.472a.3.3 0 0 0-.066.1L5.924 9.68a.3.3 0 0 0 .066.322c.086.081.21.107.322.065l2.105-.843a.3.3 0 0 0 .1-.066l4.656-4.657a.3.3 0 0 0 0-.422zM9.15 9.788q-.173.174-.4.264l-2.107.845c-.442.173-.946.07-1.285-.263a1.19 1.19 0 0 1-.264-1.286l.842-2.106c.06-.15.15-.287.265-.401l3.507-3.51a.15.15 0 0 0-.104-.255h-6.75A1.86 1.86 0 0 0 .995 4.935v8.205a1.86 1.86 0 0 0 1.857 1.858h8.2a1.856 1.856 0 0 0 1.858-1.858V6.387a.15.15 0 0 0-.254-.106z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgComposeSm);
export default ForwardRef;
