import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// Sibling to vitest.config.ts (jsdom) — not a replacement. Runs
// apps/storybook/.storybook's stories as real-browser Vitest tests via
// Playwright, so `pnpm --filter ds test` stays fast/browser-dependency-free
// by default. See docs/TESTING_PLAN.md.
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        // The addon-vitest plugin always resolves Vite's `root` to the
        // parent of `configDir` (apps/storybook) regardless of where this
        // config file lives, then computes the story include glob relative
        // to whatever `root` Vitest resolves for this project — so `root`
        // must be set explicitly here to match, or the two disagree and no
        // story files are found.
        root: path.join(dirname, '../../apps/storybook'),
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '../../apps/storybook/.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
