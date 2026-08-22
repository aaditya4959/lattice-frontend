'use client';

import { use, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { AuthGuard } from '@/components/auth-guard';
import { CollaborativeEditor } from '@/components/editor/collaborative-editor';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDocQuery } from '@/lib/hooks/use-docs';

function DocEditorContent({ docId }: { docId: string }) {
  const router = useRouter();
  const { data: doc, isLoading, isError } = useDocQuery(docId);

  useEffect(() => {
    if (isError) router.replace('/dashboard');
  }, [isError, router]);

  if (isError) return null;

  return (
    <main className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button variant="ghost" size="icon" className="shrink-0" asChild>
          <Link href="/dashboard" aria-label="Back to dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        {isLoading ? (
          <Skeleton className="h-6 w-48" />
        ) : (
          <h1 className="min-w-0 truncate text-lg font-semibold">{doc?.title}</h1>
        )}
      </div>

      <CollaborativeEditor docId={docId} latestSnapshotAt={doc?.latestSnapshotAt} />
    </main>
  );
}

export default function DocEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <AuthGuard>
      <DocEditorContent docId={id} />
    </AuthGuard>
  );
}
