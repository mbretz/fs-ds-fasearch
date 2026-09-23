import { useParams } from 'react-router-dom';
import { findLocationById } from '../utils/findAdvisor';
import { LocationHero } from '../components/hero/LocationHero';
import { ProspectPortalLite } from '../components/ProspectPortalLite/ProspectPortalLite';
import { LocationProfileBody } from '../components/profile/LocationProfileBody';
import { OfficeDetailsPanel } from '../components/entity-info/OfficeDetailsPanel';
import { cn } from '../utils/cn';

// Same Hero-to-border gap-cancellation math as AdvisorProfile.tsx's own
// constant (see that file's own comment for the full derivation) -- the
// 2px brand-gold top border sits 48px below the Hero either way. Border-
// to-content padding diverges from it now, though: 24px here, not
// AdvisorProfile.tsx's own 48px, per the user -- LocationProfileBody's
// own "Financial Advisors at this branch" heading sits directly under
// this border, and the user's ask was 24px between the two specifically,
// not the 48px rhythm AdvisorProfileBody's own (subsection-less-adjacent)
// content used.
const profileBodySectionClassName =
  'mt-[calc(var(--density-layout-fixed-6x-large)_-_var(--density-layout-fixed-large))] border-t-[2px] border-t-[color:var(--semantic-brand-primary-gold)] pt-[var(--density-layout-fixed-xx-large)]';

// Same mobile-flow/desktop-grid split as AdvisorProfile.tsx -- see its own
// comment for why the two breakpoints need genuinely separate trees, and
// why the Hero needs explicit `md:col-start-1`/`md:row-start-1` (not just
// `col-span-2`). The rail here is the Location Information panel (Figma's
// `BranchInfo-1Column-wBranchTeamPhotos`), not yet built.
export function LocationProfile() {
  const { id } = useParams<{ id: string }>();
  const location = id ? findLocationById(id) : undefined;

  if (!location) {
    return (
      <p className="mx-[var(--density-layout-fixed-large)] mt-[var(--density-layout-fixed-large)] md:mx-0">
        Location not found.
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-y-[var(--density-layout-fixed-large)] [overflow-anchor:none] md:hidden">
        {/* mb cancels TWO gap-y-large increments, not one -- see
            AdvisorProfile.tsx's own comment on this same pattern:
            LocationHero's Fragment has the same invisible sentinel div as
            its own first child. */}
        <ProspectPortalLite
          favoritesFromLabel={location.name}
          className="mt-[4px] mb-[calc(4px_-_(2*var(--density-layout-fixed-large)))]"
        />
        <LocationHero location={location} />
        <LocationProfileBody
          location={location}
          className={cn(
            'mx-[var(--density-layout-fixed-large)]',
            profileBodySectionClassName,
          )}
        />
        {/* No shadow here -- per the user, this mobile tree always stacks
            the rail below the body content (it never overlaps the Hero
            the way the desktop tree's own `@[940px]/location-hero:`
            treatment below can), so `shadow-elevation-raised` is reserved
            for that overlapping state only. `officePhotoUrl` deliberately
            NOT passed -- per the user, LocationHero above already shows
            this same branch photo, so repeating it here read as
            redundant (superseding data/locations.ts's own doc comment on
            that field, which reserved it for exactly this usage -- that
            reservation predates actually seeing the two side by side). */}
        <div className="mx-[var(--density-layout-fixed-large)]">
          <OfficeDetailsPanel
            address={location.address}
            hours={location.hours}
            phone={location.phone}
            fax={location.fax}
            supportStaff={location.supportStaff}
          />
        </div>
      </div>
      {/* `@container/location-hero` (named, `[container-type:inline-
          size]`) lives on THIS wrapper, one level above the actual
          grid -- same reasoning as AdvisorProfile.tsx's own wrapper
          (see its comment): a container query can't affect the element
          that establishes the container, confirmed live there.

          Below this container's own 940px width: single column
          (`grid-cols-1`), rail panel hidden from its overlapping
          position and moved to a third stacked row below the body
          placeholder instead (the mobile treatment, per the user --
          same as AdvisorProfile.tsx's own rail panel below its own
          threshold), and `--location-hero-portrait-size` is a flat
          240px (this banner's original fixed size) -- no rail, no
          space pressure, so the portrait resets to full size and the
          address/branch-list content below runs the Hero's own full
          width.

          At/above 940px: two columns (`grid-cols-[1fr_400px]`), rail
          panel back in its overlapping position, and the portrait
          property switches to a `clamp()`'d fluid value. Ceiling
          (240px) reached at container=1000px; floor (180px) at
          container=940px -- an 60px-wide window with the portrait
          absorbing 100% of the container's narrowing (a straight 1:1
          slope, `container - 760`). Unlike AdvisorProfile.tsx's own
          portrait+gutter combination, there's only ONE fluid value
          here (no gutter shrinking alongside it, see LocationHero.tsx's
          own comment for why), so a 1:1 slope can't create the same
          non-monotonic dip that combination produced there -- a single
          clamp()'d value against a fixed subtraction is always
          monotonic on its own. 180px floor keeps the 240:180 (1.33:1)
          ceiling:floor ratio well under `modern-web-guidance`'s
          `fluid-scaling` guide's 2.5x accessibility cap. There's no
          status-tag-style hard failure mode driving these exact numbers
          (unlike AdvisorProfile.tsx's own 216px tag-width target) --
          per the user, this is a proportionate port of the same
          structural approach, not a re-derivation against a concrete
          bug. */}
      <ProspectPortalLite
        favoritesFromLabel={location.name}
        className="hidden md:flex mb-[4px]"
      />
      <div className="hidden md:block @container/location-hero">
        {/* `gap-x-[var(--density-layout-fixed-4x-large)]` (40px, not the
            24px this used before) -- per the user, matches the 40px
            gutter LocationHero.tsx's own text column already reserves via
            its `pr-[440px]` override (400px rail column + 40px
            clearance), which LocationProfileBody's own `@[940px]/
            location-hero:mr-0` relies on this SAME gap-x for its own
            equivalent clearance from the rail -- at the old 24px value
            those two didn't actually match (Hero reserved 440px total,
            body only needed 424px, an invisible 16px of slack nothing
            filled). No separate panel-width shrink needed to make this
            fit: the rail's own 400px column and OfficeDetailsPanel's own
            360px visible width (400px column minus this wrapper's own
            `pr-[40px]`, see its comment below) are both unchanged by this
            -- confirmed live (Playwright), nothing overflows. */}
        <div
          className={cn(
            'md:grid md:grid-cols-1 md:items-start md:gap-x-[var(--density-layout-fixed-4x-large)] md:gap-y-[var(--density-layout-fixed-large)]',
            '@[940px]/location-hero:grid-cols-[1fr_400px]',
            '[--location-hero-portrait-size:240px]',
            '@[940px]/location-hero:[--location-hero-portrait-size:clamp(180px,calc(-760px+100cqi),240px)]',
          )}
        >
          <LocationHero
            location={location}
            // `@[940px]/location-hero:col-end-3` (not `col-span-2`) --
            // same shorthand-clobbering reasoning as AdvisorProfile.tsx's
            // own Hero (see its own comment): `col-span-2` sets the full
            // `grid-column` shorthand, which would reset the separately-
            // declared `md:col-start-1`'s own start line whenever it won
            // the cascade.
            className="md:col-start-1 md:row-start-1 @[940px]/location-hero:col-end-3"
          />
          {/* `md:ml-[40px]` matches LocationHeroDesktop's own fixed 40px
              left inset (see its comment on why it's flat, not a fluid
              gutter var like AdvisorHero's) -- so this section's left edge
              stays flush with the Hero's own portrait start regardless of
              the 940px threshold. `md:mr-[40px]` gives it a matching right
              inset below that threshold (no second grid column, so no
              gap-x contribution yet); `@[940px]/location-hero:mr-0` drops
              it once the grid's own `gap-x-[var(--density-layout-fixed-
              xx-large)]` (see this grid's own comment above) already
              stops this column short of the rail. */}
          <LocationProfileBody
            location={location}
            className={cn(
              'md:col-start-1 md:row-start-2 md:mr-[40px] md:ml-[40px] @[940px]/location-hero:mr-0',
              profileBodySectionClassName,
            )}
          />
          {/* `relative` -- see AdvisorProfile.tsx's own comment on why
              this card is otherwise hidden behind the Hero's positioned
              banner.
              Base `md:col-start-1 md:row-start-3` stacks this below the
              body placeholder (the mobile treatment, per the user) below
              the grid's own 940px threshold; `@[940px]/location-hero:`
              overrides restore the overlapping treatment above it --
              `row-end-3` not `row-span-2`, same shorthand-clobbering
              reasoning as the Hero's own `col-end-3` above.
              `md:ml-[40px] md:mr-[40px]` matches LocationProfileBody's
              own insets exactly (see its comment above) -- per the user,
              once this rail has dropped to the "simple stacking order"
              below 940px, it should share the same width/inset as the
              main profile content, not run flush to the grid's own
              edges the way it previously did there. `@[940px]/location-
              hero:ml-0 mr-0` drop both once the rail moves back to its
              own column-2 position, where they'd otherwise double up
              with (`ml`) or fight (`mr`) the grid's own `gap-x`/this
              wrapper's own `pr-[40px]` reveal-strip -- LocationProfileBody
              never needs an `ml-0` counterpart since it stays in column 1
              at every width, unlike this rail panel. */}
          <div className="relative md:col-start-1 md:row-start-3 md:mr-[40px] md:ml-[40px] @[940px]/location-hero:col-start-2 @[940px]/location-hero:row-start-1 @[940px]/location-hero:row-end-3 @[940px]/location-hero:mt-[36px] @[940px]/location-hero:mr-0 @[940px]/location-hero:ml-0 @[940px]/location-hero:pr-[40px]">
            {/* `@[940px]/location-hero:shadow-elevation-raised` -- the DS
                "Raised" elevation tier (packages/ds/src/theme.css's own
                `shadow-elevation-raised` utility, built from the real
                `semantic.elevation.raised.*` tokens -- confirmed an exact
                match to this same panel's previous hand-typed placeholder
                rgba shadow, which was already this tier's values without
                referencing the tokens). Per the user, only applies once
                this rail is actually overlapping the Hero (this same
                940px threshold, see this wrapper's own comment) -- below
                it, the panel stacks in normal flow below the body content
                instead, and a shadow there would read as a floating card
                over nothing rather than an overlay. */}
            {/* `officePhotoUrl` deliberately NOT passed -- see
                data/locations.ts's own doc comment on this field
                (LocationHero above already shows this same branch photo,
                so repeating it here read as redundant). */}
            <OfficeDetailsPanel
              address={location.address}
              hours={location.hours}
              phone={location.phone}
              fax={location.fax}
              supportStaff={location.supportStaff}
              className="@[940px]/location-hero:shadow-elevation-raised"
            />
          </div>
        </div>
      </div>
    </>
  );
}
