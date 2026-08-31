import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { SPACING_SCALE } from './spacing-scale';

// Guards against SPACING_SCALE drifting from the actual
// --density-spacing-dynamic-* custom properties it mirrors (there's no
// generated manifest of token step names to import instead -- see the
// spacing-scale.ts comment / docs/PLAN.md discussion). 'none' is excluded:
// it's a synthetic zero step, not a real token.
describe('SPACING_SCALE', () => {
  it('matches every --density-spacing-dynamic-* step defined in density.css', () => {
    const densityCssPath = resolve(
      dirname(fileURLToPath(import.meta.url)),
      '../../../tokens/build/css/density.css',
    );
    const css = readFileSync(densityCssPath, 'utf-8');
    const tokenSteps = new Set(
      [...css.matchAll(/--density-spacing-dynamic-([a-z-]+):/g)].map(
        (match) => match[1],
      ),
    );

    const scaleSteps = new Set(SPACING_SCALE.filter((step) => step !== 'none'));

    expect(tokenSteps.size).toBeGreaterThan(0);
    expect(scaleSteps).toEqual(tokenSteps);
  });
});
