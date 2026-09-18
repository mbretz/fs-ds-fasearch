import type { Advisor } from '../../../data/locations';
import { EntityPortrait } from '../../entity-info/EntityPortrait';
import { cn } from '../../../utils/cn';

export interface AdvisorsAtLocationPanelProps {
  advisors: Pick<Advisor, 'id' | 'name' | 'photoUrl'>[];
  className?: string;
}

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
  className,
}: AdvisorsAtLocationPanelProps) {
  if (advisors.length === 0) return null;

  return (
    <div
      className={cn(
        'flex h-full flex-col gap-[var(--density-spacing-fixed-large)] rounded-[var(--semantic-surface-border-radius)] bg-[var(--color-surface-background-color-neutral-1)] p-[var(--density-spacing-fixed-large)]',
        className,
      )}
    >
      <span className="text-[length:var(--semantic-content-heavy-font-size)] leading-[length:var(--semantic-content-heavy-line-height)] font-[number:var(--semantic-content-heavy-font-weight)] text-[color:var(--semantic-content-common-text-color-default)]">
        Branch Advisors
      </span>
      {advisors.map((advisor) => (
        <div
          key={advisor.id}
          className="flex items-center gap-[var(--density-spacing-fixed-med)]"
        >
          <EntityPortrait
            name={advisor.name}
            photoUrl={advisor.photoUrl}
            size="sm"
          />
          <span className="text-[length:var(--semantic-content-common-font-size)] leading-[length:var(--semantic-content-common-line-height)] font-[number:var(--semantic-content-common-font-weight)] text-[color:var(--semantic-content-common-text-color-default)]">
            {advisor.name}
          </span>
        </div>
      ))}
    </div>
  );
}
