import { useState, type FormEvent } from 'react';
import { Button, Checkbox, ChecklistGroup, Microcopy, TextInput } from 'ds';
import { MessageSend } from 'icons';
import type { Advisor } from '../../data/locations';
import { useSession } from '../../session/useSession';
import { cn } from '../../utils/cn';

export interface NewClientInquiryFormProps {
  advisor: Advisor;
  /** Forwarded to the outer wrapper -- lets a caller make this form a
   * real scroll-anchor target (e.g. AdvisorProfile.tsx's mobile tree,
   * for the "New Client Inquiry" button's own `#new-client-inquiry`
   * link on wider mobile/tablet widths). */
  id?: string;
  className?: string;
}

// Figma's Checklist Group tree nests the first 2 options (Retirement,
// Savings) inside a "Nested=True" sub-instance while the other 5 are flat
// siblings -- per the user, that's how the component happened to get
// assembled rather than an intentional visual grouping (no sub-heading or
// extra spacing distinguishes them), so this renders as one flat list.
const topicOptions = [
  'Retirement',
  'Savings',
  'Investing and the Market',
  'Legacy and Trust',
  'Overview of My Finances',
  'Assets Recently Received',
  'Help with Financial Strategy Following Major Life Event',
];

// `bg-[var(--semantic-surface-base-default)]` -- plain white, per the
// user. Border matches AdvisorCard's own (EntityCard.tsx's
// `entity-card-grid` root) exactly: `--primitives-ref-color-neutral-800`
// (#CBCCCD) -- per the user, this card's border should read the same as
// the advisor card's, not chase Figma's own literal fill for this
// specific component (#B1B3B4, which has no matching semantic/component
// token anywhere in the built token set -- confirmed via grep across the
// full built tokens.css).
const cardClassName =
  'flex flex-col gap-[var(--density-spacing-fixed-xx-large)] rounded-[var(--semantic-surface-border-radius)] border-[length:var(--semantic-surface-border-width)] border-[color:var(--primitives-ref-color-neutral-800)] bg-[var(--semantic-surface-base-default)] p-[var(--density-spacing-fixed-xx-large)]';

const headingClassName =
  'text-[length:var(--semantic-content-heading-font-size)] leading-[length:var(--semantic-content-heading-line-height)] font-[number:var(--semantic-content-heading-font-weight)] text-[color:var(--semantic-content-heading-color)]';
const paragraphClassName =
  'text-[length:var(--semantic-content-paragraph-font-size)] leading-[length:var(--semantic-content-paragraph-line-height)] font-[number:var(--semantic-content-paragraph-font-weight)] text-[color:var(--semantic-content-paragraph-color)]';

/**
 * Matches Figma's `Contact Form` component (1083:25156) -- the "New
 * Client Inquiry" form shown in an accepting/waitlist advisor's profile
 * rail. Figma authors this as 4 fixed-width frames (Block/Inline x
 * LoggedIn true/false, 400px/776px) rather than one fluid component, so
 * the portrait<->landscape switch below is this repo's own container-
 * query interpretation of those two fixed frames, per the user (2026-09-
 * 23) -- not a literal Figma breakpoint. The 700px threshold sits
 * between the two frame widths with a little buffer; it won't actually
 * fire inside this component's current 400px-column rail host
 * (AdvisorProfile.tsx's `grid-cols-[1fr_400px]`), only once a wider host
 * (the planned desktop Dialog, or a dedicated mobile route) renders it,
 * per the user's explicit call on scope for this pass.
 */
export function NewClientInquiryForm({
  advisor,
  id,
  className,
}: NewClientInquiryFormProps) {
  const { signedIn } = useSession();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  // Both pre-checked in Figma's own mock -- the quiz-results checkbox
  // only for signed-in prospects (the one field-level difference between
  // the LoggedIn=True/False variants), the certification checkbox always.
  const [includeQuizResults, setIncludeQuizResults] = useState(true);
  const [consent, setConsent] = useState(false);

  function toggleTopic(topic: string, checked: boolean) {
    setTopics((current) =>
      checked ? [...current, topic] : current.filter((t) => t !== topic),
    );
  }

  // No backend to actually submit to -- this whole app is a non-
  // functional prototype (per CLAUDE.md), same "not really wired up"
  // convention OfficeDetailsPanel's own address/phone links use.
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
  }

  // Same inert-but-looks-enabled treatment as every other not-really-
  // wired-up action in this app (EntityActions.tsx's `primaryInert`,
  // OfficeDetailsPanel/ContactLinks/SocialLinks, etc), applied "for now"
  // per the user, 2026-09-23 -- `aria-disabled`/`tabIndex={-1}` keep it
  // out of the tab order and announce it as disabled to AT without the
  // grayed-out look Button's own real `disabled` prop would apply.
  // `!cursor-not-allowed` (not a plain `cursor-not-allowed`) -- confirmed
  // by EntityActions.tsx's own identical note: Button's base classes
  // always include `cursor-pointer`, which wins the cascade over a plain
  // override regardless of class-list order, so the `!` important
  // modifier is needed to actually win.
  function preventDisabledClick(event: { preventDefault: () => void }) {
    event.preventDefault();
  }

  return (
    <div id={id} className={cn('@container/inquiry-form', className)}>
      {/* Named container (`inquiry-form`, distinct from `office-details`/
          `entity-card`/`advisor-hero` elsewhere in this app) declared on
          this wrapper, one level above the actual <form> -- same split
          OfficeDetailsPanel/AdvisorProfile.tsx already use, since a CSS
          container query can't affect the very element that establishes
          the container. `.inquiry-form-fields` switches from a single
          stacked column to Figma's Inline layout (a 353px fixed text-
          input column beside a fill checklist column, 40px gap) once
          this wrapper is wide enough; `.inquiry-form-submit-row` moves
          the submit button from its portrait start-alignment to Figma's
          Inline `justify-content: flex-end`. */}
      <style>{`
        .inquiry-form-submit-button {
          width: 100%;
        }
        @container inquiry-form (min-width: 700px) {
          .inquiry-form-fields {
            display: grid;
            grid-template-columns: 353px 1fr;
            column-gap: var(--density-spacing-fixed-xx-large);
          }
          .inquiry-form-submit-row {
            justify-content: flex-end;
          }
          .inquiry-form-submit-button {
            width: auto;
          }
        }
      `}</style>
      <form onSubmit={handleSubmit} className={cardClassName}>
        <div className="flex flex-col gap-[var(--density-spacing-fixed-small)]">
          <h3 className={headingClassName}>New Client Inquiry</h3>
          <p className={paragraphClassName}>
            If you&rsquo;d like to discuss working together, submit your contact
            info below and I&rsquo;ll reach out to set up a complimentary
            consultation.
          </p>
          <Microcopy>*Required</Microcopy>
        </div>

        <div className="inquiry-form-fields flex flex-col gap-[var(--density-spacing-fixed-xx-large)]">
          <div className="flex flex-col gap-[var(--density-spacing-fixed-large)]">
            <TextInput.Root>
              <TextInput.Label requirement="required">
                Full name
              </TextInput.Label>
              <TextInput.Field
                placeholder="Tina Finn"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
              />
            </TextInput.Root>
            <TextInput.Root>
              <TextInput.Label requirement="required">Email</TextInput.Label>
              <TextInput.Field
                type="email"
                placeholder="tina.finn@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </TextInput.Root>
            <TextInput.Root>
              <TextInput.Label requirement="optional">
                Phone number
              </TextInput.Label>
              <TextInput.Field
                type="tel"
                placeholder="(123) 456 - 7890"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </TextInput.Root>
          </div>

          <ChecklistGroup.Root>
            <ChecklistGroup.Label>
              What topic(s) are you interested in discussing?
            </ChecklistGroup.Label>
            <ChecklistGroup.Group>
              {topicOptions.map((topic) => (
                <ChecklistGroup.Item
                  key={topic}
                  checked={topics.includes(topic)}
                  onCheckedChange={(checked) =>
                    toggleTopic(topic, checked === true)
                  }
                >
                  {topic}
                </ChecklistGroup.Item>
              ))}
            </ChecklistGroup.Group>
          </ChecklistGroup.Root>
        </div>

        {/* `items-start` -- without it, this flex-col's default `stretch`
            cross-axis alignment stretches each Checkbox's own `<label>`
            (an `inline-flex` with no explicit width of its own) to the
            form's full width; Checkbox's own `justify-center` then
            visibly centers the box+text group within that stretched
            width instead of hugging the left edge. Confirmed live,
            apps/locator's landscape (Inline) layout, 2026-09-23 -- not
            noticeable in portrait, where the form's own narrow width
            already roughly matched each row's natural content width.
            Same fix InProgress.tsx's own standalone Checkbox usage
            applies per-item via `self-start`; `items-start` here does it
            once for both rows in this column instead. */}
        <div className="flex flex-col items-start gap-[var(--density-spacing-fixed-large)]">
          {signedIn && (
            <Checkbox
              checked={includeQuizResults}
              onCheckedChange={(checked) =>
                setIncludeQuizResults(checked === true)
              }
            >
              Include Starting Point Quiz Results
            </Checkbox>
          )}
          <Checkbox
            checked={consent}
            onCheckedChange={(checked) => setConsent(checked === true)}
          >
            I certify I am the person identified above and give Edward Jones
            permission to contact me by email or phone (usually within 1-2
            business days).
          </Checkbox>
        </div>

        <div className="inquiry-form-submit-row flex">
          <Button
            type="submit"
            variant="primary"
            iconEnd={<MessageSend aria-hidden />}
            aria-disabled="true"
            tabIndex={-1}
            onClick={preventDisabledClick}
            className="inquiry-form-submit-button !cursor-not-allowed"
          >
            Send to {advisor.firstName}
          </Button>
        </div>
      </form>
    </div>
  );
}
