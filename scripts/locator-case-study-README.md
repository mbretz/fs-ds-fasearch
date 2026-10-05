# Advisor Locator Prototype

A prototype of a financial-advisor search experience: find an advisor or office, compare results as a list or a live map, read a profile, send an inquiry, and save favorites.

<!-- TODO: add the live URL and a link to the case study write-up. -->

It uses mock data and a spoofed sign-in, with no backend. Open the "prototype" tray at the bottom of any page for what it deliberately leaves out compared with a real application.

## Routes

| Route                  | What it shows                                                        |
| ---------------------- | -------------------------------------------------------------------- |
| `/`                    | Landing page with the advisor search module                          |
| `/search`              | Results as a list, a live map, or both side by side                  |
| `/advisor/:id`         | Advisor profile, with a "New Client Inquiry" form                    |
| `/branch/:id`          | Office profile and the advisors based there                          |
| `/advisor/:id/inquiry` | Dedicated inquiry page on small screens                              |
| `/favorites`           | Saved-advisor comparator (a Dialog on desktop, a carousel on mobile) |

## Running it

```bash
pnpm install
pnpm --filter locator dev
```

Build for GitHub Pages with `BASE_PATH=/<repo-name>/ pnpm --filter locator build`. The deploy workflow does this on every push to `main`.

## Stack

Vite, React 19, React Router, Tailwind v4, Radix UI Primitives and MapLibre GL. The UI is built from a small component library and a set of design tokens that live alongside the app in `packages/`.
