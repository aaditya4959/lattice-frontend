'use client';

import { AuthGuard } from '@/components/auth-guard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <AuthGuard>
      <main className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Signed in as {user?.email} — document dashboard built in LAT-E9.
          </p>
          <Button variant="outline" size="sm" onClick={logout}>
            Log out
          </Button>
        </div>
      </main>
    </AuthGuard>
  );
}
