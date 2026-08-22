'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

// Token lives in localStorage, not a cookie (backend has no CORS-safe cookie option —
// see docs/backend-integration.md), so route protection has to happen client-side
// rather than in Next middleware, which only sees the request on the server.
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.replace('/login');
  }, [isLoading, user, router]);

  if (isLoading || !user) return null;

  return <>{children}</>;
}
