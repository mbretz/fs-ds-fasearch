import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgBuildingInstitution = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>,
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
      d="M21.714 21.001a.714.714 0 1 1 0 1.428h-20a.714.714 0 0 1 0-1.428zM6 9.572c.394 0 .714.32.714.714v8.571c0 .395-.32.715-.714.715H3.143a.715.715 0 0 1-.714-.715v-8.57a.714.714 0 0 1 1.427 0v7.857h1.43v-7.858c0-.394.32-.714.714-.714m7.144 0c.394 0 .713.32.713.714v8.571c0 .395-.32.715-.713.715h-2.858a.715.715 0 0 1-.714-.715v-8.57a.714.714 0 1 1 1.428 0v7.857h1.429v-7.858c0-.394.32-.714.715-.714m7.142 0c.394 0 .714.32.714.714v8.571c0 .395-.32.715-.714.715H17.43a.715.715 0 0 1-.714-.715v-8.57a.713.713 0 1 1 1.428 0v7.857h1.428v-7.858c0-.394.32-.714.715-.714M11.714 1c.402 0 .796.115 1.137.328l9.228 5.486a.714.714 0 0 1-.365 1.329h-20a.715.715 0 0 1-.365-1.329l9.227-5.487v.001c.341-.214.735-.328 1.138-.328m.386 1.542a.72.72 0 0 0-.772 0l-.393-.612.372.625-6.994 4.159h14.802l-6.994-4.16zl.38-.59.012-.022zm-.772 0-.021.013-.366-.615z"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgBuildingInstitution);
export default ForwardRef;
