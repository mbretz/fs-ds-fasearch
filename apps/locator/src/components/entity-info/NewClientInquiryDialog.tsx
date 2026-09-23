import { useState, type ReactNode } from 'react';
import { Dialog } from 'ds';
import type { Advisor } from '../../data/locations';
import { AdvisorHeroInert } from '../hero/AdvisorHeroInert';
import { NewClientInquiryForm } from './NewClientInquiryForm';
import { getFullName } from '../../utils/getFullName';

export interface NewClientInquiryDialogProps {
  advisor: Advisor;
  /**
   * Render-prop child, not a plain `trigger` element -- every self-
   * triggering caller (AdvisorCard's `EntityActions`) only ever hands
   * this component a plain `onClick`-style callback prop from an
   * unrelated component, not a single element to wrap `Dialog.Trigger
   * asChild` around (Radix's `Trigger` needs to BE the clicked element
   * itself, and `EntityActions` renders its own primary+secondary
   * buttons together as one block, so there's no single child here to
   * attach it to). A controlled `Dialog.Root` (`open`/`onOpenChange`)
   * sidesteps that: this component owns the open state by default and
   * hands callers a stable `openDialog` callback to wire up as whatever
   * trigger they render -- the same shape a map pin popover's own
   * button, or AdvisorHero's desktop Actions row, will want later (see
   * docs/PLAN.md item 5). Optional: omitted entirely when the caller
   * passes `open`/`onOpenChange` instead (see below) and triggers this
   * dialog from outside.
   */
  children?: (openDialog: () => void) => ReactNode;
  /**
   * External control, for a caller that needs to open THIS dialog only
   * after closing one of its own -- `FavoritesComparatorDialog`'s own
   * desktop-in-dialog "New Client Inquiry" button can't use the default
   * self-triggering mode above, since that would open this Dialog while
   * the comparator's own Dialog is still open (a real nested-modal bug:
   * duplicate scrims/focus traps). When set, `children` is typically
   * omitted (there's no in-place trigger to render) and this component's
   * own internal open state is bypassed entirely in favor of the
   * caller's.
   */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Desktop's New Client Inquiry Dialog host -- docs/PLAN.md item 5's last
 * remaining piece (the mobile dedicated route, `AdvisorInquiry.tsx`,
 * already covers narrow viewports). Reuses that same page's exact
 * Hero+Form composition: a sticky `AdvisorHeroInert` banner with
 * `NewClientInquiryForm` underneath, matching Figma's `Inquiry Modal`
 * component (`1085:30363`, file `MKVCdKNgYabktw3AmaxTak`).
 *
 * Figma specs that frame at 864px wide -- comfortably past the form's
 * own 700px Inline/landscape container-query threshold (PR #91's own
 * doc comment), unlike the Dialog's default 480px `max-w`, so this
 * overrides it explicitly. This is the first host wide enough to
 * actually reach that landscape layout live.
 */
export function NewClientInquiryDialog({
  advisor,
  children,
  open: openProp,
  onOpenChange: onOpenChangeProp,
}: NewClientInquiryDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;
  const setOpen = isControlled
    ? (onOpenChangeProp ?? (() => {}))
    : setInternalOpen;
  const fullName = getFullName(advisor);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {children?.(() => setOpen(true))}
      <Dialog.Content
        // Figma's frame has no separate title row of its own -- the Hero
        // below already shows the advisor's name, and the form itself
        // renders its own "New Client Inquiry" heading (matching
        // `AdvisorInquiry.tsx`'s identical composition) -- but Radix
        // still requires an accessible Dialog.Title for its
        // `aria-labelledby`, so this stays real for screen readers via
        // `visuallyHideTitle` rather than an empty/decorative string.
        title={`New Client Inquiry — ${fullName}`}
        visuallyHideTitle
        // Figma's designed width (864px). No manual viewport clamp needed
        // -- Content's own `w-[calc(100%-2*padding)]` already keeps it
        // inset from every viewport edge, so it naturally shrinks to fit
        // a narrower desktop viewport on its own.
        className="max-w-[864px]"
        // Per the user, 2026-09-23: compact form controls read better
        // inside this Dialog than the roomy default. `NewClientInquiryForm`'s
        // own TextInput/ChecklistGroup/Button/Checkbox instances don't set
        // an explicit `density` prop of their own, so they inherit this
        // via the normal CSS cascade off Content's `data-density`
        // attribute -- no changes needed in the form itself.
        density="condensed"
        // Default tertiary CloseButton is a white pill with a blue icon,
        // tuned for Content's own white background -- invisible/low-
        // contrast against the dark Hero it overlays here. White icon
        // (via `currentColor`) + transparent/translucent-hover treatment
        // instead, matching this same Hero's own established "hardcoded
        // text-white" convention for on-dark content (AdvisorHeroInert's
        // `<h1>`) rather than inventing a token -- no on-dark token tier
        // exists anywhere in the DS token set (confirmed via search).
        // `relative z-50` -- confirmed live, required: without it the
        // button was still positioned/clickable in the right place
        // (verified via getBoundingClientRect) but never actually
        // painted on top of the Hero underneath it, which sits earlier
        // in Dialog.Content's DOM (both are `position: static`, and
        // `z-index` has no effect without an explicit `position`).
        closeButtonClassName="relative z-50 bg-transparent text-white hover:bg-white/10 hover:text-white focus-visible:shadow-[inset_0_0_0_var(--semantic-control-border-width-active)_white]"
      >
        {/* Cancels Dialog.Content's own padding on this one child only,
            so the Hero spans full-bleed edge to edge under the close
            button, matching Figma -- token-driven (the same padding
            vars Dialog.Content itself applies), not a hardcoded px
            value, so it stays correct across density. Top corners
            rounded to match Dialog.Content's own radius; bottom corners
            are already square (AdvisorHeroInert's own deliberate
            deviation, per its doc comment). */}
        <div className="-mx-[var(--component-dialog-spacing-padding)] -mt-[var(--component-dialog-spacing-padding-top)] overflow-hidden rounded-t-[var(--component-dialog-border-radius)]">
          <AdvisorHeroInert advisor={advisor} />
        </div>
        {/* `bordered={false}` -- Dialog.Content already draws its own
            border/rounded edge around this same content, so the form's
            own default card border would just double up as a redundant
            inset frame. `submitButtonDensity="roomy"` -- per the user,
            2026-09-23: the condensed density set above reads well for
            the form's fields, but the primary submit action should stay
            at its larger, roomy size regardless. */}
        <NewClientInquiryForm
          advisor={advisor}
          bordered={false}
          submitButtonDensity="roomy"
        />
      </Dialog.Content>
    </Dialog.Root>
  );
}
