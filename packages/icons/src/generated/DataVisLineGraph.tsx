import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgDataVisLineGraph = (
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
      d="M2.74 2a.74.74 0 0 1 .735.64l.006.1v7.335l3.481-2.089a1.975 1.975 0 1 1 3.926-.24l2.209.981a1.97 1.97 0 0 1 1.938-.472L18.1 4.423a1.975 1.975 0 1 1 .903 1.243L16.192 9.18a1.975 1.975 0 1 1-3.697.9l-2.209-.98c-.355.343-.84.554-1.372.554-.447 0-.859-.148-1.19-.397l-4.243 2.545v5.79l2.229-1.115a1.975 1.975 0 0 1 3.8-.897h2.51a1.976 1.976 0 0 1 3.073-.796l2.959-1.644a1.975 1.975 0 1 1 .503 1.415l-2.743 1.524q.015.12.015.242a1.975 1.975 0 0 1-3.807.74H9.51a1.976 1.976 0 0 1-3.138.741l-2.89 1.446v1.27h17.777a.74.74 0 0 1 .734.64l.007.101a.74.74 0 0 1-.64.734l-.1.007H2.74a.74.74 0 0 1-.733-.64L2 21.26V2.74c0-.408.332-.74.74-.74m16.842 2.195.016.029a.494.494 0 1 0-.016-.03M8.49 7.933l.005.008a.494.494 0 1 0-.01-.016zm5.793 8.148-.002-.005a.494.494 0 1 0 .005.01zm5.268-2.706a.494.494 0 1 0 .947-.28.494.494 0 0 0-.947.28m-5.082-3.72a.494.494 0 1 1 0 .987.494.494 0 0 1 0-.988m-6.79 6.172a.494.494 0 1 1 0 .988.494.494 0 0 1 0-.988"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgDataVisLineGraph);
export default ForwardRef;
