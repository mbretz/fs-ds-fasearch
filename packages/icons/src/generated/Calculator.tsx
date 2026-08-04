import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgCalculator = (
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
      d="M19.062 3.975c0-1.09-.885-1.975-1.976-1.975H5.976C4.884 2 4 2.885 4 3.975v16.05C4 21.115 4.885 22 5.975 22h11.111c1.091 0 1.976-.885 1.976-1.975zM5.975 3.481h11.111c.273 0 .494.222.494.494v16.05a.494.494 0 0 1-.494.494H5.976a.494.494 0 0 1-.495-.494V3.975c0-.272.222-.494.494-.494m10.618 2.346c0-.75-.609-1.358-1.358-1.358H7.827c-.75 0-1.358.608-1.358 1.358v2.47c0 .75.608 1.357 1.358 1.357h7.408c.75 0 1.358-.608 1.358-1.358zm-8.642.124h7.16v2.222h-7.16zm.185 5.308.115.006a1.05 1.05 0 1 1-.115-.006m3.638.006-.115-.006a1.05 1.05 0 1 0 .115.006m3.152-.006.115.006a1.05 1.05 0 1 1-.115-.006M8.25 14.352l-.115-.006a1.05 1.05 0 1 0 .115.006m3.408-.006.115.006a1.05 1.05 0 1 1-.115-.006m3.382.006-.115-.006a1.05 1.05 0 1 0 .115.006m-6.905 3.08.115.006a1.05 1.05 0 1 1-.115-.006m3.638.006-.115-.006a1.05 1.05 0 1 0 .115.006m3.152-.006.115.006a1.05 1.05 0 1 1-.115-.006"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgCalculator);
export default ForwardRef;
