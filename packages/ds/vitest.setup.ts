import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

afterEach(() => {
  cleanup();
});

// jsdom doesn't implement these, but Radix's pointer-driven primitives
// (Select, and later Popover/Tooltip/DropdownMenu) call them internally.
if (!window.HTMLElement.prototype.hasPointerCapture) {
  window.HTMLElement.prototype.hasPointerCapture = () => false;
}
if (!window.HTMLElement.prototype.setPointerCapture) {
  window.HTMLElement.prototype.setPointerCapture = () => {};
}
if (!window.HTMLElement.prototype.releasePointerCapture) {
  window.HTMLElement.prototype.releasePointerCapture = () => {};
}
if (!window.HTMLElement.prototype.scrollIntoView) {
  window.HTMLElement.prototype.scrollIntoView = () => {};
}

// jsdom doesn't implement ResizeObserver at all — SearchInput.Root uses one
// to track its own rendered width for Suggestions' max-width clamp. A
// no-op default is enough for tests that don't exercise that clamp
// directly; SearchInput.test.tsx overrides this locally (vi.stubGlobal)
// where it needs to invoke the observer's callback with a fabricated
// width — real pixel measurement isn't available in jsdom regardless
// (see docs/TESTING_PLAN.md).
if (!window.ResizeObserver) {
  class NoopResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver =
    NoopResizeObserver as unknown as typeof ResizeObserver;
}
