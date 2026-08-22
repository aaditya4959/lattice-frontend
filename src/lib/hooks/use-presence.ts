'use client';

import { useEffect, useRef, useState } from 'react';
import { getUserColor } from '@/lib/cursor-color';
import type { CollaborativeDocHandle } from './use-collaborative-doc';

export interface PresenceUser {
  userId: string;
  email: string;
  color: string;
  isSelf: boolean;
}

export interface RemoteCursor {
  userId: string;
  email: string;
  position: number;
  color: string;
}

export function usePresence(
  subscribe: CollaborativeDocHandle['subscribe'],
  send: CollaborativeDocHandle['send'],
  docId: string,
  currentUserId: string | undefined,
) {
  const [roster, setRoster] = useState<PresenceUser[]>([]);
  const [cursors, setCursors] = useState<Map<string, RemoteCursor>>(new Map());
  // 'presence' carries email; 'cursor' only carries userId — remember emails
  // across messages so a cursor update can still be labeled.
  const emailByUserId = useRef(new Map<string, string>());

  useEffect(() => {
    return subscribe((message) => {
      if (message.type === 'presence') {
        for (const u of message.users) emailByUserId.current.set(u.userId, u.email);

        setRoster(
          message.users.map((u) => ({
            userId: u.userId,
            email: u.email,
            color: getUserColor(u.userId),
            isSelf: u.userId === currentUserId,
          })),
        );

        setCursors((prev) => {
          const stillPresent = new Set(message.users.map((u) => u.userId));
          const next = new Map(prev);
          for (const userId of next.keys()) {
            if (!stillPresent.has(userId)) next.delete(userId);
          }
          return next;
        });
      } else if (message.type === 'cursor' && message.userId !== currentUserId) {
        const email = emailByUserId.current.get(message.userId) ?? '';
        setCursors((prev) => {
          const next = new Map(prev);
          next.set(message.userId, {
            userId: message.userId,
            email,
            position: message.position,
            color: getUserColor(message.userId),
          });
          return next;
        });
      }
    });
  }, [subscribe, currentUserId]);

  function sendCursor(position: number | null) {
    if (position === null) return;
    send({ type: 'cursor', docId, position });
  }

  return { roster, remoteCursors: Array.from(cursors.values()), sendCursor };
}
