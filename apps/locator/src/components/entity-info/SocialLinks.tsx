import { cn } from '../../utils/cn';
// Official brand marks (LinkedIn/Facebook), not `packages/icons` glyphs --
// see this directory's own `../../../assets/icons/README.md` for the
// source-asset provenance (`linkedin-badge-source.png` is the literal
// official download; `-cropped` removes its bundled ® mark down to a
// square badge, since packaged brand-asset exports aren't pre-cropped to
// just the icon). Same vite-imagetools, build-time-only responsive-image
// convention Start.tsx's hero image uses: the plain, query-free import
// is both the `<img>`'s fallback `src` and the browser-decides-nothing
// baseline, `?w=16;32;48&format=webp&as=srcset` covers 1x-3x DPR at this
// icon's fixed 16px (`density.sizing.fixed.large`) display size.
import linkedinIcon from '../../assets/icons/linkedin-badge-cropped.png';
import linkedinIconSrcset from '../../assets/icons/linkedin-badge-cropped.png?w=16;32;48&format=webp&as=srcset';
import facebookIcon from '../../assets/icons/facebook-logo-source.png';
import facebookIconSrcset from '../../assets/icons/facebook-logo-source.png?w=16;32;48&format=webp&as=srcset';

export interface SocialLinksProps {
  /** Used to build each link's accessible name ("<name> on LinkedIn"). */
  name: string;
  linkedIn?: boolean;
  facebook?: boolean;
  className?: string;
}

// Neither a real <a> nor DS `Link` has a native `disabled` attribute, so
// this fakes it the same way ContactLinks/OfficeDetailsPanel/Start.tsx/
// SiteHeader.tsx/ProspectPortal do for every other not-really-wired-up
// destination in this app: an inert `href="#"`, aria-disabled, tabIndex
// -1, onClick preventDefault, and a `cursor-not-allowed` override.
function preventDisabledClick(event: { preventDefault: () => void }) {
  event.preventDefault();
}

// Split out of AdvisorCard (2026-09-20, per the user) -- no real profile
// URL exists in the data model (`Advisor.linkedIn`/`.facebook` are
// booleans, not links), so these render inert like every other not-yet-
// real destination in this app. AdvisorCard itself no longer renders
// this; it's reserved for the individual advisor profile page instead.
export function SocialLinks({
  name,
  linkedIn,
  facebook,
  className,
}: SocialLinksProps) {
  if (!linkedIn && !facebook) return null;

  return (
    <div
      className={cn('flex gap-[var(--density-spacing-fixed-med)]', className)}
    >
      {linkedIn && (
        <a
          href="#"
          aria-disabled="true"
          aria-label={`${name} on LinkedIn`}
          tabIndex={-1}
          onClick={preventDisabledClick}
          className="cursor-not-allowed"
        >
          <img
            src={linkedinIcon}
            srcSet={linkedinIconSrcset}
            sizes="16px"
            alt=""
            aria-hidden="true"
            className="size-[var(--density-sizing-fixed-large)]"
          />
        </a>
      )}
      {facebook && (
        <a
          href="#"
          aria-disabled="true"
          aria-label={`${name} on Facebook`}
          tabIndex={-1}
          onClick={preventDisabledClick}
          className="cursor-not-allowed"
        >
          <img
            src={facebookIcon}
            srcSet={facebookIconSrcset}
            sizes="16px"
            alt=""
            aria-hidden="true"
            className="size-[var(--density-sizing-fixed-large)]"
          />
        </a>
      )}
    </div>
  );
}
