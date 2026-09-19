import type { ComponentType, SVGProps } from 'react';
import { DateClock } from 'icons';
import type { NewClientStatus } from '../../data/locations';
import IconInvitation from '../../assets/icons/IconInvitation';
import IconReferral from '../../assets/icons/IconReferral';

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
 * Badge icons (`icon`): `accepting`/`referralOnly` are locator-local
 * (`assets/icons/`) real Figma vectors for the Badge component set's own
 * "invitation"/"Referral" glyphs (`202:3542`) -- previously wrongly mapped
 * to `packages/icons`' `MessageEnvelope`/`Share`, neither of which matches
 * Figma's actual glyphs (an envelope+hand illustration, and a star with a
 * partial orbit/loop, respectively). `waitlist`'s `DateClock` is a real
 * `packages/icons` export and a close match for Figma's "stopwatch" glyph,
 * so it's unchanged.
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
    icon: IconInvitation,
  },
  waitlist: {
    label: 'New Client Waitlist',
    borderColorVar: 'var(--color-response-warning-base)',
    icon: DateClock,
  },
  referralOnly: {
    label: 'New Clients by Referral',
    borderColorVar: 'var(--color-intent-primary-base)',
    icon: IconReferral,
  },
};
