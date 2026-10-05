import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { imagetools } from 'vite-imagetools';

// imagetools needs `sharp` (native libvips), which WebContainers (StackBlitz)
// can't run. There the `?w=...&as=srcset` imports fall back to a plain asset URL.
const isWebContainer = Boolean(process.versions.webcontainer);

export default defineConfig({
  plugins: [react(), tailwindcss(), ...(isWebContainer ? [] : [imagetools()])],
});
