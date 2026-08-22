'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MoreVertical } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { InviteCollaboratorDialog } from '@/components/invite-collaborator-dialog';
import { ApiError } from '@/lib/api';
import { useDeleteDocMutation } from '@/lib/hooks/use-docs';
import type { DocRecord } from '@/lib/types';

function formatUpdatedAt(iso: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(iso),
  );
}

export function DocCard({ doc, currentUserId }: { doc: DocRecord; currentUserId: string }) {
  const isOwner = doc.ownerId === currentUserId;
  const [inviteOpen, setInviteOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteDoc = useDeleteDocMutation();

  function handleDelete() {
    deleteDoc.mutate(doc.id, {
      onError: (error) => {
        toast.error(error instanceof ApiError ? error.details.join(' ') : 'Could not delete document.');
      },
    });
  }

  return (
    <>
      <Card className="relative">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              aria-label="Document actions"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/docs/${doc.id}`}>Open</Link>
            </DropdownMenuItem>
            {isOwner && (
              <DropdownMenuItem onSelect={() => setInviteOpen(true)}>Invite</DropdownMenuItem>
            )}
            {isOwner && (
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => setDeleteOpen(true)}
              >
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Link href={`/docs/${doc.id}`} className="block">
          <CardHeader>
            <CardTitle className="pr-8 truncate">{doc.title}</CardTitle>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant={isOwner ? 'default' : 'secondary'}>
                {isOwner ? 'Owner' : 'Shared with you'}
              </Badge>
              <span className="text-muted-foreground text-xs">
                Updated {formatUpdatedAt(doc.updatedAt)}
              </span>
            </div>
          </CardHeader>
        </Link>
      </Card>

      {isOwner && (
        <InviteCollaboratorDialog docId={doc.id} open={inviteOpen} onOpenChange={setInviteOpen} />
      )}

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &quot;{doc.title}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the document for every collaborator. This can&apos;t be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
