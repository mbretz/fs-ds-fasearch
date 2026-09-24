import { useState } from 'react';
import { flushSync } from 'react-dom';
import { CaretUp, ChevronLeft, LoginKey } from 'icons';
import type { NewClientStatus } from '../../data/locations';
import { statusMeta } from '../entity-info/statusMeta';
import { Badge } from '../entity-info/Badge';
import { cn } from '../../utils/cn';

const STATUSES = Object.keys(statusMeta) as NewClientStatus[];

// Shared by `DesktopLegend` and `MobileLegend` below -- an attribute on
// `<html>`, not either component's own DOM, since the
// `::view-transition-*` pseudo-elements render in a top-layer tree
// rooted at the document, not nested under either component, so their
// direction-aware CSS has to key off something on `:root` to reach them.
// One shared attribute is safe (not a collision risk) since the two
// legends are mutually exclusive by viewport (`hidden`/`md:hidden`) and
// each only ever reads its own `view-transition-name`-scoped selectors.
const LEGEND_DIRECTION_ATTR = 'data-map-legend-transition';

function LegendRow({ status }: { status: NewClientStatus }) {
  const meta = statusMeta[status];
  return (
    <span className="flex w-full items-center gap-[var(--density-spacing-fixed-small)]">
      <Badge
        icon={meta.icon}
        colorVar={meta.borderColorVar}
        mode="inverse"
        className="size-8"
      />
      <span className="text-[length:var(--semantic-content-common-font-size)] leading-[length:var(--semantic-content-common-line-height)] font-[number:var(--semantic-content-common-font-weight)] text-[color:var(--semantic-content-common-text-color-default)] whitespace-nowrap">
        {meta.label}
      </span>
    </span>
  );
}

// Two distinct Figma components (`Key`, `Key-Mobile`), not one responsive
// component -- same `hidden`/`md:hidden` dual-mount convention
// ResultsToolbar.tsx already uses for a device-class (not component-
// width) layout decision, rather than a container query.
export function MapLegend({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'absolute top-[var(--density-spacing-fixed-small)] left-[var(--density-spacing-fixed-small)] z-index-popover',
        className,
      )}
    >
      {/* Desktop: collapsible, matching Figma's "Key" (1080:23525) in its
          expanded state -- plain local state, same as Mobile below, per
          the user. */}
      <div className="hidden md:block">
        <DesktopLegend />
      </div>
      {/* Mobile: collapsible (Figma's "Key-Mobile", 1204:38868) -- plain
          local state, no sync with anything else on the page, per the
          user. */}
      <div className="md:hidden">
        <MobileLegend />
      </div>
    </div>
  );
}

// Same `view-transition-name`-per-instance approach as `MobileLegend`
// below, under its own name so the two never collide with each other.
const DESKTOP_LEGEND_TRANSITION_NAME = 'map-legend-desktop';
const DESKTOP_LEGEND_GROUP_DURATION_MS = 260;
const DESKTOP_LEGEND_CROSSFADE_DURATION_MS = 100;

function DesktopLegend() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Same feature-detected View Transitions approach as `MobileLegend`
  // below -- see its own comment, including why the direction attribute
  // is set here (border/shape distortion during the crossfade otherwise
  // -- see the CSS below).
  const setExpanded = (next: boolean) => {
    if (!document.startViewTransition) {
      setIsExpanded(next);
      return;
    }
    document.documentElement.setAttribute(
      LEGEND_DIRECTION_ATTR,
      next ? 'expand' : 'collapse',
    );
    const transition = document.startViewTransition(() => {
      flushSync(() => setIsExpanded(next));
    });
    transition.finished.finally(() => {
      document.documentElement.removeAttribute(LEGEND_DIRECTION_ATTR);
    });
  };

  return (
    // Fixed 52x52 anchor box -- matches the expanded pill's own *actual*
    // (auto, content-driven) height: a 32px badge, 8px top/bottom
    // padding (16px), and the pill's 2px top/bottom border
    // (`--component-tag-border-width`, 4px) = 52px. Not 48px: an
    // earlier pass here sized this box off just the badge+padding,
    // forgetting the border also adds to an auto-height box (unlike an
    // explicitly-sized box, where box-sizing:border-box would fold the
    // border into a stated size instead) -- close enough at 48px that it
    // wasn't obviously wrong by eye, but the View Transition genuinely
    // was animating a few px of real height difference every toggle
    // (most visible shrinking on collapse), not a rendering artifact.
    // Height now never actually changes across the toggle, only width,
    // per the user ("resize the circle... to match the height of the
    // expanded legend"). Both states are `absolute top-0 left-0` within
    // it, same pinned-corner reasoning as `MobileLegend`'s own anchor
    // box, so the toggle reads as growing out to the right.
    <div className="relative size-[52px]">
      <style>{`
        /* Same crossfade fixes as \`MobileLegend\`'s own CSS below (that
           comment has the full reasoning) -- \`mix-blend-mode: normal\`
           for the ghosting halo, plus a fast crossfade timed to whichever
           end of the resize the box is near its *small* (circle)
           footprint at: early when expanding, delayed to the same-length
           window at the end when collapsing. Even though this is a
           same-height, width-only resize (simpler than Mobile's own
           two-axis one, per the user), the default crossfade still
           stretched the circle's own border into an oval while the box
           was mid-width, which is what this fixes. */
        ::view-transition-old(${DESKTOP_LEGEND_TRANSITION_NAME}),
        ::view-transition-new(${DESKTOP_LEGEND_TRANSITION_NAME}) {
          height: 100%;
          /* Explicit, not left to the UA default -- the first pass at
             this fix assumed that default was \`contain\`, but the
             border still warping mid-resize (reported on both the
             expand and, after the delay/easing fix below, the collapse
             direction) means it's actually more likely \`fill\`
             (stretching non-uniformly to the animated group box).
             \`contain\` is what actually stops each snapshot's own
             border from warping into an oval mid-resize, in either
             direction, regardless of how the delay/easing below lines
             up -- it fixes the root cause structurally rather than
             timing the crossfade around it. */
          object-fit: contain;
          mix-blend-mode: normal;
          animation-duration: ${DESKTOP_LEGEND_CROSSFADE_DURATION_MS}ms;
        }
        ::view-transition-old(${DESKTOP_LEGEND_TRANSITION_NAME}) {
          animation-name: legend-key-fade-out;
        }
        ::view-transition-new(${DESKTOP_LEGEND_TRANSITION_NAME}) {
          animation-name: legend-key-fade-in;
        }
        /* Same @keyframes names/definitions as \`MobileLegend\`'s own
           style block below -- harmless to redeclare identically (CSS
           just takes the matching rule), kept here too rather than
           relying on Mobile's copy always being mounted alongside this
           one. */
        @keyframes legend-key-fade-out {
          to { opacity: 0; }
        }
        @keyframes legend-key-fade-in {
          from { opacity: 0; }
        }
        :root[${LEGEND_DIRECTION_ATTR}='collapse']::view-transition-old(${DESKTOP_LEGEND_TRANSITION_NAME}),
        :root[${LEGEND_DIRECTION_ATTR}='collapse']::view-transition-new(${DESKTOP_LEGEND_TRANSITION_NAME}) {
          animation-delay: ${DESKTOP_LEGEND_GROUP_DURATION_MS - DESKTOP_LEGEND_CROSSFADE_DURATION_MS}ms;
        }
        ::view-transition-group(${DESKTOP_LEGEND_TRANSITION_NAME}) {
          animation-duration: ${DESKTOP_LEGEND_GROUP_DURATION_MS}ms;
          animation-timing-function: cubic-bezier(0.55, 0, 0.15, 1);
        }
        @media (prefers-reduced-motion: reduce) {
          ::view-transition-group(${DESKTOP_LEGEND_TRANSITION_NAME}),
          ::view-transition-old(${DESKTOP_LEGEND_TRANSITION_NAME}),
          ::view-transition-new(${DESKTOP_LEGEND_TRANSITION_NAME}) {
            animation: none !important;
          }
        }
      `}</style>
      {!isExpanded ? (
        <button
          type="button"
          aria-label="Show map legend"
          onClick={() => setExpanded(true)}
          className="absolute top-0 left-0 flex size-[52px] cursor-pointer items-center justify-center rounded-full border-[length:var(--component-tag-border-width)] border-[color:var(--semantic-control-color-border-color)] bg-[var(--semantic-surface-base-default)]"
          style={{ viewTransitionName: DESKTOP_LEGEND_TRANSITION_NAME }}
        >
          <LoginKey aria-hidden="true" className="size-5" />
        </button>
      ) : (
        <div
          className="absolute top-0 left-0 flex items-center gap-[var(--density-spacing-fixed-large)] rounded-full border-[length:var(--component-tag-border-width)] border-[color:var(--semantic-control-color-border-color)] bg-[var(--semantic-surface-base-default)] px-[var(--density-spacing-fixed-large)] py-[var(--density-spacing-fixed-small)] whitespace-nowrap"
          style={{ viewTransitionName: DESKTOP_LEGEND_TRANSITION_NAME }}
        >
          <button
            type="button"
            aria-label="Hide map legend"
            onClick={() => setExpanded(false)}
            className="flex size-[18px] shrink-0 cursor-pointer items-center justify-center rounded-full"
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
          </button>
          {STATUSES.map((status) => (
            <LegendRow key={status} status={status} />
          ))}
        </div>
      )}
    </div>
  );
}

// Named `view-transition-name` shared between the closed button and the
// expanded card below -- exactly one of the two is ever mounted at a
// time, so there's never a same-name collision to clean up. Scoped to
// this one instance (a `<style>` block keyed to the name rather than a
// project-wide stylesheet rule) -- same reasoning as `DesktopLegend`'s
// own name above, kept distinct from it.
const LEGEND_TRANSITION_NAME = 'map-legend-mobile';
const LEGEND_GROUP_DURATION_MS = 320;
const LEGEND_CROSSFADE_DURATION_MS = 100;

function MobileLegend() {
  const [isExpanded, setIsExpanded] = useState(false);

  // View Transitions (Baseline Newly Available, not yet Widely Available
  // per this repo's browser policy) -- feature-detected, falling back to
  // a plain instant state flip when unsupported. `flushSync` forces the
  // state update to commit synchronously inside the callback, which
  // `startViewTransition` requires to capture the *new* DOM before it
  // resolves; React's normal batching would otherwise let the callback
  // return before the update actually lands.
  const setExpanded = (next: boolean) => {
    if (!document.startViewTransition) {
      setIsExpanded(next);
      return;
    }
    // See `LEGEND_DIRECTION_ATTR`'s own comment, and the crossfade CSS
    // below -- expand and collapse both want the circle<->rounded-rect
    // crossfade to happen while the group box is near its *small* 32x32
    // footprint, which is the *start* of the animation when expanding
    // but the *end* of it when collapsing, per the user (flagged after
    // the first pass only handled the expand direction).
    document.documentElement.setAttribute(
      LEGEND_DIRECTION_ATTR,
      next ? 'expand' : 'collapse',
    );
    const transition = document.startViewTransition(() => {
      flushSync(() => setIsExpanded(next));
    });
    transition.finished.finally(() => {
      document.documentElement.removeAttribute(LEGEND_DIRECTION_ATTR);
    });
  };

  return (
    // Fixed 32x32 anchor box, sized to the closed button -- both states
    // below are absolutely positioned `top-0 left-0` *within* this box
    // rather than sitting in normal flow, pinning the shared top-left
    // corner across the toggle so the expand/collapse reads as growing
    // out to the right and down, and keeps the caret in the expanded
    // card lined up with where the key icon sat closed, per the user.
    <div className="relative size-8">
      <style>{`
        /* Chrome's default View Transitions crossfade blends the old/new
           snapshots with \`mix-blend-mode: plus-lighter\` -- an additive
           blend meant for two frames of near-identical content, but it
           reads as a visible "ghost" halo here since the old (circular
           button) and new (rounded-rect card) snapshots differ hugely in
           shape/coverage. \`normal\` swaps that for a plain opacity
           crossfade, which is what actually removes the ghosting.
           \`height: 100%\` (of \`::view-transition-image-pair()\`) is the
           modern-web-guidance same-document-transitions guide's own fix
           for this same root cause (a big aspect-ratio change between
           the two snapshots) -- without it each snapshot stretches to
           fill the *group* box's own animated aspect ratio directly,
           which is the non-uniform-stretch half of the ghosting; with it
           each snapshot instead sizes off a stable 100% height. That
           left the *width* still stretching non-uniformly to fill the
           box though (the button/card's own border visibly warping
           mid-resize, reported on both directions) -- the UA default for
           \`object-fit\` here turned out to actually be \`fill\`, not
           \`contain\` as first assumed; setting it explicitly is what
           actually stops that. */
        ::view-transition-old(${LEGEND_TRANSITION_NAME}),
        ::view-transition-new(${LEGEND_TRANSITION_NAME}) {
          height: 100%;
          object-fit: contain;
          mix-blend-mode: normal;
          animation-duration: ${LEGEND_CROSSFADE_DURATION_MS}ms;
        }
        ::view-transition-old(${LEGEND_TRANSITION_NAME}) {
          animation-name: legend-key-fade-out;
        }
        ::view-transition-new(${LEGEND_TRANSITION_NAME}) {
          animation-name: legend-key-fade-in;
        }
        @keyframes legend-key-fade-out {
          to { opacity: 0; }
        }
        @keyframes legend-key-fade-in {
          from { opacity: 0; }
        }
        /* Runs the crossfade at the start of the animation when
           expanding (the group box is still near its small 32x32
           footprint then) but delays it until the same-length window at
           the *end* when collapsing (the box only gets back down near
           32x32 late in that direction) -- see \`LEGEND_DIRECTION_ATTR\`'s
           own comment above for why \`:root\` is what carries the
           direction. Without this, collapsing was crossfading a full-size
           card snapshot into a circle snapshot while the box was still
           mostly full-size, stretching the small circle into an
           oval -- the same ghosting the expand-direction fix above
           addressed, just showing up in the other direction. */
        :root[${LEGEND_DIRECTION_ATTR}='collapse']::view-transition-old(${LEGEND_TRANSITION_NAME}),
        :root[${LEGEND_DIRECTION_ATTR}='collapse']::view-transition-new(${LEGEND_TRANSITION_NAME}) {
          animation-delay: ${LEGEND_GROUP_DURATION_MS - LEGEND_CROSSFADE_DURATION_MS}ms;
        }
        /* A strong ease-in on the *group* (the shared box being resized)
           holds it close to whichever end of the size range is "small"
           for longer -- the start when expanding, the end when
           collapsing -- for roughly the same window as the crossfade
           above, then covers the rest of the size change quickly.
           Approximates the user's "quick circle-to-rounded-rect swap,
           then the container grows/shrinks" request within what a
           snapshot-based crossfade can actually do (there's no live
           border-radius to keyframe mid-scale; both snapshots are
           already-rasterized images). */
        ::view-transition-group(${LEGEND_TRANSITION_NAME}) {
          animation-duration: ${LEGEND_GROUP_DURATION_MS}ms;
          animation-timing-function: cubic-bezier(0.55, 0, 0.15, 1);
        }
        @media (prefers-reduced-motion: reduce) {
          ::view-transition-group(${LEGEND_TRANSITION_NAME}),
          ::view-transition-old(${LEGEND_TRANSITION_NAME}),
          ::view-transition-new(${LEGEND_TRANSITION_NAME}) {
            animation: none !important;
          }
        }
      `}</style>
      {!isExpanded ? (
        <button
          type="button"
          aria-label="Show map legend"
          onClick={() => setExpanded(true)}
          className="absolute top-0 left-0 flex size-8 cursor-pointer items-center justify-center rounded-full border-[length:var(--component-tag-border-width)] border-[color:var(--semantic-control-color-border-color)] bg-[var(--semantic-surface-base-default)]"
          style={{ viewTransitionName: LEGEND_TRANSITION_NAME }}
        >
          <LoginKey aria-hidden="true" className="size-4" />
        </button>
      ) : (
        <div
          className="absolute top-0 left-0 flex w-[232px] flex-col items-center gap-[var(--density-spacing-fixed-small)] rounded-[24px] border-[length:var(--component-tag-border-width)] border-[color:var(--semantic-control-color-border-color)] bg-[var(--semantic-surface-base-default)] p-[var(--density-spacing-fixed-small)]"
          style={{ viewTransitionName: LEGEND_TRANSITION_NAME }}
        >
          <button
            type="button"
            aria-label="Hide map legend"
            onClick={() => setExpanded(false)}
            className="flex size-[18px] shrink-0 cursor-pointer items-center justify-center self-start rounded-full"
          >
            <CaretUp aria-hidden="true" className="size-4" />
          </button>
          {STATUSES.map((status) => (
            <LegendRow key={status} status={status} />
          ))}
        </div>
      )}
    </div>
  );
}
