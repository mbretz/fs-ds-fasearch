import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgDataVisHierarchy = (
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
      d="M17.334 2H6.19c-.735 0-1.331.596-1.331 1.331v2.477c0 .735.596 1.331 1.33 1.331h4.862v4.768H6.808l-.145.005a1.95 1.95 0 0 0-1.805 1.946v3.103a2.57 2.57 0 1 0 1.424 0v-3.103l.007-.086a.53.53 0 0 1 .52-.44h4.24v3.629a2.57 2.57 0 1 0 1.425 0v-3.63h4.241l.085.007c.25.041.441.258.441.52v3.103a2.57 2.57 0 1 0 1.425 0v-3.103l-.006-.146a1.95 1.95 0 0 0-1.945-1.805h-4.241V7.14h4.86c.735 0 1.332-.596 1.332-1.33V3.33c0-.735-.597-1.331-1.332-1.331m.62 16.285a1.145 1.145 0 1 0-.001 2.29 1.145 1.145 0 0 0 0-2.29M17.24 3.424v2.29H6.28v-2.29zM5.57 18.284a1.145 1.145 0 1 1 0 2.291 1.145 1.145 0 0 1 0-2.29m7.337 1.146a1.145 1.145 0 1 0-2.29 0 1.145 1.145 0 0 0 2.29 0"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgDataVisHierarchy);
export default ForwardRef;
