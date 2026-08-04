import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgProtectionShield = (
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
      d="m12 2 .56.002a23.8 23.8 0 0 1 8.132 1.556c.802.322 1.314 1.026 1.308 1.794v6.267c0 4.36-3.064 8.272-7.708 9.838l-.977.329a4.14 4.14 0 0 1-2.63 0l-.977-.33C5.064 19.891 2 15.98 2 11.62V5.307c.016-.753.524-1.435 1.315-1.752a21 21 0 0 1 3.058-.935 24 24 0 0 1 5.068-.618zM4.013 4.904q1.12-.427 2.29-.729L19.22 15.667A9.2 9.2 0 0 1 17.31 18L3.69 6.065v-.713a.485.485 0 0 1 .322-.447zM3.69 8.16v3.459c0 3.748 2.634 7.109 6.624 8.455l.979.33c.455.153.96.153 1.415-.001l.977-.33a11 11 0 0 0 2.337-1.107zm16.206 5.998L8.222 3.772c1.06-.173 2.137-.27 3.22-.288l.566-.003a21.9 21.9 0 0 1 7.994 1.43c.183.073.31.246.308.436v6.272c0 .874-.143 1.727-.414 2.539"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgProtectionShield);
export default ForwardRef;
