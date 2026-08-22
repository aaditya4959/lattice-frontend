// Mirrors lattice-backend's REST/WS contracts — see docs/backend-integration.md

export interface DocRecord {
  id: string;
  ownerId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocDetail extends DocRecord {
  latestSnapshotAt: string | null;
}

export interface CollaboratorRecord {
  userId: string;
  email: string;
  role: string;
}

export interface AuthUser {
  sub: string;
  email: string;
}

export interface ApiErrorShape {
  statusCode: number;
  message: string | string[];
  error: string;
}

export type ClientMessage =
  | { type: 'join'; docId: string; token: string }
  | { type: 'sync-request'; docId: string; stateVector: string }
  | { type: 'update'; docId: string; update: string }
  | { type: 'cursor'; docId: string; position: number };

export type ServerMessage =
  | { type: 'joined'; docId: string; initialState: string }
  | { type: 'sync-response'; docId: string; update: string }
  | { type: 'update'; docId: string; update: string; fromClientId: string }
  | { type: 'presence'; docId: string; users: { userId: string; email: string }[] }
  | { type: 'cursor'; docId: string; userId: string; position: number }
  | { type: 'error'; code: 'unauthorized' | 'forbidden' | string; message: string };
