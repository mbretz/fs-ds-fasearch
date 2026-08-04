// No currentColor / color-normalization pass — illustrations are intentionally
// multicolor and keep their authored fills/strokes as-is (docs/PLAN.md §1.3a).
module.exports = {
  typescript: true,
  ref: true,
  expandProps: 'end',
  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
          },
        },
      },
    ],
  },
};
