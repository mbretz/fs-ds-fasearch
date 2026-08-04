import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgHome = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="m3.159 12.883 8.491-8.491a.5.5 0 0 1 .707 0l8.491 8.49a.75.75 0 0 0 1.06-1.06l-2.28-2.28V5.478a.75.75 0 0 0-.75-.75h-3.125a.75.75 0 0 0-.616.322l-1.72-1.719a2 2 0 0 0-2.827 0l-8.492 8.491a.75.75 0 0 0 1.06 1.06m13.344-6.466 1.625 1.625V6.228h-1.625zm-1.875 13.31v-4.25a2 2 0 0 0-2-2h-1.25a2 2 0 0 0-2 2v4.25h-3.5v-6.125a.75.75 0 0 0-1.5 0v6.875c0 .415.336.75.75.75h5a.75.75 0 0 0 .75-.75v-5a.5.5 0 0 1 .5-.5h1.25a.5.5 0 0 1 .5.5v5c0 .415.336.75.75.75h5a.75.75 0 0 0 .75-.75v-6.875a.75.75 0 0 0-1.5 0v6.125z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgHome);
export default ForwardRef;
