/**
 * Removes a `<html>` data attribute once the view transition it keys CSS
 * off has finished. A fixed timer from the click is wrong: the transition
 * starts after React Router's render, so a timer that fires mid-slide drops
 * the attribute and the UA default root fade replaces the slide.
 * `maxMs` caps the wait if no transition ever starts (unsupported browser).
 */
export function clearAfterViewTransition(
  attribute: keyof DOMStringMap,
  maxMs = 1500,
) {
  const start = performance.now();
  let seen = false;
  const check = () => {
    const running = document
      .getAnimations()
      .some(
        (a) =>
          a.effect instanceof KeyframeEffect &&
          a.effect.pseudoElement?.startsWith('::view-transition'),
      );
    seen ||= running;
    if ((seen && !running) || performance.now() - start > maxMs) {
      delete document.documentElement.dataset[attribute];
      return;
    }
    requestAnimationFrame(check);
  };
  requestAnimationFrame(check);
}
