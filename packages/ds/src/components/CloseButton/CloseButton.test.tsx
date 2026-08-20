import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CloseButton } from './CloseButton';

describe('CloseButton', () => {
  describe('density', () => {
    it('sets data-density on the rendered button when provided', () => {
      render(<CloseButton density="condensed" />);
      expect(screen.getByRole('button', { name: 'Close' })).toHaveAttribute(
        'data-density',
        'condensed',
      );
    });

    it('has no data-density attribute when omitted', () => {
      render(<CloseButton />);
      expect(screen.getByRole('button', { name: 'Close' })).not.toHaveAttribute(
        'data-density',
      );
    });
  });
});
