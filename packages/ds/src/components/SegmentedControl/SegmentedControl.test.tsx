import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SegmentedControl } from './SegmentedControl';

function renderSegmentedControl() {
  return render(
    <SegmentedControl.Root defaultValue="list">
      <SegmentedControl.List>
        <SegmentedControl.Trigger value="list">List</SegmentedControl.Trigger>
        <SegmentedControl.Trigger value="map">Map</SegmentedControl.Trigger>
        <SegmentedControl.Trigger value="satellite" disabled>
          Satellite
        </SegmentedControl.Trigger>
      </SegmentedControl.List>
      <SegmentedControl.Content value="list">
        Store list view
      </SegmentedControl.Content>
      <SegmentedControl.Content value="map">
        Store map view
      </SegmentedControl.Content>
      <SegmentedControl.Content value="satellite">
        Satellite view
      </SegmentedControl.Content>
    </SegmentedControl.Root>,
  );
}

describe('SegmentedControl', () => {
  it('renders a tablist with the default segment active and its panel shown', () => {
    renderSegmentedControl();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'List' })).toHaveAttribute(
      'data-state',
      'active',
    );
    expect(screen.getByRole('tab', { name: 'Map' })).toHaveAttribute(
      'data-state',
      'inactive',
    );
    expect(screen.getByText('Store list view')).toBeInTheDocument();
    expect(screen.queryByText('Store map view')).not.toBeInTheDocument();
  });

  it('switches the active segment and panel on click', async () => {
    renderSegmentedControl();
    await userEvent.click(screen.getByRole('tab', { name: 'Map' }));
    expect(screen.getByRole('tab', { name: 'Map' })).toHaveAttribute(
      'data-state',
      'active',
    );
    expect(screen.getByText('Store map view')).toBeInTheDocument();
    expect(screen.queryByText('Store list view')).not.toBeInTheDocument();
  });

  it('renders a disabled trigger as a native disabled button', () => {
    renderSegmentedControl();
    expect(screen.getByRole('tab', { name: 'Satellite' })).toBeDisabled();
  });

  it('renders a leading icon when the icon prop is passed', () => {
    render(
      <SegmentedControl.Root defaultValue="list">
        <SegmentedControl.List>
          <SegmentedControl.Trigger value="list" icon={<svg aria-hidden />}>
            List
          </SegmentedControl.Trigger>
        </SegmentedControl.List>
      </SegmentedControl.Root>,
    );
    expect(
      screen.getByRole('tab', { name: 'List' }).querySelector('svg'),
    ).toBeInTheDocument();
  });

  it('renders the label text twice for the layout-shift fix but hides the ghost copy from assistive tech', () => {
    renderSegmentedControl();
    const trigger = screen.getByRole('tab', { name: 'List' });
    expect(screen.getAllByText('List')).toHaveLength(2);
    const hidden = trigger.querySelector('[aria-hidden="true"]');
    expect(hidden).toHaveTextContent('List');
  });

  it('sets data-density on the root when provided', () => {
    render(
      <SegmentedControl.Root defaultValue="list" density="condensed">
        <SegmentedControl.List>
          <SegmentedControl.Trigger value="list">List</SegmentedControl.Trigger>
        </SegmentedControl.List>
      </SegmentedControl.Root>,
    );
    expect(
      screen.getByRole('tablist').closest('[data-density]'),
    ).toHaveAttribute('data-density', 'condensed');
  });
});
