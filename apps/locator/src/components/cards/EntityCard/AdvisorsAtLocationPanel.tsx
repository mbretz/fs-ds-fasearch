import { Avatar } from 'ds';
import type { Advisor, BranchSupportStaff } from '../../../data/locations';
import { cn } from '../../../utils/cn';
import { getInitials } from '../../../utils/getInitials';
import { getFullName } from '../../../utils/getFullName';
import { BranchTeamMemberRow } from '../../entity-info/BranchTeamMemberRow';

export interface AdvisorsAtLocationPanelProps {
  advisors: Pick<Advisor, 'id' | 'firstName' | 'lastName' | 'photoUrl'>[];
  /**
   * Renders a "Branch Team" heading + entries underneath the advisors,
   * per the user -- `OfficeDetailsPanel` still supports rendering this
   * same content itself (e.g. AdvisorCard's own Office Details panel),
   * this is just LocationCard's own placement choice.
   */
  supportStaff?: BranchSupportStaff[];
  className?: string;
}

const headingClassName =
  'uppercase text-[length:var(--semantic-content-nanoheading-font-size)] leading-[length:var(--semantic-content-nanoheading-line-height)] font-[number:var(--semantic-content-nanoheading-font-weight)] text-[color:var(--semantic-content-common-text-color-default)]';
const bodyClassName =
  'text-[length:var(--semantic-content-common-font-size)] leading-[length:var(--semantic-content-size-x-small-line-height)] font-[number:var(--semantic-content-heavy-font-weight)] text-[color:var(--semantic-content-common-text-color-default)]';

// Matches `Branch-Card-Advisors-Panel` (`892:22192`), location-card only:
// a "Branch Advisors" heading + one avatar+name row per advisor -- name
// only, no title, unlike `OfficeDetailsPanel`'s support-staff rows
// (Figma's own `BranchTeamEntry` instances here use `Show Title: false`).
// Figma models a fixed number of toggleable slots ("Show Advisor 3"..."6"
// beyond two always-shown); this maps over `location.advisors` directly
// instead. Renders nothing when there's nothing to show, rather than an
// empty panel shell, so `EntityCard` never reserves a column for it.
export function AdvisorsAtLocationPanel({
  advisors,
  supportStaff = [],
  className,
}: AdvisorsAtLocationPanelProps) {
  if (advisors.length === 0 && supportStaff.length === 0) return null;

  return (
    <div
      className={cn(
        'flex h-full flex-col gap-[var(--density-spacing-fixed-xx-large)] rounded-[var(--semantic-surface-border-radius)] bg-[var(--color-surface-background-color-neutral-1)] p-[var(--density-spacing-fixed-large)]',
        className,
      )}
    >
      {advisors.length > 0 && (
        // Heading-to-list gap is half the item-to-item gap (`fixed-small`,
        // 8px, is exactly half of `fixed-large`, 16px, in both density
        // modes), per the user -- nested so that halving doesn't also
        // compress the rows' own spacing.
        <div className="flex flex-col gap-[var(--density-spacing-fixed-small)]">
          <span className={headingClassName}>Branch Advisors</span>
          <ul className="flex flex-col gap-[var(--density-spacing-fixed-large)]">
            {advisors.map((advisor) => {
              const fullName = getFullName(advisor);
              return (
                <li
                  key={advisor.id}
                  className="flex items-center gap-[var(--density-spacing-fixed-med)]"
                >
                  <Avatar.Root size="xs">
                    {advisor.photoUrl && (
                      <Avatar.Image src={advisor.photoUrl} alt="" />
                    )}
                    <Avatar.Fallback>{getInitials(fullName)}</Avatar.Fallback>
                  </Avatar.Root>
                  <span className={bodyClassName}>{fullName}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Rows are `BranchTeamMemberRow` -- shared with `OfficeDetailsPanel`'s
          own "Branch Team" block, which still renders it independently for
          contexts that want it there (e.g. AdvisorCard's Office Details
          panel). Suppressed once a location has 5+ advisors, per the user --
          large advisor rosters crowd the panel enough that Branch Team drops
          rather than compressing further. */}
      {advisors.length < 5 && supportStaff.length > 0 && (
        <div className="flex flex-col gap-[var(--density-spacing-fixed-small)]">
          <span className={headingClassName}>Branch Team</span>
          <ul className="flex flex-col gap-[var(--density-spacing-fixed-large)]">
            {supportStaff.map((staff) => (
              <BranchTeamMemberRow key={staff.id} staff={staff} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
