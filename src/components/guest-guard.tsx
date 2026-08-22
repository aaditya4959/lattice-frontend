'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

// Opposite of AuthGuard: keeps already-authenticated users off /login and /register.
export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) router.replace('/dashboard');
  }, [isLoading, user, router]);

  if (isLoading || user) return null;

  return <>{children}</>;
}
