import { Link } from 'ds';
import { MapPinLarge, Phone } from 'icons';
import { cn } from '../../utils/cn';

export interface ContactLinksProps {
  address?: string;
  phone?: string;
  className?: string;
}

// Neither a real <a> nor DS `Link` has a native `disabled` attribute, so
// this fakes it the same way Start.tsx/SiteHeader.tsx/ProspectPortal do
// for every other not-really-wired-up destination in this app: an inert
// `href="#"`, aria-disabled, tabIndex -1, onClick preventDefault, and a
// `cursor-not-allowed` override. Per the user, address/phone links stay
// inactive for this prototype rather than actually opening Google Maps
// or dialing a fake `555` number.
function preventDisabledClick(event: { preventDefault: () => void }) {
  event.preventDefault();
}

// Matches `.FA-Card-Contact` (`1:673`): an address link (pin icon) and a
// phone link (phone icon), each independently conditional -- `Show
// Address`/`Show Phone` in Figma. Figma's own Address frame is built from
// two separate Link instances purely to get wrapped-text-plus-trailing-
// icon layout in the design tool; confirmed with the user this isn't an
// intentional two-link design, so this renders the address as a single
// Link instead. (Fax is deliberately not handled here -- it has no slot
// on `.FA-Card-Contact` at all, only on the Office Details panel's
// `OfficeContact-Inline`, so it belongs in `OfficeDetailsPanel`.)
//
// Both icons are colored to match `Link`'s own default text color
// (`component-link-text-color-default`) rather than inheriting whatever
// neutral text color surrounds them, per the user -- they're visually
// part of each link, not independent decorative icons.
export function ContactLinks({ address, phone, className }: ContactLinksProps) {
  if (!address && !phone) return null;

  return (
    <div
      className={cn(
        'flex flex-col gap-[var(--density-spacing-fixed-small)]',
        className,
      )}
    >
      {address && (
        <div className="flex items-start gap-[var(--density-spacing-fixed-x-small)]">
          <MapPinLarge
            aria-hidden="true"
            className="mt-[0.15em] size-[var(--density-sizing-fixed-large)] shrink-0 text-[color:var(--component-link-text-color-default)]"
          />
          <Link
            href="#"
            aria-disabled="true"
            tabIndex={-1}
            onClick={preventDisabledClick}
            className="cursor-not-allowed"
          >
            {address}
          </Link>
        </div>
      )}
      {phone && (
        <div className="flex items-center gap-[var(--density-spacing-fixed-x-small)]">
          <Phone
            aria-hidden="true"
            className="size-[var(--density-sizing-fixed-large)] shrink-0 text-[color:var(--component-link-text-color-default)]"
          />
          <Link
            href="#"
            aria-disabled="true"
            tabIndex={-1}
            onClick={preventDisabledClick}
            className="cursor-not-allowed"
          >
            {phone}
          </Link>
        </div>
      )}
    </div>
  );
}
