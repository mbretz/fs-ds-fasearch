import { Button, Link } from 'ds';
import { HeartFilled } from 'icons';
import { useSession } from '../../session/useSession';
import { useFavorites } from '../../favorites/useFavorites';
import type { ProspectPortalProps } from './ProspectPortal.types';

// Figma "Prospect portal" component set (LoggedIn=False/True), node
// 1213:41591 of the Find-FA-Screens file — merges what docs/PLAN.md
// originally sketched as two separate components (SessionControl +
// FavoritesLauncher) into the one card this design shows. Card background
// and link color are real DS tokens (primitives.ref.color.teal.250,
// semantic.brand.secondary.lightGold) rather than hardcoded hex like
// SiteHeader — this widget is part of the product, not the decorative
// surrounding site. "Learn More"/"Go to Portal" point at a real external
// EJ prospect-portal site that doesn't exist in this demo, so both render
// inert (aria-disabled, not-allowed cursor) the same way SiteHeader treats
// that class of link; "See My Favorites" is styled active but has nowhere
// to navigate yet since the Saved Advisors page isn't built.
export function ProspectPortal({ className }: ProspectPortalProps) {
  const { signedIn, firstName, signIn, signOut } = useSession();
  const { favoriteIds } = useFavorites();

  return (
    <section
      aria-label="Prospect portal"
      className={`flex flex-wrap items-center justify-center gap-[var(--density-spacing-fixed-large)] rounded-[var(--semantic-border-radius-generous)] bg-[var(--primitives-ref-color-teal-250)] py-[var(--density-spacing-fixed-large)] px-[var(--density-spacing-fixed-large)] min-[360px]:max-[768px]:px-[var(--density-spacing-fixed-xxx-large)] ${className ?? ''}`}
    >
      <span className="text-[length:var(--semantic-content-nanoheading-font-size)] font-[number:var(--semantic-content-nanoheading-font-weight)] leading-[var(--semantic-content-nanoheading-line-height)] text-[color:var(--semantic-content-common-text-color-reverse)] uppercase">
        Edward Jones Prospect Portal
      </span>

      {signedIn ? (
        <>
          <div className="flex items-center gap-[var(--density-spacing-fixed-small)]">
            <span className="text-[length:var(--semantic-content-common-font-size)] font-[number:var(--semantic-content-common-font-weight)] leading-[var(--semantic-content-common-line-height)] text-[color:var(--semantic-content-common-text-color-reverse)]">
              Welcome back, {firstName}!
            </span>
            <Link
              asChild
              className="cursor-pointer border-0 bg-transparent p-0 text-[length:var(--semantic-content-nanocopy-font-size)] font-[number:var(--semantic-content-nanocopy-font-weight)] leading-[var(--semantic-content-nanocopy-line-height)] text-[color:var(--semantic-content-common-text-color-reverse)]"
            >
              <button type="button" onClick={signOut}>
                (Sign out)
              </button>
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-[var(--density-spacing-fixed-med)]">
            {/* Real link now that `/favorites` exists -- `Button.Root`
                + `asChild`, not the flat `Button`, per the same reasoning
                ProspectPortalLite's own sign-in link comment gives (the
                flat component always wraps children in its own
                `Button.Label`, tripping Radix Slot's single-child rule). */}
            <Button.Root variant="secondary" density="condensed" asChild>
              <a href="/favorites">
                <Button.Icon>
                  <HeartFilled aria-hidden />
                </Button.Icon>
                <Button.Label>
                  See My Favorites
                  {favoriteIds.length > 0 && ` (${favoriteIds.length})`}
                </Button.Label>
              </a>
            </Button.Root>
            <Link
              href="#"
              aria-disabled="true"
              tabIndex={-1}
              onClick={(event) => event.preventDefault()}
              className="cursor-not-allowed text-[color:var(--semantic-brand-secondary-light-gold)]"
            >
              Go to Portal
            </Link>
          </div>
        </>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-[var(--density-spacing-fixed-med)]">
          <Button variant="secondary" density="condensed" onClick={signIn}>
            Sign In / Sign Up
          </Button>
          <Link
            href="#"
            aria-disabled="true"
            tabIndex={-1}
            onClick={(event) => event.preventDefault()}
            className="cursor-not-allowed text-[color:var(--semantic-brand-secondary-light-gold)]"
          >
            Learn More
          </Link>
        </div>
      )}
    </section>
  );
}
