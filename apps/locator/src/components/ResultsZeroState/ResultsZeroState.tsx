import { Button } from 'ds';
import { NewWindow } from 'icons';

// Reproduces (not imports) `AdvisorSearchModule/Start.tsx`'s own
// `StartingPointPanel`/`MatchPanel` as a starting point for this page's
// own zero-results state, per the user, 2026-09-28 -- a deliberate copy,
// not a shared export, since the user expects to diverge this pair's own
// content/styling from Start.tsx's independently going forward. Start.tsx's
// own two panels stay exactly as they were (grid-area-embedded, no export).

// Same disabled-CTA convention as Start.tsx's own copy of these panels --
// see that file's own `preventDisabledClick` comment for the full
// reasoning (this module's every nav/CTA item is non-functional by
// design, docs/PLAN.md's Search Form Module note).
function preventDisabledClick(event: { preventDefault: () => void }) {
  event.preventDefault();
}

function MatchPanel() {
  return (
    // Light blue surface token (`color.surface.backgroundColor.blue`,
    // `#f0faff`), not Start.tsx's own dark `layout.backgroundColor.
    // neutral.level-2` -- per the user, 2026-09-28, to match this
    // panel's light-background context here.
    <div className="flex h-full flex-col justify-center gap-[var(--density-spacing-fixed-large)] rounded-[var(--semantic-border-radius-generous)] bg-[var(--color-surface-background-color-blue)] px-[var(--density-spacing-fixed-xx-large)] py-[var(--density-spacing-fixed-xx-large)]">
      <div className="flex flex-col gap-[var(--density-spacing-fixed-large)]">
        {/* Heavy (16/24/600). Text color: `common.text-color.default` --
            same reasoning as `StartingPointPanel`'s own comment above. */}
        <h3 className="text-balance text-[length:var(--semantic-content-heavy-font-size)] leading-[length:var(--semantic-content-heavy-line-height)] font-[number:var(--semantic-content-heavy-font-weight)] text-[var(--semantic-content-common-text-color-default)]">
          Having trouble finding the right financial advisor?
        </h3>
        {/* Microcopy (14/24/400). */}
        <p className="text-[length:var(--semantic-content-microcopy-font-size)] leading-[length:var(--semantic-content-microcopy-line-height)] font-[number:var(--semantic-content-microcopy-font-weight)] text-[var(--semantic-content-common-text-color-default)]">
          Take two minutes to help us understand your needs and goals and match
          with financial advisors personalized for you.
        </p>
      </div>
      <Button.Root
        asChild
        variant="primary"
        className="self-start cursor-not-allowed"
      >
        <a
          href="#"
          aria-disabled="true"
          tabIndex={-1}
          onClick={preventDisabledClick}
        >
          <Button.Label>Edward Jones Match</Button.Label>
          <Button.Icon>
            <NewWindow aria-hidden />
          </Button.Icon>
        </a>
      </Button.Root>
    </div>
  );
}

function StartingPointPanel() {
  return (
    <div className="rounded-[var(--semantic-border-radius-generous)] bg-[var(--color-layout-background-color-neutral-level-1)] p-[var(--density-spacing-fixed-xx-large)]">
      {/* Microcopy: size-small/line-height-medium/weight-regular (14/24/400).
          Text color: `common.text-color.default`, not Start.tsx's own
          `-reverse` (white) -- these panels' own light-gray backgrounds
          (`neutral.level-1/-2`) are only dark when scoped under
          `AdvisorSearchModule.tsx`'s own `data-theme="dark"`; on this
          page's normal light background they resolve to `#f2f2f2`/
          `#d8d9d9`, so reverse-white text would be near-illegible here
          (confirmed live) -- per the user, 2026-09-28. */}
      <p className="text-[length:var(--semantic-content-microcopy-font-size)] leading-[length:var(--semantic-content-microcopy-line-height)] font-[number:var(--semantic-content-microcopy-font-weight)] text-[var(--semantic-content-common-text-color-default)]">
        Get a better understanding of your different financial goals and how a
        financial advisor can work with you to meet them.{' '}
        <a
          href="#"
          aria-disabled="true"
          tabIndex={-1}
          onClick={preventDisabledClick}
          // Regular link color (`component.link.textColor.default`,
          // `#006da3`), not Start.tsx's own gold accent -- per the
          // user, 2026-09-28: that gold only reads correctly against
          // this panel's dark Start.tsx background, not its light one
          // here.
          className="cursor-not-allowed whitespace-nowrap text-[var(--component-link-text-color-default)] underline"
        >
          Take the Starting Point Quiz.
        </a>
      </p>
    </div>
  );
}

// Results.tsx's own zero-results state (no matching locations for the
// current search/filters) -- the same two promo panels Start.tsx shows
// beside its own search form, reproduced standalone here since they're
// no longer embedded in that component's own CSS grid, and (per the
// user) their own colors are now tuned for this page's normal light
// background instead of Start.tsx's `data-theme="dark"` context -- see
// each panel's own text-color comment above. Stacked on mobile, side by
// side at `md`+ -- simpler than Start.tsx's own three-tier container-
// query grid (built to interlock with the H1/hero image rows beside
// it), which doesn't apply here with no sibling content to coordinate
// against. Generous margin on every side, per the user --
// `layout.fixed.xxx-large` (32px) horizontal, `spacing.fixed.xxx-large`
// (32px) top/bottom, `spacing.fixed.xx-large` (24px) gap between the two
// panels.
export function ResultsZeroState() {
  return (
    <>
      <h2 className="text-[length:var(--semantic-content-heading-font-size)] leading-[length:var(--semantic-content-heading-line-height)] font-[number:var(--semantic-content-heading-font-weight)] text-[var(--semantic-content-common-text-color-default)] mx-[var(--density-layout-fixed-xxx-large)] my-[var(--density-spacing-fixed-xxx-large)]">
        No results found.
      </h2>
      <div className="mx-[var(--density-layout-fixed-xxx-large)] my-[var(--density-spacing-fixed-xxx-large)] flex flex-col gap-[var(--density-spacing-fixed-xx-large)] md:flex-row md:items-stretch">
        <div className="md:flex-1">
          <MatchPanel />
        </div>
        <div className="md:flex-1">
          <StartingPointPanel />
        </div>
      </div>
    </>
  );
}
