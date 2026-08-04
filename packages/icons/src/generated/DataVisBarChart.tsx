import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgDataVisBarChart = (
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
      d="M3.418 2.615A.712.712 0 0 0 2 2.712v18.576l.006.097a.71.71 0 0 0 .706.615h18.576l.097-.006a.71.71 0 0 0 .615-.706l-.006-.097a.71.71 0 0 0-.706-.615H3.424v-1.26h14.754c.795 0 1.345-.733 1.345-1.555v-1.614c0-.373-.113-.739-.327-1.025a1.27 1.27 0 0 0-1.02-.532H3.425v-1.052h9.814c.404 0 .77-.203 1.018-.532.214-.286.328-.652.328-1.025v-1.614c0-.372-.113-.738-.328-1.024a1.27 1.27 0 0 0-1.019-.532H3.424V7.552h9.814c.404 0 .77-.202 1.018-.532.214-.286.328-.651.328-1.024V4.382c0-.373-.113-.738-.328-1.025a1.27 1.27 0 0 0-1.019-.531H3.424v-.114zm9.718 9.498H3.424v-1.879h9.712l.018.063a.4.4 0 0 1 .005.07v1.614l-.006.07a.3.3 0 0 1-.017.062M3.424 6.127V4.25h9.712l.018.062a.4.4 0 0 1 .005.07v1.615l-.006.07a.3.3 0 0 1-.017.061zm0 9.887h14.65l.02.062a.4.4 0 0 1 .005.07v1.662c-.002.07 0 .085.079.085H3.424z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgDataVisBarChart);
export default ForwardRef;
