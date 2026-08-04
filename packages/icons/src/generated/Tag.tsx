import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgTag = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M3.567 2H8.87c.867 0 1.7.344 2.314.957l9.796 9.796a2 2 0 0 1 0 2.831l-5.829 5.83a2 2 0 0 1-2.83 0l-9.797-9.798a3.28 3.28 0 0 1-.958-2.313V4C1.565 2.896 2.462 2 3.567 2m0 1.461a.54.54 0 0 0-.54.54v5.302c0 .48.19.94.53 1.28l9.796 9.797a.54.54 0 0 0 .764 0l5.828-5.83a.54.54 0 0 0 0-.763L10.15 3.99c-.34-.34-.801-.53-1.281-.53zm3.178 1.716a2.002 2.002 0 1 1-.001 4.004 2.002 2.002 0 0 1 0-4.004m0 1.461a.54.54 0 1 0 0 1.082.54.54 0 0 0 0-1.082"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgTag);
export default ForwardRef;
