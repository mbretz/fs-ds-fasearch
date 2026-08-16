import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChecklistGroup } from './ChecklistGroup';

function BasicChecklistGroup(
  props: Partial<React.ComponentProps<typeof ChecklistGroup.Group>> = {},
) {
  return (
    <ChecklistGroup.Root>
      <ChecklistGroup.Label>Select one or more options.</ChecklistGroup.Label>
      <ChecklistGroup.Group {...props}>
        <ChecklistGroup.Item>Option A</ChecklistGroup.Item>
        <ChecklistGroup.Item>Option B</ChecklistGroup.Item>
      </ChecklistGroup.Group>
      <ChecklistGroup.Microcopy>This is helpful text</ChecklistGroup.Microcopy>
    </ChecklistGroup.Root>
  );
}

describe('ChecklistGroup', () => {
  describe('composition', () => {
    it('renders Root, Label, Items, and Microcopy together', () => {
      render(<BasicChecklistGroup />);
      expect(
        screen.getByText('Select one or more options.'),
      ).toBeInTheDocument();
      expect(screen.getAllByRole('checkbox')).toHaveLength(2);
      expect(screen.getByText('This is helpful text')).toBeInTheDocument();
    });

    it('toggles each Item independently', async () => {
      const user = userEvent.setup();
      render(<BasicChecklistGroup />);
      const [optionA, optionB] = screen.getAllByRole('checkbox');
      await user.click(screen.getByText('Option A'));
      expect(optionA).toBeChecked();
      expect(optionB).not.toBeChecked();
    });
  });

  describe('Root width', () => {
    it('uses a minmax(max-content,1fr) grid column so content sets the minimum width', () => {
      render(
        <ChecklistGroup.Root data-testid="root">
          <ChecklistGroup.Label>Select one or more options.</ChecklistGroup.Label>
        </ChecklistGroup.Root>,
      );
      const classNames = screen.getByTestId('root').className.split(' ');
      expect(classNames).toContain('grid');
      expect(classNames).toContain('w-fit');
      expect(classNames).toContain('grid-cols-[minmax(max-content,1fr)]');
    });

    it('lets a consumer className override the default hug-to-content width', () => {
      render(
        <ChecklistGroup.Root data-testid="root" className="w-72">
          <ChecklistGroup.Label>Select one or more options.</ChecklistGroup.Label>
        </ChecklistGroup.Root>,
      );
      const classNames = screen.getByTestId('root').className.split(' ');
      expect(classNames).toContain('w-72');
      expect(classNames).not.toContain('w-fit');
    });
  });

  describe('nesting', () => {
    it('renders items nested inside a NestedGroup alongside top-level items', () => {
      render(
        <ChecklistGroup.Root>
          <ChecklistGroup.Group>
            <ChecklistGroup.Item checked="indeterminate">
              Select all
            </ChecklistGroup.Item>
            <ChecklistGroup.NestedGroup>
              <ChecklistGroup.Item>Child A</ChecklistGroup.Item>
              <ChecklistGroup.Item>Child B</ChecklistGroup.Item>
            </ChecklistGroup.NestedGroup>
          </ChecklistGroup.Group>
        </ChecklistGroup.Root>,
      );
      expect(screen.getAllByRole('checkbox')).toHaveLength(3);
      const nestedGroup = screen.getByText('Child A').closest('label')
        ?.parentElement;
      expect(nestedGroup?.children).toHaveLength(2);
      expect(nestedGroup).toContainElement(screen.getByText('Child B'));
    });
  });

  describe('select-all parent/child sync (consumer-owned pattern)', () => {
    // Same wiring as the Nested story: parent checked/indeterminate is
    // derived from children, clicking the parent bulk-sets all of them.
    function SelectAllExample() {
      const [children, setChildren] = useState({ a: false, b: false });
      const values = Object.values(children);
      const parentChecked: boolean | 'indeterminate' = values.every(Boolean)
        ? true
        : values.some(Boolean)
          ? 'indeterminate'
          : false;

      return (
        <ChecklistGroup.Root>
          <ChecklistGroup.Group>
            <ChecklistGroup.Item
              checked={parentChecked}
              onCheckedChange={(checked) =>
                setChildren({ a: checked === true, b: checked === true })
              }
            >
              Select all
            </ChecklistGroup.Item>
            <ChecklistGroup.NestedGroup>
              <ChecklistGroup.Item
                checked={children.a}
                onCheckedChange={(checked) =>
                  setChildren((prev) => ({ ...prev, a: checked === true }))
                }
              >
                Value A
              </ChecklistGroup.Item>
              <ChecklistGroup.Item
                checked={children.b}
                onCheckedChange={(checked) =>
                  setChildren((prev) => ({ ...prev, b: checked === true }))
                }
              >
                Value B
              </ChecklistGroup.Item>
            </ChecklistGroup.NestedGroup>
          </ChecklistGroup.Group>
        </ChecklistGroup.Root>
      );
    }

    it('starts unchecked when no children are checked', () => {
      render(<SelectAllExample />);
      const [selectAll] = screen.getAllByRole('checkbox');
      expect(selectAll).not.toBeChecked();
      expect(selectAll).toHaveAttribute('data-state', 'unchecked');
    });

    it('goes indeterminate when only some children are checked', async () => {
      const user = userEvent.setup();
      render(<SelectAllExample />);
      const [selectAll] = screen.getAllByRole('checkbox');
      await user.click(screen.getByText('Value A'));
      expect(selectAll).toHaveAttribute('data-state', 'indeterminate');
    });

    it('becomes checked once every child is checked', async () => {
      const user = userEvent.setup();
      render(<SelectAllExample />);
      const [selectAll] = screen.getAllByRole('checkbox');
      await user.click(screen.getByText('Value A'));
      await user.click(screen.getByText('Value B'));
      expect(selectAll).toBeChecked();
    });

    it('checks every child when the indeterminate parent is clicked', async () => {
      const user = userEvent.setup();
      render(<SelectAllExample />);
      await user.click(screen.getByText('Value A'));
      const [, childA, childB] = screen.getAllByRole('checkbox');
      expect(childA).toBeChecked();
      expect(childB).not.toBeChecked();

      await user.click(screen.getByText('Select all'));
      expect(childA).toBeChecked();
      expect(childB).toBeChecked();
    });

    it('unchecks every child when the fully-checked parent is clicked', async () => {
      const user = userEvent.setup();
      render(<SelectAllExample />);
      await user.click(screen.getByText('Select all'));
      const [, childA, childB] = screen.getAllByRole('checkbox');
      expect(childA).toBeChecked();
      expect(childB).toBeChecked();

      await user.click(screen.getByText('Select all'));
      expect(childA).not.toBeChecked();
      expect(childB).not.toBeChecked();
    });
  });

  describe('error state', () => {
    it('applies the error background/border to the Group and not the Root', () => {
      render(<BasicChecklistGroup error />);
      const group = screen.getByText('Option A').closest('label')
        ?.parentElement;
      expect(group?.className).toContain('border-[color:var(--group-field-border-color)]');
    });
  });
});
