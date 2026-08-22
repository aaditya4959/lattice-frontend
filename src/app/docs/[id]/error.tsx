'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Scoped to the doc editor specifically — this is the riskiest client code in
// the app (Yjs/WebSocket sync, imperative Quill mounting), so a crash here
// shouldn't take down the whole app shell.
export default function DocEditorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-lg font-semibold">The editor hit a problem</h1>
      <p className="text-muted-foreground max-w-sm text-sm">
        Something went wrong loading this document. Your changes up to the last save are safe.
      </p>
      <div className="mt-2 flex gap-2">
        <Button variant="outline" onClick={() => reset()}>
          Try again
        </Button>
        <Button asChild>
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
