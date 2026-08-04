import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgList = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M5.704 2c.818 0 1.481.663 1.481 1.481v2.223c0 .818-.663 1.481-1.481 1.481H3.48A1.48 1.48 0 0 1 2 5.704V3.48C2 2.663 2.663 2 3.481 2zM3.48 3.481v2.223h2.223V3.48zm17.778 2.47H8.914a.74.74 0 1 1 0-1.482h12.345a.74.74 0 0 1 0 1.482m0 7.407H8.914a.74.74 0 1 1 0-1.482h12.345a.74.74 0 0 1 0 1.482M8.914 20.765h12.345a.74.74 0 1 0 0-1.481H8.914a.74.74 0 1 0 0 1.481M7.185 10.89c0-.818-.663-1.482-1.481-1.482H3.48C2.663 9.407 2 10.071 2 10.89v2.222c0 .818.663 1.482 1.481 1.482h2.223c.818 0 1.481-.664 1.481-1.482zM3.481 13.11V10.89h2.223v2.222zm2.223 3.704c.818 0 1.481.663 1.481 1.481v2.223c0 .818-.663 1.481-1.481 1.481H3.48A1.48 1.48 0 0 1 2 20.518v-2.222c0-.818.663-1.481 1.481-1.481zM3.48 18.296v2.223h2.223v-2.223z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgList);
export default ForwardRef;
