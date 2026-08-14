import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar, avatarRootVariants } from './Avatar';
import { cn } from '../../utils/cn';
import type { AvatarSize, AvatarVariant } from './Avatar.types';

/**
 * Radix's useImageLoadingStatus constructs `new window.Image()`, listens
 * for native 'load'/'error' events, and reads `image.complete` /
 * `image.naturalWidth` synchronously in its handlers — not onload/onerror
 * props. jsdom never actually loads images, so we stand in a minimal
 * EventTarget-based double that fires the right event on a macrotask,
 * matching what a real image load/failure looks like from Radix's POV.
 */
function mockImageStatus(status: 'load' | 'error') {
  const OriginalImage = globalThis.Image;

  class MockImage extends EventTarget {
    complete = false;
    naturalWidth = 0;
    src = '';

    constructor() {
      super();
      setTimeout(() => {
        if (status === 'load') {
          this.complete = true;
          this.naturalWidth = 1;
          this.dispatchEvent(new Event('load'));
        } else {
          this.dispatchEvent(new Event('error'));
        }
      }, 0);
    }
  }

  // @ts-expect-error -- test double, not a full HTMLImageElement
  globalThis.Image = MockImage;
  return () => {
    globalThis.Image = OriginalImage;
  };
}

describe('Avatar', () => {
  describe('rendering', () => {
    it('renders Fallback content when no Image is present', () => {
      render(
        <Avatar.Root>
          <Avatar.Fallback>WW</Avatar.Fallback>
        </Avatar.Root>,
      );
      expect(screen.getByText('WW')).toBeInTheDocument();
    });

    it('renders as a span by default', () => {
      render(
        <Avatar.Root data-testid="avatar-root">
          <Avatar.Fallback>WW</Avatar.Fallback>
        </Avatar.Root>,
      );
      expect(screen.getByTestId('avatar-root').tagName).toBe('SPAN');
    });
  });

  describe('Image -> Fallback swap', () => {
    it('renders Image and hides Fallback once loaded', async () => {
      const restore = mockImageStatus('load');
      render(
        <Avatar.Root>
          <Avatar.Image src="/photo.jpg" alt="profile" />
          <Avatar.Fallback>WW</Avatar.Fallback>
        </Avatar.Root>,
      );

      expect(
        await screen.findByRole('img', { name: 'profile' }),
      ).toBeInTheDocument();
      expect(screen.queryByText('WW')).not.toBeInTheDocument();
      restore();
    });

    it('falls back to Fallback content when Image errors', async () => {
      const restore = mockImageStatus('error');
      render(
        <Avatar.Root>
          <Avatar.Image src="/broken.jpg" alt="profile" />
          <Avatar.Fallback>WW</Avatar.Fallback>
        </Avatar.Root>,
      );

      expect(await screen.findByText('WW')).toBeInTheDocument();
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      restore();
    });
  });

  describe('size + variant props', () => {
    const SIZES: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    const VARIANTS: AvatarVariant[] = ['associate', 'entity'];

    it.each(SIZES)('applies avatarRootVariants output for size=%s', (size) => {
      render(
        <Avatar.Root data-testid="avatar-root" size={size}>
          <Avatar.Fallback>WW</Avatar.Fallback>
        </Avatar.Root>,
      );
      expect(screen.getByTestId('avatar-root').className).toBe(
        cn(avatarRootVariants({ size })),
      );
    });

    it.each(VARIANTS)(
      'applies avatarRootVariants output for variant=%s',
      (variant) => {
        render(
          <Avatar.Root data-testid="avatar-root" variant={variant}>
            <Avatar.Fallback>WW</Avatar.Fallback>
          </Avatar.Root>,
        );
        expect(screen.getByTestId('avatar-root').className).toBe(
          cn(avatarRootVariants({ variant })),
        );
      },
    );

    it('defaults to size=md, variant=associate when omitted', () => {
      render(
        <Avatar.Root data-testid="avatar-root">
          <Avatar.Fallback>WW</Avatar.Fallback>
        </Avatar.Root>,
      );
      expect(screen.getByTestId('avatar-root').className).toBe(
        cn(avatarRootVariants({})),
      );
    });
  });

  describe('className merge', () => {
    it('lets a consumer className override the default size utility', () => {
      render(
        <Avatar.Root data-testid="avatar-root" size="md" className="size-20">
          <Avatar.Fallback>WW</Avatar.Fallback>
        </Avatar.Root>,
      );
      const classNames = screen.getByTestId('avatar-root').className.split(' ');
      // twMerge should drop exactly the conflicting `size-*` utility, and
      // nothing else — in particular it must leave the unrelated
      // `[--avatar-icon-size:calc(...component-avatar-size-default...)]`
      // arbitrary-property declaration alone, since that's a different
      // utility group referencing the same CSS var for a different purpose.
      expect(classNames).toContain('size-20');
      expect(classNames).not.toContain(
        'size-[var(--component-avatar-size-default)]',
      );
      expect(classNames).toContain(
        '[--avatar-icon-size:calc(var(--component-avatar-size-default)*0.6)]',
      );
    });
  });

  describe('asChild', () => {
    it('renders the child element instead of a span, with variant classes applied', () => {
      render(
        <Avatar.Root asChild size="lg" variant="entity">
          <a href="/profile" data-testid="avatar-link">
            <Avatar.Fallback>WW</Avatar.Fallback>
          </a>
        </Avatar.Root>,
      );
      const link = screen.getByTestId('avatar-link');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/profile');
      expect(link.className).toBe(
        cn(avatarRootVariants({ size: 'lg', variant: 'entity' })),
      );
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to the underlying span', () => {
      const ref = createRef<HTMLSpanElement>();
      render(
        <Avatar.Root ref={ref}>
          <Avatar.Fallback>WW</Avatar.Fallback>
        </Avatar.Root>,
      );
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(ref.current?.tagName).toBe('SPAN');
    });
  });
});
