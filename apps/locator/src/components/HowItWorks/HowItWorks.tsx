// Figma: "Locator/Desktop/Start" (node 665:8359, TEXT #668:8847 + FRAME
// "Steps" #668:8941) and "Locator/Mobile/Start" (node 1204:40661, FRAME
// "Heading wrap" #1204:40688 + FRAME "Steps" #1204:40690). Desktop puts the
// heading and steps side by side; mobile stacks the heading above the
// steps, at smaller step-marker/type sizes — both share the same 4-step
// copy. Neither Figma frame is wrapped in a shared two-column container
// (the desktop heading/steps are two independently-positioned siblings on
// the page canvas), so this component makes that its own real layout
// rather than reproducing Figma's absolute positioning.
//
// `md` (768px), not a container query, per the user's steer to prefer
// semantic tokens/this app's own conventions -- this section is a plain
// page-body child (`Landing.tsx` -> `<main>`, see SiteShell.tsx), same as
// ResultsList/FilterFacets/ProspectPortal, not a self-contained module
// mounted at variable widths (unlike AdvisorSearchModule, which is what
// actually needs container queries) -- a viewport breakpoint is the
// simpler, still-correct tool here per modern-web-guidance's own
// container-query-vs-media-query framing.
const STEPS = [
  {
    label: 'Step 1',
    body: 'Research and browse financial advisors using any of the search tools.',
  },
  {
    label: 'Step 2',
    body: "When you find a financial advisor you'd like to work with, share your contact information via their profile page. They'll reach out to set up a complimentary consultation.",
  },
  {
    label: 'Step 3',
    body: "Meet with financial advisors virtually or in person to decide if they're the right match for your needs. You'll discuss your goals, assess your investing style, and review account types and investments that you can consider.",
  },
  {
    label: 'Step 4',
    body: "When you've found a financial advisor to partner with, they will open your account and set up your online access.",
  },
];

export function HowItWorks() {
  return (
    // 80px gap from the bottom of AdvisorSearchModule above, on desktop
    // (`md:mt-*`) -- `primitives-ref-size-13` (80px), since neither the
    // density-fixed spacing scale (tops at 32px) nor `primitives.ref.
    // space.*` (tops at 64px) reaches it; `ref.size`/`ref.space` share the
    // same numeric scale at every step both define, so reaching into
    // `ref.size` here is the same fallback move Start.tsx already makes
    // into `primitives-ref-space-*` where density-fixed falls short.
    // Mobile keeps a smaller `spacing.fixed.xxx-large` (32px, matching this
    // section's own `mb-*` below for symmetry), per the user.
    //
    // 40px left/right on desktop (`md:mx-[space-09]`), per the user --
    // deliberately not `md:mx-0` (the ResultsList/FilterFacets/
    // ProspectPortal convention of deferring entirely to `<main>`'s own
    // ambient horizontal padding, see SiteShell.tsx) since 40px is this
    // component's own explicit inset, layered on top of whatever `<main>`
    // itself contributes at a given width.
    //
    // Mobile: `layout.fixed.xxx-large` (32px), not the plain `large` (16px)
    // ResultsList/FilterFacets/ProspectPortal use -- per the user, this
    // section should read as somewhat more inset than
    // InvestmentServices.tsx below it (which uses that same 16px), not
    // flush with it.
    <section
      className="
        mx-[var(--density-layout-fixed-xxx-large)]
        mt-[var(--density-spacing-fixed-xxx-large)]
        mb-[var(--density-spacing-fixed-xxx-large)]
        flex flex-col gap-[var(--density-spacing-fixed-xx-large)]
        md:mx-[var(--primitives-ref-space-09)] md:mt-[var(--primitives-ref-size-13)] md:flex-row md:items-start md:gap-[var(--primitives-ref-space-11)]
      "
    >
      {/* Mobile: Subheading (20/30/525). Desktop (md+): Heading Large
          (36/54/600) -- matches each Figma frame's own text style exactly.
          `md:max-w-[365px]` keeps the heading from stretching to match the
          steps column's own growing width once they share a row -- Figma's
          desktop heading is a narrow, "hug"-sized text block (371px),
          not full-bleed. */}
      <h2 className="text-[length:var(--semantic-content-subheading-font-size)] leading-[length:var(--semantic-content-subheading-line-height)] font-[number:var(--semantic-content-subheading-font-weight)] text-[color:var(--semantic-content-subheading-color)] md:max-w-[365px] md:shrink-0 md:text-[length:var(--semantic-content-heading-large-font-size)] md:leading-[length:var(--semantic-content-heading-large-line-height)] md:font-[number:var(--semantic-content-heading-large-font-weight)] md:text-[color:var(--semantic-content-heading-large-color)]">
        What is the process for partnering with a financial advisor?
      </h2>
      <ol className="flex flex-col md:flex-1">
        {STEPS.map((step, index) => {
          const isLast = index === STEPS.length - 1;
          return (
            <li
              key={step.label}
              className="flex gap-[var(--density-spacing-fixed-small)] md:gap-[var(--density-spacing-fixed-large)]"
            >
              {/* Marker column: a gold circle (24px mobile/32px desktop,
                  matching each Figma frame's own ellipse) plus a connector
                  line filling the rest of this column's own stretched
                  height down to the next circle -- `flex-1` on the
                  connector, not a fixed height, is what lets it track each
                  step's own variable body-copy length instead of a
                  hardcoded pixel value (see this file's own top comment).
                  Omitted after the last step, same as Figma's own LINE
                  node stopping at the final circle.

                  The trailing gap before the next step lives on the
                  content column's own `pb-*` below, not on this `<li>` --
                  padding on the `<li>` itself sits outside the flex row's
                  own content box, so this marker column's stretch height
                  (and therefore the connector's `flex-1` fill) would stop
                  short of it, leaving a visible gap of bare page between
                  the connector's end and the next circle. Padding the
                  content column instead makes it the row's tallest child,
                  so this marker column (default `align-items: stretch`)
                  grows to match it, and the connector runs all the way
                  down to the next circle's own top edge. */}
              <div
                aria-hidden
                className="flex w-[var(--density-sizing-fixed-xx-large)] shrink-0 flex-col items-center md:w-[var(--primitives-ref-size-08)]"
              >
                <span className="size-[var(--density-sizing-fixed-xx-large)] shrink-0 rounded-full bg-[var(--semantic-brand-primary-gold)] md:size-[var(--primitives-ref-size-08)]" />
                {!isLast && (
                  <span className="w-[3.5px] flex-1 bg-[var(--semantic-brand-primary-gold)]" />
                )}
              </div>
              <div
                className={
                  isLast
                    ? 'flex flex-col gap-[var(--density-spacing-fixed-small)]'
                    : 'flex flex-col gap-[var(--density-spacing-fixed-small)] pb-[var(--density-spacing-fixed-large)] md:pb-[var(--density-spacing-fixed-xxx-large)]'
                }
              >
                {/* Mobile: Heavy (16/24/600) -- no dedicated `heavy-color`
                    token exists (see Start.tsx's own H1, which pairs Heavy
                    typography with the shared `common` color group the
                    same way), so this falls back to
                    `semantic-content-common-text-color-default`. Desktop
                    (md+): Subheading (20/30/525). */}
                <p className="text-[length:var(--semantic-content-heavy-font-size)] leading-[length:var(--semantic-content-heavy-line-height)] font-[number:var(--semantic-content-heavy-font-weight)] text-[color:var(--semantic-content-common-text-color-default)] md:text-[length:var(--semantic-content-subheading-font-size)] md:leading-[length:var(--semantic-content-subheading-line-height)] md:font-[number:var(--semantic-content-subheading-font-weight)] md:text-[color:var(--semantic-content-subheading-color)]">
                  {step.label}
                </p>
                {/* Common (16/24/400) at every breakpoint. */}
                <p className="text-[length:var(--semantic-content-common-font-size)] leading-[length:var(--semantic-content-common-line-height)] font-[number:var(--semantic-content-common-font-weight)] text-[color:var(--semantic-content-common-text-color-default)]">
                  {step.body}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
