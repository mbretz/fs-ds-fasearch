import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from './Tabs';

function renderTabs() {
  return render(
    <Tabs.Root defaultValue="one">
      <Tabs.List>
        <Tabs.Trigger value="one">One</Tabs.Trigger>
        <Tabs.Trigger value="two">Two</Tabs.Trigger>
        <Tabs.Trigger value="three" disabled>
          Three
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="one">Panel one</Tabs.Content>
      <Tabs.Content value="two">Panel two</Tabs.Content>
      <Tabs.Content value="three">Panel three</Tabs.Content>
    </Tabs.Root>,
  );
}

describe('Tabs', () => {
  it('renders a tablist with the default tab active and its panel shown', () => {
    renderTabs();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute(
      'data-state',
      'active',
    );
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute(
      'data-state',
      'inactive',
    );
    expect(screen.getByText('Panel one')).toBeInTheDocument();
    expect(screen.queryByText('Panel two')).not.toBeInTheDocument();
  });

  it('switches the active tab and panel on click', async () => {
    renderTabs();
    await userEvent.click(screen.getByRole('tab', { name: 'Two' }));
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute(
      'data-state',
      'active',
    );
    expect(screen.getByText('Panel two')).toBeInTheDocument();
    expect(screen.queryByText('Panel one')).not.toBeInTheDocument();
  });

  it('renders a disabled trigger as a native disabled button', () => {
    renderTabs();
    expect(screen.getByRole('tab', { name: 'Three' })).toBeDisabled();
  });

  it('renders the label text twice for the layout-shift fix but hides the ghost copy from assistive tech', () => {
    renderTabs();
    const tab = screen.getByRole('tab', { name: 'One' });
    // Exactly one accessible occurrence of the label...
    expect(screen.getAllByText('One')).toHaveLength(2);
    // ...because one of the two DOM copies is aria-hidden.
    const hidden = tab.querySelector('[aria-hidden="true"]');
    expect(hidden).toHaveTextContent('One');
  });

  it('sets data-density on the root when provided', () => {
    render(
      <Tabs.Root defaultValue="one" density="condensed">
        <Tabs.List>
          <Tabs.Trigger value="one">One</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="one">Panel one</Tabs.Content>
      </Tabs.Root>,
    );
    expect(
      screen.getByRole('tablist').closest('[data-density]'),
    ).toHaveAttribute('data-density', 'condensed');
  });
});
