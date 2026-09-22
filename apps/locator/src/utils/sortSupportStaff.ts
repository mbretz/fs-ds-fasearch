import type { BranchSupportStaff } from '../data/locations';

// Last whitespace-separated token of `name` -- same simple convention
// `getInitials` already uses for splitting a full name string (this data
// model has no separate first/last fields for support staff, unlike
// `Advisor`), so a hyphenated last name ("Osei-Bonsu") sorts as one token
// while a middle name would incorrectly count as the "last" name; no
// current fixture data hits that case.
function getLastName(name: string): string {
  const parts = name.trim().split(' ');
  return parts[parts.length - 1];
}

// Shared by `OfficeDetailsPanel` and `AdvisorsAtLocationPanel`'s own
// "Branch Team" lists -- per the user, senior roles always sort ahead of
// non-senior ones, alphabetical by last name within each group. Returns a
// new array (doesn't mutate the caller's own `location.supportStaff`).
export function sortSupportStaff(
  staff: BranchSupportStaff[],
): BranchSupportStaff[] {
  return [...staff].sort((a, b) => {
    const aSenior = a.title.startsWith('Senior');
    const bSenior = b.title.startsWith('Senior');
    if (aSenior !== bSenior) return aSenior ? -1 : 1;
    return getLastName(a.name).localeCompare(getLastName(b.name));
  });
}
