const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// No real hire-date field exists on `Advisor` -- per the user, the start
// month for the "Experience & Background" section's "{Month} {Year} -
// Present" line is picked deterministically from `advisor.id` rather than
// added as a new hardcoded data field, so it stays stable across renders/
// sessions without a 35th hand-authored value. A plain char-code sum
// keeps the derivation obvious (no crypto-grade hash needed for a
// prototype-only cosmetic value).
function hashToMonthIndex(id: string): number {
  let sum = 0;
  for (let i = 0; i < id.length; i += 1) {
    sum += id.charCodeAt(i);
  }
  return sum % 12;
}

export function getTenureStartLabel({
  id,
  tenureYears,
}: {
  id: string;
  tenureYears: number;
}): string {
  const month = MONTH_NAMES[hashToMonthIndex(id)];
  const year = new Date().getFullYear() - tenureYears;
  return `${month} ${year} - Present`;
}
