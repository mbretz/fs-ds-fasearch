import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgEditPencil = (
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
      d="M18.255 2a3.73 3.73 0 0 1 2.656 1.086l.159.17a3.73 3.73 0 0 1-.187 5.124L8.978 20.285a.74.74 0 0 1-.335.192l-5.714 1.498a.74.74 0 0 1-.904-.905l1.495-5.702a.74.74 0 0 1 .205-.356l9.825-9.825.01-.01.011-.012 2.044-2.043A3.73 3.73 0 0 1 18.255 2M3.78 20.22l.96-3.656 1.891.807.81 1.89zM17.253 9.915 8.708 18.46l-.636-1.485 8.12-8.12zm-2.109-2.108-8.12 8.121-1.486-.634 8.546-8.546zm1.572-.523L18.3 8.868l.672-.672-3.169-3.167-.671.671zm3.802-1.55a2.25 2.25 0 0 1-.507 1.407L16.86 3.989a2.25 2.25 0 0 1 2.859.013l.147.133c.422.425.658 1 .653 1.6"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgEditPencil);
export default ForwardRef;
