import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgTable = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M4.053 2h15.894C21.081 2 22 2.92 22 4.053v15.894C22 21.081 21.08 22 19.947 22H4.053A2.053 2.053 0 0 1 2 19.947V4.053C2 2.92 2.92 2 4.053 2m-.596 10.729v7.218c0 .329.267.596.596.596h7.219v-7.814zm7.815-1.457H3.456V4.052c0-.329.267-.596.596-.596h7.219zm1.456 1.457v7.814h7.219a.596.596 0 0 0 .596-.596v-7.218zm7.815-1.457h-7.815V3.456h7.219c.329 0 .596.267.596.596z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgTable);
export default ForwardRef;
