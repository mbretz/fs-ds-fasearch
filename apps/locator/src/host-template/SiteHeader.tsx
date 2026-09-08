import type { CSSProperties, ReactNode } from 'react';
import logo from './assets/site-header-logo.svg';

// Deliberately no `ds`/`tokens`/`icons` imports anywhere in this file — the
// site shell is a decorative, non-functional "surrounding site" the locator
// product sits inside, styled independently of the design system it hosts.
// All copy/branding here matches the real Figma site-shell reference
// (nodes 6:4933 desktop, 338:5559 mobile) verbatim, per explicit direction.
//
// Three tiers, measured directly against the real edwardjones.com header
// (Figma's own mobile/desktop pair doesn't cover the middle one):
//   < 768px   — mobile: logo, search, Secure Login, hamburger.
//   768-1279  — tablet: logo, search, Secure Login, Find a Financial
//               Advisor, hamburger (no text nav links yet).
//   >= 1280px — desktop: full nav with the four text links, no hamburger.
// 768/1280 are Tailwind's native `md`/`xl` steps and the closest match to
// the real site's own cutoffs (measured at 640-768 and 1210-1225).

const disabledStyle: CSSProperties = {
  cursor: 'not-allowed',
};

const NAV_LINKS = [
  'Why Edward Jones',
  'Working with a Financial Advisor',
  'Investment Services',
  'Market News and Insights',
];

// Forces the last word of a label onto its own line via an explicit <br/>,
// rather than relying on a max-width to trigger wrapping at the right
// point — text-wrap is font-metric-dependent and fragile, an explicit
// break always lands exactly where intended regardless of font/size.
function splitLastWord(label: string): [string, string] {
  const words = label.split(' ');
  const lastWord = words.pop()!;
  return [words.join(' '), lastWord];
}

// Small hand-authored inline SVGs, not `icons` package imports — this file
// deliberately has zero dependency on the design system it hosts. Shapes
// mirror the DS's own search/hamburger/lock-locked icons for visual
// consistency, redrawn here rather than imported.
function SearchGlyph() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.488 15.4551C17.679 14.0319 18.3959 12.1985 18.3959 10.1976C18.3959 5.6702 14.7255 2 10.1979 2C5.67034 2 2 5.6702 2 10.1976C2 14.725 5.67034 18.3952 10.1979 18.3952C12.1989 18.3952 14.0324 17.6784 15.4557 16.4875L20.7538 21.7862C21.0388 22.0713 21.501 22.0713 21.7861 21.7862C22.0713 21.5012 22.0713 21.039 21.7862 20.7539L16.488 15.4551ZM14.9839 14.9402C16.1905 13.7227 16.9358 12.0472 16.9358 10.1976C16.9358 6.47652 13.9192 3.45997 10.1979 3.45997C6.47669 3.45997 3.46003 6.47652 3.46003 10.1976C3.46003 13.9187 6.47669 16.9353 10.1979 16.9353C12.0476 16.9353 13.7232 16.19 14.9408 14.9833C14.9477 14.9759 14.9547 14.9685 14.9619 14.9613C14.9691 14.9541 14.9764 14.9471 14.9839 14.9402Z"
        fill="currentColor"
      />
    </svg>
  );
}

function HamburgerGlyph() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.86957 4H21.1304C21.1304 4 22 4 22 4.84211V5.68421C22 5.68421 22 6.52632 21.1304 6.52632H2.86957C2.86957 6.52632 2 6.52632 2 5.68421V4.84211C2 4.84211 2 4 2.86957 4ZM2.86957 10.7368H21.1304C21.1304 10.7368 22 10.7368 22 11.5789V12.421C22 12.421 22 13.2631 21.1304 13.2631H2.86957C2.86957 13.2631 2 13.2631 2 12.421V11.5789C2 11.5789 2 10.7368 2.86957 10.7368ZM21.1304 17.4737H2.86957C2 17.4737 2 18.3158 2 18.3158V19.1579C2 20 2.86957 20 2.86957 20H21.1304C22 20 22 19.1579 22 19.1579V18.3158C22 17.4737 21.1304 17.4737 21.1304 17.4737Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LockGlyph() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 11.375C5 10.3395 5.83947 9.5 6.875 9.5H18.125C19.1605 9.5 20 10.3395 20 11.375V20.125C20 21.1605 19.1605 22 18.125 22H6.875C5.83947 22 5 21.1605 5 20.125V11.375ZM6.875 10.75C6.52982 10.75 6.25 11.0298 6.25 11.375V20.125C6.25 20.4702 6.52982 20.75 6.875 20.75H18.125C18.4702 20.75 18.75 20.4702 18.75 20.125V11.375C18.75 11.0298 18.4702 10.75 18.125 10.75H6.875Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.5 3.25C10.4289 3.25 8.75 4.92893 8.75 7V10.125C8.75 10.4702 8.47018 10.75 8.125 10.75C7.77982 10.75 7.5 10.4702 7.5 10.125V7C7.5 4.23858 9.73858 2 12.5 2C15.2614 2 17.5 4.23858 17.5 7V10.125C17.5 10.4702 17.2202 10.75 16.875 10.75C16.5298 10.75 16.25 10.4702 16.25 10.125V7C16.25 4.92893 14.5711 3.25 12.5 3.25Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.5 13.875C12.8452 13.875 13.125 14.1548 13.125 14.5V17C13.125 17.3452 12.8452 17.625 12.5 17.625C12.1548 17.625 11.875 17.3452 11.875 17V14.5C11.875 14.1548 12.1548 13.875 12.5 13.875Z"
        fill="currentColor"
      />
    </svg>
  );
}

// The SVG's own viewBox (160x48) bakes in its yellow background at a fixed
// aspect ratio — wrapping it in a matching-color padded box (rather than
// just scaling the <img>) is what makes the chip visually taller without
// distorting the wordmark inside it.
function LogoChip({ width, height }: { width: number; height: number }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        background: '#FAD141',
        padding: '14px 16px',
      }}
    >
      <img
        src={logo}
        alt="Edward Jones"
        width={width}
        height={height}
        style={disabledStyle}
      />
    </div>
  );
}

function SecureLoginPill() {
  return (
    <a
      href="#"
      aria-disabled="true"
      tabIndex={-1}
      onClick={(event) => event.preventDefault()}
      style={{
        ...disabledStyle,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 10px',
        background: '#FFFFFF',
        border: '1px solid #7D8082',
        borderRadius: 4,
        color: '#006DA3',
        textDecoration: 'none',
        fontSize: 14,
        fontFamily: 'system-ui, sans-serif',
        whiteSpace: 'nowrap',
      }}
    >
      <LockGlyph /> Secure Login
    </a>
  );
}

function FindAdvisorPill() {
  return (
    <a
      href="#"
      aria-disabled="true"
      tabIndex={-1}
      onClick={(event) => event.preventDefault()}
      style={{
        ...disabledStyle,
        display: 'inline-block',
        padding: '6px 10px',
        border: '1px solid #006DA3',
        borderRadius: 4,
        background: '#323334',
        color: '#FFFFFF',
        textDecoration: 'none',
        fontSize: 14,
        fontFamily: 'system-ui, sans-serif',
        whiteSpace: 'nowrap',
      }}
    >
      Find a Financial Advisor
    </a>
  );
}

function UtilityButton({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-disabled="true"
      tabIndex={-1}
      onClick={(event) => event.preventDefault()}
      aria-label={`${label} (disabled)`}
      className="site-header-utility-button"
    >
      {children}
    </button>
  );
}

export function SiteHeader() {
  return (
    <header>
      <style>{`
        .site-header-mobile,
        .site-header-tablet {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #E6E7E8;
        }
        .site-header-tablet { display: none; }
        .site-header-desktop { display: none; }
        @media (min-width: 768px) {
          .site-header-mobile { display: none; }
          .site-header-tablet { display: flex; }
        }
        @media (min-width: 1280px) {
          .site-header-tablet { display: none; }
          .site-header-desktop { display: block; }
        }
        .site-header-nav-link,
        .site-header-utility-button {
          background: none;
          border: none;
          font: inherit;
          color: #191A1A;
          cursor: not-allowed;
        }
        .site-header-nav-link { padding: 6px 2px; }
      `}</style>

      <div className="site-header-desktop">
        <div
          style={{
            maxWidth: 1214,
            boxSizing: 'border-box',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 8,
            padding: '4px 0',
            borderBottom: '1px solid #E6E7E8',
            fontFamily: 'system-ui, sans-serif',
            fontSize: 14,
            color: '#191A1A',
          }}
        >
          <span style={disabledStyle}>Country:</span>
          <span style={disabledStyle}>United States | English</span>
          <span aria-hidden style={disabledStyle}>
            ▾
          </span>
          <UtilityButton label="Search">
            <SearchGlyph />
          </UtilityButton>
        </div>

        <div
          style={{
            maxWidth: 1214,
            boxSizing: 'border-box',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0 0',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <img
            src={logo}
            alt="Edward Jones"
            width={160}
            height={48}
            style={disabledStyle}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {NAV_LINKS.map((label) => {
              const [firstLine, lastWord] = splitLastWord(label);
              return (
                <button
                  key={label}
                  type="button"
                  aria-disabled="true"
                  tabIndex={-1}
                  onClick={(event) => event.preventDefault()}
                  className="site-header-nav-link"
                  style={{ fontSize: 15, fontWeight: 500, textAlign: 'center' }}
                >
                  {firstLine}
                  <br />
                  {lastWord}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <a
              href="#"
              aria-disabled="true"
              tabIndex={-1}
              onClick={(event) => event.preventDefault()}
              style={{
                ...disabledStyle,
                display: 'inline-block',
                padding: '10px 14px',
                border: '1px solid #323334',
                borderRadius: 4,
                color: '#191A1A',
                textDecoration: 'none',
                fontSize: 16,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              Secure Login
            </a>
            <a
              href="#"
              aria-disabled="true"
              tabIndex={-1}
              onClick={(event) => event.preventDefault()}
              style={{
                ...disabledStyle,
                display: 'inline-block',
                padding: '10px 14px',
                border: '1px solid #006DA3',
                borderRadius: 4,
                background: '#323334',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: 16,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              Find a Financial Advisor
            </a>
          </div>
        </div>
      </div>

      <div className="site-header-tablet">
        <LogoChip width={130} height={39} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 16px',
          }}
        >
          <UtilityButton label="Search">
            <SearchGlyph />
          </UtilityButton>
          <SecureLoginPill />
          <FindAdvisorPill />
          <UtilityButton label="Menu">
            <HamburgerGlyph />
          </UtilityButton>
        </div>
      </div>

      <div className="site-header-mobile">
        <LogoChip width={100} height={30} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '0 16px',
          }}
        >
          <UtilityButton label="Search">
            <SearchGlyph />
          </UtilityButton>
          <SecureLoginPill />
          <UtilityButton label="Menu">
            <HamburgerGlyph />
          </UtilityButton>
        </div>
      </div>
    </header>
  );
}
