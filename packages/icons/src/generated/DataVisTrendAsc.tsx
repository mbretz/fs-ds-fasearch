import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgDataVisTrendAsc = (
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
      d="M21.953 2.386A.62.62 0 0 0 21.375 2h-3.75a.625.625 0 1 0 0 1.25h2.241l-3.141 3.141a1.25 1.25 0 0 1-1.243.314l-.018-.005-4.758-1.272a2.5 2.5 0 0 0-2.413.648l-4.86 4.86a.625.625 0 1 0 .884.883l4.86-4.86a1.25 1.25 0 0 1 1.207-.323l4.749 1.269a2.5 2.5 0 0 0 2.476-.63l3.141-3.141v2.241a.625.625 0 1 0 1.25 0v-3.75a.6.6 0 0 0-.047-.24M9.866 9.866a1.25 1.25 0 0 1 .884-.366h2.5a1.25 1.25 0 0 1 1.25 1.25v10h1.25v-7.5A1.25 1.25 0 0 1 17 12h2.5a1.25 1.25 0 0 1 1.25 1.25v7.5h.625a.625.625 0 1 1 0 1.25H2.625a.625.625 0 1 1 0-1.25h.625V17a1.25 1.25 0 0 1 1.25-1.25H7A1.25 1.25 0 0 1 8.25 17v3.75H9.5v-10c0-.332.132-.65.366-.884M19.5 13.25H17v7.5h2.5zm-8.75-2.5h2.5v10h-2.5zM7 20.75V17H4.5v3.75z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgDataVisTrendAsc);
export default ForwardRef;
