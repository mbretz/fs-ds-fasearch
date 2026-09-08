import * as React from 'react';
import type { SVGProps } from 'react';
import { Ref, forwardRef } from 'react';
const SvgPhone = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="m21.278 16.363-2.132-2.136a2.445 2.445 0 0 0-3.46 0l-.435.435A47.3 47.3 0 0 1 9.336 8.73l.435-.436a2.456 2.456 0 0 0 0-3.465L7.634 2.695a2.505 2.505 0 0 0-3.464 0L3.005 3.868a3.47 3.47 0 0 0-.435 4.35 47.15 47.15 0 0 0 13.195 13.218A3.49 3.49 0 0 0 20.113 21l1.17-1.172a2.446 2.446 0 0 0 0-3.464z"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgPhone);
export default ForwardRef;
