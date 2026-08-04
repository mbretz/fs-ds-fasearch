import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgDisabilityInsurance = (
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
      fill="#90C6B4"
      d="m51.983 20.761-31.287 7.243v19.602c0 27.81 31.287 40.944 31.287 40.944z"
    />
    <path
      fill="#3C3E40"
      d="m51.983 20.761 31.287 7.243v19.602c0 27.81-31.287 40.944-31.287 40.944z"
    />
    <path
      fill="#fff"
      d="M46.865 37.752h5.021v27.424h-5.021v-8.594h-8.69v-10.14h8.69z"
    />
    <path
      fill="#E8E7E8"
      d="M51.87 37.752h5.02v8.696H65.6v10.139H56.89v8.59h-5.02z"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgDisabilityInsurance);
export default ForwardRef;
