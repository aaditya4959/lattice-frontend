'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateDocMutation } from '@/lib/hooks/use-docs';
import { createDocSchema, type CreateDocInput } from '@/lib/docs-schemas';
import { ApiError } from '@/lib/api';

export function CreateDocDialog() {
  const router = useRouter();
  const createDoc = useCreateDocMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDocInput>({ resolver: zodResolver(createDocSchema) });

  function onSubmit(values: CreateDocInput) {
    createDoc.mutate(values.title, {
      onSuccess: (doc) => {
        reset();
        router.push(`/docs/${doc.id}`);
      },
      onError: (error) => {
        toast.error(error instanceof ApiError ? error.details.join(' ') : 'Could not create document.');
      },
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New document</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogHeader>
            <DialogTitle>New document</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-2 py-4">
            <Label htmlFor="doc-title">Title</Label>
            <Input id="doc-title" autoFocus {...register('title')} />
            {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={createDoc.isPending}>
              {createDoc.isPending ? 'Creating…' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
