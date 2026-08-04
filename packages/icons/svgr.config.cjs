// Only the neutral default icon fill (#006DA3) is coerced to currentColor.
// A handful of icons (trash, notice-error, notice-warning, checkmark-circle,
// data-vis-gain/loss, rating-star-*) carry intentional semantic accent colors
// (red/green/orange/gold) and must keep their authored hex values — see
// docs/PLAN.md §1.2 "Known inconsistencies".
module.exports = {
  typescript: true,
  ref: true,
  expandProps: 'end',
  replaceAttrValues: {
    '#006DA3': 'currentColor',
  },
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
