'use client';

import { AuthGuard } from '@/components/auth-guard';
import { Skeleton } from '@/components/ui/skeleton';
import { AccountMenu } from '@/components/account-menu';
import { CreateDocDialog } from '@/components/create-doc-dialog';
import { DocCard } from '@/components/doc-card';
import { useAuth } from '@/lib/auth-context';
import { useDocsQuery } from '@/lib/hooks/use-docs';

function DashboardContent() {
  const { user } = useAuth();
  const { data: docs, isLoading, isError } = useDocsQuery();

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="min-w-0 truncate text-xl font-semibold">Your documents</h1>
        <div className="flex shrink-0 items-center gap-3">
          <CreateDocDialog />
          <AccountMenu />
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-destructive text-sm">Couldn&apos;t load your documents. Try refreshing.</p>
      )}

      {!isLoading && !isError && docs?.length === 0 && (
        <div className="border-muted-foreground/25 flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground text-sm">
            No documents yet. Create your first one to get started.
          </p>
        </div>
      )}

      {!isLoading && !isError && docs && docs.length > 0 && user && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((doc) => (
            <DocCard key={doc.id} doc={doc} currentUserId={user.sub} />
          ))}
        </div>
      )}
    </main>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
