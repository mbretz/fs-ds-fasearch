// Shared by EntityPortrait and any bare `ds` Avatar usage (e.g.
// AdvisorsAtLocationPanel, OfficeDetailsPanel's support-staff rows) that
// needs the same initials fallback without EntityPortrait's badge layer.
export function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');
}
