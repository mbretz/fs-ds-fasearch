// Deliberately no `ds`/`tokens`/`icons` imports — see SiteHeader's own
// comment. Matches all four provided Figma page references exactly: every
// page just shows a large "FOOTER" label on a dark background, nothing more.
export function SiteFooter() {
  return (
    <footer
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '70px 32px',
        background: '#323334',
        color: '#FFFFFF',
        fontFamily: 'system-ui, sans-serif',
        fontWeight: 300,
        fontSize: 48,
      }}
    >
      FOOTER
    </footer>
  );
}
