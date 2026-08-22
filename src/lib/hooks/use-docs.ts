'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { CollaboratorRecord, DocRecord } from '@/lib/types';

const docsKey = ['docs'] as const;

export function useDocsQuery() {
  const { token } = useAuth();
  return useQuery({
    queryKey: docsKey,
    queryFn: () => apiFetch<DocRecord[]>('/docs', { token }),
    enabled: !!token,
  });
}

export function useCreateDocMutation() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (title: string) =>
      apiFetch<DocRecord>('/docs', { method: 'POST', body: { title }, token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: docsKey }),
  });
}

export function useDeleteDocMutation() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<void>(`/docs/${id}`, { method: 'DELETE', token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: docsKey }),
  });
}

export function useInviteCollaboratorMutation() {
  const { token } = useAuth();
  return useMutation({
    mutationFn: ({ docId, email }: { docId: string; email: string }) =>
      apiFetch<CollaboratorRecord>(`/docs/${docId}/invite`, {
        method: 'POST',
        body: { email },
        token,
      }),
  });
}
