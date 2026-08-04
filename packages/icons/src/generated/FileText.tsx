import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgFileText = (
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
      d="M17.708 2.711c.162 0 .318.063.434.177l2.626 2.563a.62.62 0 0 1 .188.445l-.001 14.771a.62.62 0 0 1-.622.622h-16a.62.62 0 0 1-.622-.622V3.333a.62.62 0 0 1 .622-.622zm1.427-.842a2.04 2.04 0 0 0-1.429-.58H4.333A2.044 2.044 0 0 0 2.29 3.333v17.334a2.044 2.044 0 0 0 2.044 2.044h16a2.044 2.044 0 0 0 2.044-2.044l.001-14.771a2.04 2.04 0 0 0-.618-1.464zM7.039 7.955a.711.711 0 1 0 0 1.422h10.667a.711.711 0 1 0 0-1.422zm-.711 4.711c0-.392.318-.71.711-.71h10.667a.711.711 0 1 1 0 1.422H7.039a.71.71 0 0 1-.711-.712m.711 3.29a.711.711 0 0 0 0 1.422h5.333a.711.711 0 0 0 0-1.422z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgFileText);
export default ForwardRef;
