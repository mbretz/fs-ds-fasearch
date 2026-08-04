import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgTrashSm = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    ref={ref}
    {...props}
  >
    <path
      fill="#CB0B31"
      fillRule="evenodd"
      d="M12.16 5.8H3.849a.28.28 0 0 0-.279.304l.718 7.882A1.115 1.115 0 0 0 5.398 15h5.212c.577 0 1.059-.44 1.11-1.014l.717-7.882a.28.28 0 0 0-.277-.304m-5.13 7.249a.418.418 0 0 1-.836 0V8.03a.418.418 0 1 1 .836 0zm2.37.418a.42.42 0 0 0 .418-.418V8.03a.418.418 0 1 0-.836 0v5.019c0 .23.187.418.418.418"
      clipRule="evenodd"
    />
    <path
      fill="#CB0B31"
      d="M12.741 3.572a6.3 6.3 0 0 0-2.19-.57 2.627 2.627 0 0 0-5.102 0 6.5 6.5 0 0 0-2.132.545 1.03 1.03 0 0 0-.627.888.53.53 0 0 0 .531.539h9.562a.53.53 0 0 0 .53-.524 1 1 0 0 0-.572-.878M7.99 2.062a1.53 1.53 0 0 1 1.393.834 24 24 0 0 0-2.762 0 1.5 1.5 0 0 1 1.369-.833"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgTrashSm);
export default ForwardRef;
