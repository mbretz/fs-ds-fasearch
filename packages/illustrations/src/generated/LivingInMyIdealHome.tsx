import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgLivingInMyIdealHome = (
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
    <mask
      id="a"
      width={104}
      height={104}
      x={0}
      y={0}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "luminance",
      }}
    >
      <circle cx={52} cy={52} r={52} fill="#fff" />
    </mask>
    <g fill="#FFD10A" mask="url(#a)">
      <path d="m52.072 60.466-8.174-73.57h16.349zM52.072 60.656l35.74-64.825 13.402 9.41zM124.049 43.79 52 60.71l66.632-32.318" />
      <path d="M53.718 60.457 17.978-4.368 4.576 5.042zM51.977 60.751l-66.536-32.317-5.513 15.398z" />
    </g>
    <path fill="#027DAB" d="M39.624 48.88h-19.24v32.864h19.24z" />
    <path
      fill="#8CBDD9"
      d="m39.624 48.702 20.522-18.23 20.142 18.23v33.042H39.624z"
    />
    <path fill="#027DAB" d="M66.456 64.896h-12.48v16.848h12.48z" />
    <path fill="#E8E7E8" d="M66.456 57.304h-12.48V46.8h12.48z" />
    <path fill="#3C3E40" d="M34.393 29.194h-7.13v13.117h7.13z" />
    <path
      fill="#3C3E40"
      d="M62.92 29.744 84.996 49.8h-4.708v-1.098L61.127 31.359 37.896 51.511H16.224l25.094-21.767z"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgLivingInMyIdealHome);
export default ForwardRef;
