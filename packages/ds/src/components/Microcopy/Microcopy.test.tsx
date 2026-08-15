import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Microcopy } from './Microcopy';

describe('Microcopy', () => {
  describe('rendering', () => {
    it('renders as a native p element', () => {
      render(<Microcopy data-testid="microcopy">Helper text</Microcopy>);
      expect(screen.getByTestId('microcopy').tagName).toBe('P');
    });

    it('renders children as the text content', () => {
      render(<Microcopy>We never share this.</Microcopy>);
      expect(screen.getByText('We never share this.')).toBeInTheDocument();
    });
  });

  describe('error prop', () => {
    it('applies the default microcopy color by default', () => {
      render(<Microcopy data-testid="microcopy">Helper text</Microcopy>);
      const classNames = screen.getByTestId('microcopy').className.split(' ');
      expect(classNames).toContain(
        'text-[color:var(--component-label-text-color-microcopy)]',
      );
      expect(classNames).not.toContain(
        'text-[color:var(--component-label-text-color-error)]',
      );
    });

    it('applies the error color when error is true', () => {
      render(
        <Microcopy error data-testid="microcopy">
          Helper text
        </Microcopy>,
      );
      const classNames = screen.getByTestId('microcopy').className.split(' ');
      expect(classNames).toContain(
        'text-[color:var(--component-label-text-color-error)]',
      );
      expect(classNames).not.toContain(
        'text-[color:var(--component-label-text-color-microcopy)]',
      );
    });
  });

  describe('className merge', () => {
    it('lets a consumer className override the default font-size utility', () => {
      render(
        <Microcopy data-testid="microcopy" className="text-2xl">
          Helper text
        </Microcopy>,
      );
      const classNames = screen.getByTestId('microcopy').className.split(' ');
      expect(classNames).toContain('text-2xl');
      expect(classNames).not.toContain(
        'text-[length:var(--component-label-font-size-default)]',
      );
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to the underlying p element', () => {
      const ref = createRef<HTMLParagraphElement>();
      render(<Microcopy ref={ref}>Helper text</Microcopy>);
      expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
    });
  });
});
