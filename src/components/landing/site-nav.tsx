'use client';

import { useState } from 'react';
import {
  Navbar,
  NavBody,
  NavItems,
  NavbarButton,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
} from '@/components/ui/resizable-navbar';

const NAV_ITEMS = [
  { name: 'Features', link: '#features' },
  { name: 'How it works', link: '#how-it-works' },
];

export function SiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Navbar className="top-4">
      <NavBody>
        <a href="#top" className="relative z-20 mr-4 flex items-center text-sm font-semibold">
          Lattice
        </a>
        <NavItems items={NAV_ITEMS} />
        <div className="relative z-20 flex items-center gap-2">
          <NavbarButton
            href="/login"
            variant="secondary"
            className="dark:text-white"
          >
            Log in
          </NavbarButton>
          <NavbarButton
            href="/register"
            variant="primary"
            className="bg-primary text-primary-foreground shadow-none hover:-translate-y-0.5"
          >
            Get started
          </NavbarButton>
        </div>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <a href="#top" className="text-sm font-semibold">
            Lattice
          </a>
          <MobileNavToggle isOpen={mobileOpen} onClick={() => setMobileOpen((v) => !v)} />
        </MobileNavHeader>
        <MobileNavMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.link}
              href={item.link}
              onClick={() => setMobileOpen(false)}
              className="w-full text-neutral-600 dark:text-neutral-300"
            >
              {item.name}
            </a>
          ))}
          <div className="flex w-full flex-col gap-2 pt-2">
            <NavbarButton href="/login" variant="secondary" className="w-full">
              Log in
            </NavbarButton>
            <NavbarButton
              href="/register"
              variant="primary"
              className="bg-primary text-primary-foreground w-full shadow-none"
            >
              Get started
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
