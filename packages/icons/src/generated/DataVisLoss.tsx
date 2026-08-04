import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgDataVisLoss = (
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
      fill="#CB0B31"
      d="M12.435 2c-.594 0-1.079.475-1.079 1.069v15.27l-3.523-3.524a1.06 1.06 0 0 0-1.395-.098l-.119.098a1.057 1.057 0 0 0 0 1.515l5.354 5.363q.056.055.119.1l.04.019q.037.027.078.05l.06.03.079.039.04.02.098.03h.05q.097.017.198.019h-.099.198l.089-.02h.04l.098-.03.04-.02.09-.029.059-.04.069-.04c.05-.039.109-.078.158-.138l5.374-5.353a1.07 1.07 0 1 0-1.514-1.515l-3.533 3.523V3.068c0-.544-.396-.989-.93-1.068z"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgDataVisLoss);
export default ForwardRef;
