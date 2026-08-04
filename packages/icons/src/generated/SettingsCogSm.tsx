import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSettingsCogSm = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    ref={ref}
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="m14.079 6.694-.739-.262a.8.8 0 0 1-.455-1.1l.336-.708a1.386 1.386 0 0 0-1.846-1.846l-.708.337a.8.8 0 0 1-1.1-.457l-.262-.737a1.386 1.386 0 0 0-2.61 0l-.263.738a.8.8 0 0 1-1.1.456l-.707-.337a1.386 1.386 0 0 0-1.847 1.846l.336.708a.8.8 0 0 1-.455 1.1l-.738.263a1.385 1.385 0 0 0 0 2.61l.738.262a.8.8 0 0 1 .455 1.1l-.336.708a1.386 1.386 0 0 0 1.847 1.846l.707-.336a.8.8 0 0 1 1.1.455l.262.738a1.386 1.386 0 0 0 2.611 0l.263-.738a.8.8 0 0 1 1.1-.455l.707.336a1.386 1.386 0 0 0 1.846-1.846l-.336-.708a.8.8 0 0 1 .455-1.1l.739-.263a1.385 1.385 0 0 0 0-2.61m-6.08 4.096a2.88 2.88 0 0 1-2.59-1.717 2.81 2.81 0 0 1 1.517-3.664 2.84 2.84 0 0 1 3.664 1.517 2.807 2.807 0 0 1-1.517 3.663c-.34.14-.705.209-1.073.201"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgSettingsCogSm);
export default ForwardRef;
