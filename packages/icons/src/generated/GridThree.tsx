import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgGridThree = (
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
      d="M5.763 3.5H3.5v2.263h2.263zM3.5 2H2v5.263h5.263V2H3.5m9.632 1.5h-2.264v2.263h2.264zM10.868 2h-1.5v5.263h5.264V2h-3.764m7.369 1.5H20.5v2.263h-2.263zm-1.5-1.5H22v5.263h-5.263V2M5.763 18.237H3.5V20.5h2.263zm-2.263-1.5H2V22h5.263v-5.263H3.5m7.368 1.5h2.264V20.5h-2.264zm-1.5-1.5h5.264V22H9.368v-5.263m11.132 1.5h-2.263V20.5H20.5zm-2.263-1.5h-1.5V22H22v-5.263h-3.763M3.5 10.868h2.263v2.264H3.5zM2 9.368h5.263v5.264H2V9.368m11.132 1.5h-2.264v2.264h2.264zm-2.264-1.5h-1.5v5.264h5.264V9.368h-3.764m7.369 1.5H20.5v2.264h-2.263zm-1.5-1.5H22v5.264h-5.263V9.368"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgGridThree);
export default ForwardRef;
