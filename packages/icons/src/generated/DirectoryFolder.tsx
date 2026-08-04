import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgDirectoryFolder = (
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
      d="M11.109 5.48h8.953C21.132 5.48 22 6.35 22 7.42V18.58c0 1.07-.868 1.938-1.938 1.938H3.938A1.94 1.94 0 0 1 2 18.581V4.938C2 3.868 2.868 3 3.938 3h4.341c.61 0 1.185.287 1.55.775zM3.937 4.396c-.3 0-.543.244-.543.543v13.643c0 .3.244.543.543.543h16.124c.3 0 .543-.243.543-.543V7.42c0-.3-.244-.543-.543-.543H10.76a.7.7 0 0 1-.558-.28l-1.49-1.984a.54.54 0 0 0-.433-.217z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgDirectoryFolder);
export default ForwardRef;
