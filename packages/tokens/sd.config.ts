import StyleDictionary from 'style-dictionary';
import './sd.transforms.ts';
import { aliasPathRemapPreprocessor, renameValueGroupsPreprocessor } from './sd.preprocessors.ts';

StyleDictionary.registerPreprocessor(renameValueGroupsPreprocessor);
StyleDictionary.registerPreprocessor(aliasPathRemapPreprocessor);

/**
 * Single-mode reference build: light + roomy only, all tokens in one
 * file. Useful for quick inspection and as a smoke test, but this is NOT
 * how the DS actually ships tokens -- see scripts/build-tokens.ts for the
 * real multi-mode build that splits color/density into
 * tokens.css/dark.css/density.css per docs/PLAN.md §1.1.
 */
export default {
  source: ['source/tokens.json'],
  platforms: {
    css: {
      preprocessors: ['purpose/rename-value-groups', 'purpose/alias-path-remap'],
      // @ts-expect-error -- `context` is a custom field the alias-path-remap
      // preprocessor reads off the platform config; not part of SD's PlatformConfig type.
      context: { color: 'light', density: 'roomy' },
      transformGroup: 'purpose/css',
      buildPath: 'build/css/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
        },
      ],
    },
  },
};
