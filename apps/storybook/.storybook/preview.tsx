import type { Preview } from '@storybook/react-vite';
import 'ds/src/theme.css';

const preview: Preview = {
  globalTypes: {
    density: {
      description: 'Density theme',
      toolbar: {
        title: 'Density',
        icon: 'component',
        items: [
          { value: 'roomy', title: 'Roomy' },
          { value: 'condensed', title: 'Condensed' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    density: 'roomy',
  },
  decorators: [
    (Story, context) => {
      const density = context.globals.density ?? 'roomy';
      return (
        <div data-density={density}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
