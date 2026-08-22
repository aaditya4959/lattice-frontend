'use client';

import { useSyncExternalStore } from 'react';

function subscribe(query: string, callback: () => void) {
  const mql = window.matchMedia(query);
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => subscribe(query, callback),
    () => window.matchMedia(query).matches,
    () => false, // SSR snapshot — matches nothing server-side, corrected on hydration
  );
}

// Tailwind's `sm` breakpoint (640px) — below this, presence/nav UI collapses
// into sheets instead of popovers.
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 639px)');
}
