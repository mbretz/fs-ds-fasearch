import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgEditPencilSm = (
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
      d="M11.49 1.583a2.107 2.107 0 0 1 2.91 0c.801.805.801 2.106 0 2.91l-.416.42a.29.29 0 0 1-.413 0l-2.497-2.5a.29.29 0 0 1 0-.413zM10.443 3.04a.3.3 0 0 0-.412 0L3.37 9.706a.29.29 0 0 0 0 .413l2.497 2.5a.29.29 0 0 0 .413 0l6.66-6.665a.29.29 0 0 0 0-.413zm-7.695 7.71a.292.292 0 0 0-.483.116l-1.249 3.75a.292.292 0 0 0 .369.37l3.746-1.25a.292.292 0 0 0 .117-.484z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgEditPencilSm);
export default ForwardRef;
