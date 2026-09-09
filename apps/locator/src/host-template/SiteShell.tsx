import { Outlet } from 'react-router-dom';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';

export function SiteShell() {
  return (
    <>
      <SiteHeader />
      {/*
        1214px matches SiteHeader's own desktop-tier maxWidth (see its
        `maxWidth: 1214` inline styles) — the product content shares the
        real site's content column rather than defining its own. Only
        applied from `lg:` (1024px) up: below that, product pages (e.g.
        AdvisorSearchModule's Stage=Start/InProgress) are already full-
        bleed with their own small padding, matching Figma's mobile frame.
      */}
      <main className="lg:mx-auto lg:max-w-[1214px]">
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}
