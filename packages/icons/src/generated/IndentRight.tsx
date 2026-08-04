import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgIndentRight = (
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
      d="M10.75 18.667H5.333a.834.834 0 0 0 0 1.666h5.417a.834.834 0 0 0 0-1.666M11.583 15.75a.834.834 0 0 0-.833-.833H2.833a.834.834 0 0 0 0 1.666h7.917a.834.834 0 0 0 .833-.833M10.75 11.167H5.333a.834.834 0 0 0 0 1.666h5.417a.834.834 0 0 0 0-1.666M10.75 7.417H2.833a.833.833 0 1 0 0 1.666h7.917a.833.833 0 0 0 0-1.666M10.75 3.667H5.333a.833.833 0 1 0 0 1.666h5.417a.833.833 0 0 0 0-1.666M13.667 2a.833.833 0 0 0-.834.833v18.334a.833.833 0 0 0 1.667 0V2.833A.833.833 0 0 0 13.667 2M21.167 11.167h-1.043a.207.207 0 0 1-.208-.209v-1.25a.626.626 0 0 0-1-.5L15.86 11.5a.625.625 0 0 0 0 1l3.055 2.292a.625.625 0 0 0 1-.5v-1.25a.21.21 0 0 1 .208-.209h1.044a.834.834 0 0 0 0-1.666"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgIndentRight);
export default ForwardRef;
