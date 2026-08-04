import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgMoreEllipsisVertical = (
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
      d="M12.381 17.238a2.38 2.38 0 1 1 0 4.762 2.38 2.38 0 0 1 0-4.762M12.381 9.62a2.38 2.38 0 1 1 0 4.76 2.38 2.38 0 0 1 0-4.761M12.381 2a2.38 2.38 0 1 1 0 4.762 2.38 2.38 0 0 1 0-4.762"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgMoreEllipsisVertical);
export default ForwardRef;
