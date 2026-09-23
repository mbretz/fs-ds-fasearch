import { EntityPortrait } from '../entity-info/EntityPortrait';
import { getFullName } from '../../utils/getFullName';
import type { Advisor } from '../../data/locations';
import { GoldUnderline } from './AdvisorHero';

export interface AdvisorHeroInertProps {
  advisor: Advisor;
}

/**
 * Matches Figma's `Hero-FA-Mobile` `View=Collapsed, State=Inert` variant
 * (`421:6558`) -- the header for the dedicated New Client Inquiry route
 * (`AdvisorInquiry.tsx`), per Figma's `FAProfilePage/Mobile/LoggedIn/
 * InquiryForm` frame (`1639:50445`), which stacks this exact component
 * directly above the Contact Form. Unlike `AdvisorHeroMobile`'s own
 * Expanded<->Collapsed scroll transition, Figma authors only ONE view
 * for this Inert state (no separate "Expanded, Inert" variant exists) --
 * it renders permanently in this one compact form, always pinned to the
 * viewport top via plain `position: sticky` rather than
 * `useStuckSentinel`'s IntersectionObserver-driven expand/collapse
 * (there's no second state to transition to/from here).
 *
 * No action buttons (the whole point of "Inert" -- the visitor already
 * knows why they're on this page) and no box-shadow (Figma's Actionable
 * sibling has one, `Elevation & Shadows/5 - Suspended`; this component
 * doesn't declare one at all). Square bottom corners, not Figma's own
 * rounded ones (`borderRadius: 0px 0px 8px 8px`) -- a deliberate
 * deviation, per the user, 2026-09-23.
 *
 * `py-[var(--density-spacing-fixed-med)]` (12px, symmetric) -- not
 * Figma's own literal `8px 16px 12px` (asymmetric), nor the Actionable
 * Collapsed sibling's `py-[8px]` (tried and reverted, per the user,
 * 2026-09-23 -- that specific value read as too tight, but a plain
 * `8px` wasn't ruled out on its own; a symmetric `16px` was tried and
 * tightened down from there instead). `items-end` bottom-aligns the
 * avatar and the name/underline column to the same line, so this one
 * padding value alone governs the space both above AND below the
 * avatar equally (top gap = `pt`; avatar is the row's tallest item, so
 * its own bottom sits flush `pb` above the container's bottom edge).
 */
export function AdvisorHeroInert({ advisor }: AdvisorHeroInertProps) {
  const fullName = getFullName(advisor);
  return (
    // `gap-[...xx-large]` (24px) -- Figma's own real value for this
    // node's "Hero" frame, not the `xxx-large` (32px) carried over from
    // the Actionable Collapsed sibling's own comment -- per the user,
    // 2026-09-23, reduced after review; 24px also happens to be what
    // Figma actually specifies here.
    <div className="sticky top-0 z-10 flex items-end gap-[var(--density-spacing-fixed-xx-large)] bg-[color:var(--color-response-neutral-strong)] px-[16px] py-[var(--density-spacing-fixed-med)]">
      <EntityPortrait
        name={fullName}
        photoUrl={advisor.photoUrl}
        size="lg"
        showBadge={false}
        // `box-border`, not `EntityPortrait`'s own default `box-content`
        // -- per the user, 2026-09-23, this instance's 80px `size="lg"`
        // should be the TOTAL rendered size inclusive of its own 4px
        // white border, not 80px of avatar plus a 4px border added on
        // top of it (88px total, `box-content`'s own default everywhere
        // else this component is used). Scoped to this one consumer via
        // `avatarClassName`, not a change to `EntityPortrait`'s own
        // shared default -- every other usage still wants the border
        // added outside, matching Figma's real `FA-Portrait` spec there.
        avatarClassName="box-border"
      />
      {/* `pb-[...large]` (16px) -- per the user, 2026-09-23: the
          underline should sit 16px above the portrait's own bottom
          edge, not flush with it. `items-end` bottom-aligns this
          column's own OUTER box to the avatar's bottom, so padding
          added inside that box (rather than a margin on the underline
          itself) pushes its visible content up from that shared
          baseline by exactly this amount. */}
      <div className="flex min-w-0 flex-1 flex-col gap-[var(--density-spacing-fixed-x-small)] pb-[var(--density-spacing-fixed-large)]">
        <h1 className="truncate text-[20px] leading-[24px] font-medium text-white">
          {fullName}
        </h1>
        <GoldUnderline className="h-[2px] w-[100px]" />
      </div>
    </div>
  );
}
