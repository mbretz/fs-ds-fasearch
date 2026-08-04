import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgLifeInsurance = (
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
      fill="#979BCD"
      d="m51.99 20.8-31.502 7.3v19.76c0 28.033 31.502 41.27 31.502 41.27z"
    />
    <path
      fill="#3C3E40"
      d="m51.99 20.928 31.503 7.3v19.76c0 28.032-31.503 41.27-31.503 41.27z"
    />
    <path
      fill="#fff"
      d="M51.99 44.97s-7.195-8.566-12.834-1.46C31.475 53.146 51.99 69.304 51.99 69.304"
    />
    <path
      fill="#E8E7E8"
      d="M51.99 69.304S72.603 53.146 64.825 43.51c-5.737-7.203-12.835 1.46-12.835 1.46"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgLifeInsurance);
export default ForwardRef;
