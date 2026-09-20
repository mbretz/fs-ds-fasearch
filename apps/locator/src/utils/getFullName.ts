// `Advisor.firstName`/`lastName` (split 2026-09-20, docs/PLAN.md §2.2) are
// two fields for matching purposes, but every display site still wants one
// string — this is the single place that joins them back together.
export function getFullName({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  return `${firstName} ${lastName}`;
}
