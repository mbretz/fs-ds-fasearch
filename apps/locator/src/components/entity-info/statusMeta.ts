import type { ComponentType, SVGProps } from 'react';
import { MessageEnvelope, DateClock, Share } from 'icons';
import type { NewClientStatus } from '../../data/locations';

/**
 * One mapping shared by `StatusTag` (the colored pill) and `EntityPortrait`
 * (the avatar corner badge) so the three `NewClientStatus` states stay in
 * sync across both renderings instead of two separate switch statements.
 *
 * Colors are real semantic tokens, not hand-picked hex, confirmed against
 * `packages/tokens/build/css/tokens.css`: Figma's three Status Tag/Badge
 * border colors (`#247E58`/`#D13805`/`#006DA3`) are exact matches for
 * `color.response.success`/`color.response.warning`/`color.intent.primary`
 * respectively — `referralOnly` lands on `intent.primary` rather than a
 * `response.*` token since "by referral" isn't a warning/error/success
 * state, just Edward Jones' brand primary blue.
 *
 * Badge icons (`icon`) are placeholders: packages/icons has no literal
 * invitation/stopwatch/referral glyphs matching Figma's Badge component set
 * (`202:3542`) yet, so this reuses the closest existing generic icons —
 * same placeholder approach as the LinkedIn/Facebook icon decision.
 */
export interface StatusMeta {
  label: string;
  borderColorVar: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const statusMeta: Record<NewClientStatus, StatusMeta> = {
  accepting: {
    label: 'Accepting New Clients',
    borderColorVar: 'var(--color-response-success-base)',
    icon: MessageEnvelope,
  },
  waitlist: {
    label: 'New Client Waitlist',
    borderColorVar: 'var(--color-response-warning-base)',
    icon: DateClock,
  },
  referralOnly: {
    label: 'New Clients by Referral',
    borderColorVar: 'var(--color-intent-primary-base)',
    icon: Share,
  },
};
