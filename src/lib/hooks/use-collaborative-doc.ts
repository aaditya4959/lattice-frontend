'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { useAuth } from '@/lib/auth-context';
import { base64ToUint8Array, uint8ArrayToBase64 } from '@/lib/yjs-codec';
import type { ClientMessage, ServerMessage } from '@/lib/types';

export type ConnectionStatus = 'connecting' | 'connected' | 'reconnecting' | 'error';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:3000/sync';
const MAX_BACKOFF_MS = 10_000;

// Tag applied to Yjs transactions built from server messages, so the local
// doc.on('update') listener below can tell "came from the network" apart from
// "the user typed something" and only re-broadcast the latter.
const REMOTE_ORIGIN = Symbol('remote-sync');

export interface CollaborativeDocHandle {
  doc: Y.Doc;
  status: ConnectionStatus;
  errorCode: string | null;
  send: (message: ClientMessage) => void;
  subscribe: (handler: (message: ServerMessage) => void) => () => void;
}

export function useCollaborativeDoc(docId: string | undefined): CollaborativeDocHandle {
  const { token } = useAuth();
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const [doc] = useState(() => new Y.Doc());

  const wsRef = useRef<WebSocket | null>(null);
  const listenersRef = useRef(new Set<(message: ServerMessage) => void>());
  const sendRef = useRef<(message: ClientMessage) => void>(() => {});

  useEffect(() => {
    if (!docId || !token) return;

    // Narrow once, outside any nested function/closure — TS won't carry the
    // above guard's narrowing of a captured parameter into functions declared
    // further down (join/connect/onLocalUpdate all reference this).
    const activeDocId = docId;
    const activeToken = token;

    let cancelled = false;
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    let backoffMs = 1000;
    let hasConnectedOnce = false;

    function send(message: ClientMessage) {
      if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message));
    }
    sendRef.current = send;

    function scheduleReconnect() {
      if (cancelled) return;
      setStatus('reconnecting');
      reconnectTimer = setTimeout(connect, backoffMs);
      backoffMs = Math.min(backoffMs * 2, MAX_BACKOFF_MS);
    }

    function connect() {
      if (cancelled) return;
      setStatus(hasConnectedOnce ? 'reconnecting' : 'connecting');

      socket = new WebSocket(WS_URL);
      wsRef.current = socket;

      socket.onopen = () => {
        send({ type: 'join', docId: activeDocId, token: activeToken });
      };

      socket.onmessage = (event) => {
        const message: ServerMessage = JSON.parse(event.data);

        switch (message.type) {
          case 'joined':
            Y.applyUpdate(doc, base64ToUint8Array(message.initialState), REMOTE_ORIGIN);
            backoffMs = 1000;
            hasConnectedOnce = true;
            setStatus('connected');
            setErrorCode(null);
            // Defensive reconciliation on top of the fresh snapshot 'joined' just sent —
            // cheap, and covers anything lost in the gap around a reconnect.
            send({
              type: 'sync-request',
              docId: activeDocId,
              stateVector: uint8ArrayToBase64(Y.encodeStateVector(doc)),
            });
            break;
          case 'sync-response':
          case 'update':
            Y.applyUpdate(doc, base64ToUint8Array(message.update), REMOTE_ORIGIN);
            break;
          case 'error':
            setErrorCode(message.code);
            setStatus('error');
            break;
        }

        for (const listener of listenersRef.current) listener(message);
      };

      socket.onclose = () => {
        if (cancelled) return;
        scheduleReconnect();
      };

      socket.onerror = () => {
        socket?.close();
      };
    }

    connect();

    function onLocalUpdate(update: Uint8Array, origin: unknown) {
      if (origin === REMOTE_ORIGIN) return;
      send({ type: 'update', docId: activeDocId, update: uint8ArrayToBase64(update) });
    }
    doc.on('update', onLocalUpdate);

    return () => {
      cancelled = true;
      clearTimeout(reconnectTimer);
      doc.off('update', onLocalUpdate);
      socket?.close();
      wsRef.current = null;
    };
  }, [docId, token, doc]);

  // Stable identities (refs only) so consumers like usePresence can depend on
  // send/subscribe without resubscribing on every render.
  const send = useCallback((message: ClientMessage) => sendRef.current(message), []);
  const subscribe = useCallback((handler: (message: ServerMessage) => void) => {
    listenersRef.current.add(handler);
    return () => listenersRef.current.delete(handler);
  }, []);

  return { doc, status, errorCode, send, subscribe };
}
