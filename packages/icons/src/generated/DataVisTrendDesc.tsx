import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgDataVisTrendDesc = (
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
      d="m4.488 2.217-.084-.073c-.723-.534-1.585.541-.942 1.182l4.8 4.785.135.125a2.58 2.58 0 0 0 2.35.544l4.7-1.255.14-.033c.374-.066.745.049 1.003.306l3.186 3.177h-2.22l-.101.008a.76.76 0 0 0-.64.762c0 .425.331.769.74.769h3.704l.1-.007a.76.76 0 0 0 .641-.762V8.053l-.007-.104a.75.75 0 0 0-.734-.665l-.1.007a.76.76 0 0 0-.64.762v1.53l-2.903-2.895-.139-.128a2.58 2.58 0 0 0-2.42-.519L10.379 7.29l-.132.026a1.13 1.13 0 0 1-.959-.315zM22 21.23c0-.425-.332-.77-.74-.77h-.495v-3.537c0-.772-.614-1.385-1.358-1.385h-2.469c-.743 0-1.358.613-1.358 1.385v3.538h-.987V10.77c0-.772-.615-1.385-1.358-1.385h-2.47c-.743 0-1.358.613-1.358 1.385v9.69H8.42v-7.23c0-.771-.615-1.384-1.358-1.384h-2.47c-.743 0-1.357.613-1.357 1.385v7.23H2.74l-.1.007A.76.76 0 0 0 2 21.23c0 .425.332.769.74.769h18.52l.1-.007a.76.76 0 0 0 .64-.762M6.938 13.386v7.076H4.716v-7.076zm12.346 7.076v-3.386h-2.222v3.386zm-6.173-9.539v9.539H10.89v-9.539z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgDataVisTrendDesc);
export default ForwardRef;
