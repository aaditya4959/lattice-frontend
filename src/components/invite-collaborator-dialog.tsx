'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiError } from '@/lib/api';
import { inviteCollaboratorSchema, type InviteCollaboratorInput } from '@/lib/docs-schemas';
import { useInviteCollaboratorMutation } from '@/lib/hooks/use-docs';

export function InviteCollaboratorDialog({
  docId,
  open,
  onOpenChange,
}: {
  docId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const invite = useInviteCollaboratorMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteCollaboratorInput>({ resolver: zodResolver(inviteCollaboratorSchema) });

  function onSubmit(values: InviteCollaboratorInput) {
    invite.mutate(
      { docId, email: values.email },
      {
        onSuccess: () => {
          toast.success(`Invited ${values.email}`);
          reset();
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(
            error instanceof ApiError ? error.details.join(' ') : 'Could not send invite.',
          );
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogHeader>
            <DialogTitle>Invite a collaborator</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-2 py-4">
            <Label htmlFor="invite-email">Email</Label>
            <Input id="invite-email" type="email" autoFocus {...register('email')} />
            {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={invite.isPending}>
              {invite.isPending ? 'Inviting…' : 'Send invite'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
