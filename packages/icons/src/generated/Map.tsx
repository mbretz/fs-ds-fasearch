import * as React from 'react';
import type { SVGProps } from 'react';
import { Ref, forwardRef } from 'react';
const SvgMap = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
    ref={ref}
    {...props}
  >
    <g stroke="currentColor" strokeWidth={1.5} clipPath="url(#a)">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22.547 9.188V5.109a1.41 1.41 0 0 0-.884-1.306l-5.625-2.25a1.4 1.4 0 0 0-1.044 0L9.007 3.949a1.4 1.4 0 0 1-1.044 0L2.418 1.731a.703.703 0 0 0-.965.656v13.475a1.41 1.41 0 0 0 .884 1.306l5.625 2.25c.335.134.709.134 1.044 0l2.701-1.081M8.484 4.05v15.468M15.516 1.453v7.031"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18.328 11.366a4.22 4.22 0 0 1 4.219 4.219c0 1.801-2.52 5.228-3.665 6.692a.703.703 0 0 1-1.108 0c-1.145-1.463-3.665-4.891-3.665-6.692a4.22 4.22 0 0 1 4.219-4.219"
      />
      <path d="M18.328 15.938a.352.352 0 0 1 0-.703M18.328 15.938a.352.352 0 0 0 0-.703" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
const ForwardRef = forwardRef(SvgMap);
export default ForwardRef;
