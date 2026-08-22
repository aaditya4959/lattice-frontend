'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { CollaboratorRecord, DocDetail, DocRecord } from '@/lib/types';

const docsKey = ['docs'] as const;

export function useDocsQuery() {
  const { token } = useAuth();
  return useQuery({
    queryKey: docsKey,
    queryFn: () => apiFetch<DocRecord[]>('/docs', { token }),
    enabled: !!token,
  });
}

export function useDocQuery(docId: string | undefined) {
  const { token } = useAuth();
  return useQuery({
    queryKey: [...docsKey, docId],
    queryFn: () => apiFetch<DocDetail>(`/docs/${docId}`, { token }),
    enabled: !!token && !!docId,
    retry: false,
    // latestSnapshotAt only moves when the backend's periodic snapshot job runs,
    // not on every keystroke — poll rather than relying on a WS push that doesn't exist.
    refetchInterval: 30_000,
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
