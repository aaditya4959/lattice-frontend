'use client';

import { useEffect, useState } from 'react';

// Ticks so components showing relative time ("2 minutes ago") stay current
// without needing new data from the server.
export function useNow(intervalMs: number): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
