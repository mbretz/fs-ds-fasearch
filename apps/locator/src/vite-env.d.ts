/// <reference types="vite/client" />

// vite-imagetools' `?...&as=srcset` output isn't covered by vite/client's
// plain `*.png` module declaration (TS matches wildcard module patterns by
// suffix, and this specifier's suffix is `&as=srcset`, not `.png`), so it
// needs its own ambient declaration — same pattern used throughout the
// vite-imagetools ecosystem.
declare module '*&as=srcset' {
  const srcset: string;
  export default srcset;
}
