import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgGeneralFinancialGoal = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={104}
    height={104}
    fill="none"
    viewBox="0 0 104 104"
    ref={ref}
    {...props}
  >
    <path
      fill="#F7CB3D"
      d="M1.248 63.45c12.807-4.659 30.8-7.552 50.74-7.552 19.931 0 37.918 2.89 50.724 7.546C97.487 86.636 76.732 104 51.979 104 27.23 104 6.474 86.639 1.248 63.45"
    />
    <path
      fill="#FCE47F"
      d="M102.732 63.444A52 52 0 0 0 104 52c0-28.683-23.317-52-52-52S0 23.317 0 52c0 3.933.438 7.765 1.269 11.45 12.807-4.659 30.8-7.552 50.74-7.552 19.931 0 37.918 2.89 50.723 7.546"
    />
    <path
      fill="#898989"
      d="m31.72 75.32-5.408 10.912h10.236l3.766-8.401zM72.373 75.32l5.408 10.912H67.545l-3.766-8.401z"
    />
    <circle cx={52} cy={48.464} r={34.216} fill="#EF674A" />
    <circle cx={52} cy={48.464} r={26.613} fill="#fff" />
    <circle cx={52} cy={48.464} r={19.009} fill="#EF674A" />
    <circle cx={52} cy={48.464} r={11.405} fill="#fff" />
    <circle cx={52} cy={48.464} r={3.802} fill="#EF674A" />
    <mask
      id="a"
      width={35}
      height={69}
      x={52}
      y={14}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "luminance",
      }}
    >
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M52 82.68c18.897 0 34.216-15.319 34.216-34.216S70.897 14.248 52 14.248z"
        clipRule="evenodd"
      />
    </mask>
    <g mask="url(#a)">
      <circle cx={52} cy={48.464} r={34.216} fill="#3C3E40" />
      <circle cx={52} cy={48.464} r={26.613} fill="#E8E7E8" />
      <circle cx={52} cy={48.464} r={19.009} fill="#3C3E40" />
      <circle cx={52} cy={48.464} r={11.405} fill="#E8E7E8" />
      <circle cx={52} cy={48.464} r={3.802} fill="#3C3E40" />
    </g>
  </svg>
);
const ForwardRef = forwardRef(SvgGeneralFinancialGoal);
export default ForwardRef;
