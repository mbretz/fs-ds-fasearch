import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgDataVisGain = (
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
      fill="#247E58"
      d="M12.43 22c.593 0 1.078-.475 1.078-1.069V5.661l3.523 3.524c.386.386.98.415 1.395.099l.12-.1a1.06 1.06 0 0 0 0-1.514L13.19 2.307a1 1 0 0 0-.118-.1l-.04-.019a1 1 0 0 0-.08-.05l-.058-.03-.08-.039-.04-.02-.098-.03h-.05A1 1 0 0 0 12.43 2h.1-.199l-.089.02h-.04l-.098.03-.04.02-.089.029-.06.04-.069.04c-.049.039-.108.078-.158.138L6.314 7.67a1.07 1.07 0 0 0 1.514 1.515l3.533-3.523v15.27c0 .544.395.989.93 1.068z"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgDataVisGain);
export default ForwardRef;
