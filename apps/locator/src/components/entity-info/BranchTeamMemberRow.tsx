import { Avatar } from 'ds';
import type { BranchSupportStaff } from '../../data/locations';
import { getInitials } from '../../utils/getInitials';

// `text-box: trim-both cap alphabetic` trims each line's own built-in
// leading (the invisible space browsers reserve above/below glyphs for
// line-height/font metrics) down to its visible cap-height/baseline --
// that leftover leading, not an explicit gap, was what kept the title
// looking farther from the name than intended. Limited availability (no
// Firefox support) but a pure visual enhancement per the
// `modern-web-guidance` skill's `precise-text-alignment` guide: it's
// safely ignored where unsupported, just falling back to today's spacing.
const nameClassName =
  'text-[length:var(--semantic-content-common-font-size)] leading-[length:var(--semantic-content-size-x-small-line-height)] font-[number:var(--semantic-content-heavy-font-weight)] text-[color:var(--semantic-content-common-text-color-default)] [text-box:trim-both_cap_alphabetic]';
const titleClassName =
  'col-start-2 text-[length:var(--semantic-content-microcopy-font-size)] leading-[length:var(--semantic-content-size-x-small-line-height)] font-[number:var(--semantic-content-microcopy-font-weight)] text-[color:var(--semantic-content-common-text-color-default)] [text-box:trim-both_cap_alphabetic]';

export interface BranchTeamMemberRowProps {
  staff: BranchSupportStaff;
}

// Shared by `AdvisorsAtLocationPanel` and `OfficeDetailsPanel`'s own
// "Branch Team" lists -- previously duplicated identically in both.
//
// Grid, not flex+column: the avatar (column 1) and name (row 1, column 2)
// share a grid row, so `items-center` aligns them to each other within
// that row's own height (set by the taller avatar) rather than the whole
// two-line block's height, per the user. Title auto-flows to row 2,
// column 2 (`col-start-2`), indented under the name for free by the
// grid's own column track -- no manual offset needed.
export function BranchTeamMemberRow({ staff }: BranchTeamMemberRowProps) {
  return (
    <li className="grid grid-cols-[auto_1fr] items-center gap-x-[var(--density-spacing-fixed-med)]">
      <Avatar.Root size="xs">
        {staff.photoUrl && <Avatar.Image src={staff.photoUrl} alt="" />}
        <Avatar.Fallback>{getInitials(staff.name)}</Avatar.Fallback>
      </Avatar.Root>
      <span className={nameClassName}>{staff.name}</span>
      <span className={titleClassName}>{staff.title}</span>
    </li>
  );
}
