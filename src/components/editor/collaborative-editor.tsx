'use client';

import { useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { useCollaborativeDoc, type ConnectionStatus } from '@/lib/hooks/use-collaborative-doc';
import { useNow } from '@/lib/hooks/use-now';
import { formatRelativeTime } from '@/lib/format';
import { LATTICE_TEXT_KEY } from '@/lib/yjs-codec';

// Quill touches the DOM at construction time — keep it out of the server render.
const QuillEditor = dynamic(() => import('./quill-editor').then((mod) => mod.QuillEditor), {
  ssr: false,
});

const STATUS_LABEL: Record<ConnectionStatus, string> = {
  connecting: 'Connecting…',
  connected: 'Live',
  reconnecting: 'Reconnecting…',
  error: 'Connection error',
};

const STATUS_VARIANT: Record<ConnectionStatus, 'default' | 'secondary' | 'destructive'> = {
  connecting: 'secondary',
  connected: 'default',
  reconnecting: 'secondary',
  error: 'destructive',
};

export function CollaborativeEditor({
  docId,
  latestSnapshotAt,
}: {
  docId: string;
  latestSnapshotAt: string | null | undefined;
}) {
  const router = useRouter();
  const { logout } = useAuth();
  const { doc, status, errorCode } = useCollaborativeDoc(docId);
  const ytext = useMemo(() => doc.getText(LATTICE_TEXT_KEY), [doc]);
  const now = useNow(30_000);

  useEffect(() => {
    if (status !== 'error' || !errorCode) return;

    if (errorCode === 'unauthorized') {
      toast.error('Your session expired. Please log in again.');
      logout();
      router.replace('/login');
    } else if (errorCode === 'forbidden') {
      toast.error("You don't have access to this document.");
      router.replace('/dashboard');
    }
  }, [status, errorCode, logout, router]);

  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="flex items-center gap-2">
        <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>
        <span className="text-muted-foreground text-xs">
          {latestSnapshotAt ? `Saved ${formatRelativeTime(latestSnapshotAt, now)}` : 'Not saved yet'}
        </span>
      </div>
      <QuillEditor ytext={ytext} />
    </div>
  );
}
