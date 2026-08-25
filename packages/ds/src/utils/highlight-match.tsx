import type { ReactNode } from 'react';

const highlightClassName =
  'font-[number:var(--semantic-content-heavy-font-weight)]';

/**
 * Highlights case-insensitive occurrence(s) of `query` inside `text` with
 * a heavier font weight, leaving the rest at its surrounding weight — for
 * rendering a filtered option's matched substring (e.g.
 * `SearchInput.Option`'s children).
 *
 * `occurrence` defaults to `'first'`, not `'all'`. A query like "a"
 * against "Banana" bolding all three a's reads as visual noise rather
 * than a clear answer to "why did this match" — matches the convention
 * most substring-match autocompletes use (GitHub/npm/MDN search) for a
 * plain `.includes()`-style match. `'all'` is still offered for callers
 * with a different matching strategy where it fits better — e.g. a
 * fuzzy/non-contiguous matcher (a command palette) wanting to show every
 * matched character, not just where the match starts.
 *
 * Always wrapped in a single outer `<span>`, not a bare Fragment: a caller
 * embedding this directly as a flex container's children (e.g.
 * `SearchInput.Option`, `flex ... gap-[...]`) would otherwise have the
 * leading text/bold span/trailing text land as three separate flex items,
 * each getting that container's `gap` inserted between them — visible as
 * unwanted space around the bolded run.
 */
export function highlightMatch(
  text: string,
  query: string,
  options?: { occurrence?: 'first' | 'all' },
): ReactNode {
  if (!query) return text;

  const { occurrence = 'first' } = options ?? {};
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  if (occurrence === 'first') {
    const index = lowerText.indexOf(lowerQuery);
    if (index === -1) return text;

    return (
      <span>
        {text.slice(0, index)}
        <span className={highlightClassName}>
          {text.slice(index, index + query.length)}
        </span>
        {text.slice(index + query.length)}
      </span>
    );
  }

  const segments: ReactNode[] = [];
  let cursor = 0;
  let matchIndex = lowerText.indexOf(lowerQuery, cursor);
  if (matchIndex === -1) return text;

  let key = 0;
  while (matchIndex !== -1) {
    if (matchIndex > cursor) segments.push(text.slice(cursor, matchIndex));
    segments.push(
      <span key={key++} className={highlightClassName}>
        {text.slice(matchIndex, matchIndex + query.length)}
      </span>,
    );
    cursor = matchIndex + query.length;
    matchIndex = lowerText.indexOf(lowerQuery, cursor);
  }
  if (cursor < text.length) segments.push(text.slice(cursor));

  return <span>{segments}</span>;
}
