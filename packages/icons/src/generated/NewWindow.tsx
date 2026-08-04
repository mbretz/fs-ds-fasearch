import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgNewWindow = (
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
      d="M19.47 3.481 8.39 14.563a.74.74 0 0 0 1.047 1.047L20.52 4.53v3.767a.74.74 0 0 0 1.481 0V2.741A.74.74 0 0 0 21.26 2h-5.556a.74.74 0 0 0 0 1.481z"
    />
    <path
      fill="currentColor"
      d="M3.975 5.704h7.408a.74.74 0 1 1 0 1.481H3.975a.494.494 0 0 0-.494.494v12.346c0 .272.222.494.494.494h12.346a.494.494 0 0 0 .494-.494v-7.408a.74.74 0 0 1 1.481 0v7.408c0 1.09-.884 1.975-1.975 1.975H3.975A1.976 1.976 0 0 1 2 20.025V7.679c0-1.09.885-1.975 1.975-1.975"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgNewWindow);
export default ForwardRef;
