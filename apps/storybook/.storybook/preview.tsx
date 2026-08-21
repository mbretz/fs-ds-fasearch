import { useEffect } from 'react';
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
      // Also mirrors onto the real <html> element, not just this decorator's
      // own wrapper div — Radix Portal-rendered content (Dialog, SelectInput's
      // dropdown, later Popover/Tooltip) renders to document.body, escaping
      // this div entirely, so without a live global fallback here, portal
      // components with no explicit `density` prop of their own would have
      // no data-density ancestor anywhere and their density-scoped CSS vars
      // would silently fail to resolve. Kept in sync with the toolbar (not
      // just set once) so switching density still affects portal content.
      useEffect(() => {
        document.documentElement.setAttribute('data-density', density);
      }, [density]);
      return (
        <div data-density={density}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
