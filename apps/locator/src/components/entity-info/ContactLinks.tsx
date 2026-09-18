import { Link } from 'ds';
import { MapPinLarge, Phone } from 'icons';
import { cn } from '../../utils/cn';

export interface ContactLinksProps {
  address?: string;
  /** Defaults to a Google Maps search URL built from `address`. */
  addressHref?: string;
  phone?: string;
  className?: string;
}

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

// Matches `.FA-Card-Contact` (`1:673`): an address link (pin icon) and a
// phone link (phone icon), each independently conditional -- `Show
// Address`/`Show Phone` in Figma. Figma's own Address frame is built from
// two separate Link instances purely to get wrapped-text-plus-trailing-
// icon layout in the design tool; confirmed with the user this isn't an
// intentional two-link design, so this renders the address as a single
// Link with `newWindow` instead. (Fax is deliberately not handled here --
// it has no slot on `.FA-Card-Contact` at all, only on the Office Details
// panel's `OfficeContact-Inline`, so it belongs in `OfficeDetailsPanel`.)
export function ContactLinks({
  address,
  addressHref,
  phone,
  className,
}: ContactLinksProps) {
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
            className="mt-[0.15em] size-[var(--density-sizing-fixed-large)] shrink-0"
          />
          <Link
            href={
              addressHref ??
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
            }
            newWindow
          >
            {address}
          </Link>
        </div>
      )}
      {phone && (
        <div className="flex items-center gap-[var(--density-spacing-fixed-x-small)]">
          <Phone
            aria-hidden="true"
            className="size-[var(--density-sizing-fixed-large)] shrink-0"
          />
          <Link href={telHref(phone)}>{phone}</Link>
        </div>
      )}
    </div>
  );
}
