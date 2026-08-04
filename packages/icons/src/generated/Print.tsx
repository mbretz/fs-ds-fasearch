import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgPrint = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M18.296 3.975v2.963h1.729c1.09 0 1.975.885 1.975 1.976v6.172a1.975 1.975 0 0 1-1.975 1.976h-1.729v4.197a.74.74 0 0 1-.74.741H6.444a.74.74 0 0 1-.74-.74v-4.198H3.975A1.975 1.975 0 0 1 2 15.086V8.914c0-1.091.884-1.976 1.975-1.976h1.729V3.975C5.704 2.885 6.588 2 7.679 2h8.642c1.09 0 1.975.884 1.975 1.975M7.186 6.938h9.629V3.975a.494.494 0 0 0-.494-.494H7.679a.494.494 0 0 0-.494.494zM3.48 15.086c0 .273.222.494.494.494h1.729v-2.963c0-.409.331-.74.74-.74h11.112c.409 0 .74.331.74.74v2.963h1.729a.494.494 0 0 0 .494-.494V8.914a.494.494 0 0 0-.494-.494H3.975a.494.494 0 0 0-.494.494zm3.704 1.235v-2.963h9.63v7.161h-9.63zm-.74-5.432H5.21a.74.74 0 0 1 0-1.482h1.234a.74.74 0 1 1 0 1.482m2.469 4.938h6.172a.74.74 0 0 0 0-1.481H8.914a.74.74 0 1 0 0 1.481m4.32 2.47h-4.32a.74.74 0 1 1 0-1.482h4.32a.74.74 0 0 1 0 1.481"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgPrint);
export default ForwardRef;
