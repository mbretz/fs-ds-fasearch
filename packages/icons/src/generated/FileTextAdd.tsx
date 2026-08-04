import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgFileTextAdd = (
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
      d="M2.862 2.862a.67.67 0 0 1 .471-.195h9.448c.177 0 .346.07.471.195l2.553 2.552a.67.67 0 0 1 .195.471V8a.667.667 0 0 0 1.333 0V5.885a2 2 0 0 0-.585-1.413l-2.553-2.553a2 2 0 0 0-1.414-.586H3.333a2 2 0 0 0-2 2V18a2 2 0 0 0 2 2H8a.667.667 0 1 0 0-1.333H3.333A.666.666 0 0 1 2.667 18V3.333c0-.176.07-.346.195-.471M4 7.333c0-.368.298-.666.667-.666H14A.667.667 0 1 1 14 8H4.667A.667.667 0 0 1 4 7.333m8.424 5.091a6 6 0 1 1 8.486 8.486 6 6 0 0 1-8.486-8.486M16.667 12a4.666 4.666 0 1 0 0 9.333 4.666 4.666 0 0 0 0-9.333m0 1.333c.368 0 .666.299.666.667v2h2a.667.667 0 0 1 0 1.333h-2v2a.667.667 0 1 1-1.333 0v-2h-2A.667.667 0 1 1 14 16h2v-2c0-.368.299-.667.667-.667m-12-2.666a.667.667 0 0 0 0 1.333H10a.667.667 0 0 0 0-1.333zM4 15.333c0-.368.298-.666.667-.666H8A.667.667 0 0 1 8 16H4.667A.667.667 0 0 1 4 15.333"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgFileTextAdd);
export default ForwardRef;
