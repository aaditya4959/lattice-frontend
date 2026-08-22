'use client';

import { AlertTriangle } from 'lucide-react';
import { useHealth } from '@/lib/hooks/use-health';

export function HealthBanner() {
  const { data, isError } = useHealth();

  let message: string | null = null;

  if (isError) {
    // Indistinguishable from a CORS block at the fetch() level — worded
    // generically rather than claiming the server is definitely down.
    message = "Can't reach the server. Some features may not work.";
  } else if (data && data.status !== 'ok') {
    const failing = [
      data.postgres !== 'ok' ? 'database' : null,
      data.redis !== 'ok' ? 'real-time sync' : null,
    ].filter(Boolean);
    message = `Service degraded${failing.length ? ` (${failing.join(' and ')})` : ''} — some features may not work.`;
  }

  if (!message) return null;

  return (
    <div className="bg-destructive flex items-center justify-center gap-2 px-4 py-2 text-center text-sm text-white">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
