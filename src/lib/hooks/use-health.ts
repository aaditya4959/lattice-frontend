'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchHealth } from '@/lib/health';

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
    refetchInterval: 30_000,
    retry: false,
  });
}
