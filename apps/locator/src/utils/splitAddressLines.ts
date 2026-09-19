// Splits "<street incl. suite>, <city>, <state> <zip>" into its street
// line and its city/state/zip line -- the last two comma-separated
// segments are always "city" and "state zip", so everything before that
// (the street number/name and an optional "Suite ###" segment, if
// present) collapses back into one line together, per the user: the
// street/suite portion wraps as its own line, city/state/zip stays on a
// second line rather than ever running together with it. Shared by
// LocationCard (its own title) and OfficeDetailsPanel (its address link).
export function splitAddressLines(address: string) {
  const parts = address.split(',').map((part) => part.trim());
  if (parts.length < 2) return { street: address, cityStateZip: '' };
  const cityStateZip = parts.slice(-2).join(', ');
  const street = parts.slice(0, -2).join(', ');
  return { street, cityStateZip };
}
