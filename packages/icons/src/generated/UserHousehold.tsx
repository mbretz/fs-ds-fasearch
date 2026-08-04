import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgUserHousehold = (
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
    <g clipPath="url(#a)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12.53.22a.75.75 0 0 0-1.06 0L.22 11.47A.75.75 0 0 0 0 12v11.25a.75.75 0 0 0 1.5 0V12.31L12 1.81l10.5 10.5v10.94a.75.75 0 0 0 1.5 0V12a.75.75 0 0 0-.22-.53zM4.848 11.598a3.75 3.75 0 1 1 5.304 5.304 3.75 3.75 0 0 1-5.304-5.304M7.5 18a4.5 4.5 0 0 1 4.5 4.5v.75a.75.75 0 0 1-1.5 0v-.75a3 3 0 0 0-6 0v.75a.75.75 0 0 1-1.5 0v-.75A4.5 4.5 0 0 1 7.5 18m0-6a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5m9-1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5m-1.591 2.159a2.25 2.25 0 1 1 3.182 3.183 2.25 2.25 0 0 1-3.182-3.183m.715 5.428A4.5 4.5 0 0 1 21 22.5v.75a.75.75 0 0 1-1.5 0v-.75a3.001 3.001 0 0 0-5.12-2.121.75.75 0 0 1-1.06-1.062 4.5 4.5 0 0 1 2.304-1.23"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
const ForwardRef = forwardRef(SvgUserHousehold);
export default ForwardRef;
