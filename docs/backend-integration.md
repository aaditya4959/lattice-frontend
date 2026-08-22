# Lattice Backend — Frontend Integration Guide

Source: knowledge transfer from the lattice-backend session (2026-08-16). Core facts
(branch state, ADR-0007 design decisions, REST route list, WS message types, CORS
absence, DocRecord shape, Yjs `'content'` key, rate-limit defaults) were independently
spot-checked against the backend repo's source and git history — not taken on faith.

## What this is

Lattice is a real-time collaborative text editor backend (NestJS + TypeScript). REST API
for accounts/documents, WebSocket endpoint for live collaborative editing via Yjs CRDTs,
plus live presence/cursor sharing.

## Running it locally

`docker-compose up` from the backend repo root starts the API (port 3000), Postgres, and
Redis together.

- Base URL: `http://localhost:3000`
- WebSocket: `ws://localhost:3000/sync`

**No CORS is currently configured on the server** (verified — nothing in `src/main.ts`).
If the frontend dev server runs on a different origin (e.g. `localhost:5173`), requests
to `localhost:3000` will be blocked until CORS is added backend-side or proxied through
the dev server. This is a known gap — flag it back rather than working around it cleverly.

## Auth

JWT bearer, 24h expiry, no refresh flow — user re-logs-in after expiry. No CORS-safe
cookie option; token must be sent explicitly.

- `POST /auth/register` — `{ email, password (min 8 chars) }` → 201 `{ id, email }`
- `POST /auth/login` — `{ email, password }` → 200 `{ accessToken }`
- `GET /auth/me` — `Authorization: Bearer <token>` → 200 `{ sub (userId), email }`. Use
  this to check "am I logged in, as whom" rather than decoding the JWT client-side.
- Register/login are rate-limited: 5 req/60s per IP, per route independently (verified
  in `src/auth/auth.module.ts` — `AUTH_RATE_LIMIT_MAX`/`_TTL_MS`, defaults 5 / 60000ms).
  6th request in window → 429.
- All other authenticated routes (REST + WS join) use the same bearer token.

## REST API

All routes except `/auth/*` and `/health` require `Authorization: Bearer <token>`. Body
validation strips unknown fields silently, returns 400 (NestJS default shape) on invalid
input.

| Method | Path | Body | Response | Notes |
|---|---|---|---|---|
| POST | `/docs` | `{ title (min 1 char) }` | 201 `DocRecord` | caller becomes owner |
| GET | `/docs` | — | 200 `DocRecord[]` | docs owned or collaborated on |
| GET | `/docs/:id` | — | 200 `DocRecord & { latestSnapshotAt }` | 404 whether doc doesn't exist or no access — no ID probing |
| DELETE | `/docs/:id` | — | 204 | owner-only; 403 collaborator, 404 no access |
| POST | `/docs/:id/invite` | `{ email }` | 201 `CollaboratorRecord` | owner-only |
| DELETE | `/docs/:id/collaborators/:userId` | — | 204 | owner removes anyone, collaborator removes self; owner as target → 400; non-owner removing someone else → 403; not a collaborator → 404 |
| GET | `/health` | — | 200 `{status,postgres,redis}` or 503 | unauthenticated |

```ts
interface DocRecord {
  id: string;
  ownerId: string;
  title: string;
  createdAt: string; // ISO date
  updatedAt: string;
}
interface CollaboratorRecord {
  userId: string;
  email: string;
  role: string;
}
```

Error shape (NestJS default): `{ statusCode, message: string | string[], error }`.
`message` is an array of validation strings for 400s from bad DTO input, plain string
otherwise.

## WebSocket protocol (`/sync`)

Raw `ws`, JSON text frames (no Socket.IO). Send `join` as the first message — nothing
else works until it succeeds.

```ts
type ClientMessage =
  | { type: 'join'; docId: string; token: string }
  | { type: 'sync-request'; docId: string; stateVector: string } // base64 Yjs state vector
  | { type: 'update'; docId: string; update: string }            // base64 Yjs update — must be a real Yjs-encoded update, garbage bytes crash the handler server-side
  | { type: 'cursor'; docId: string; position: number };          // raw text offset, not CRDT-anchored

type ServerMessage =
  | { type: 'joined'; docId: string; initialState: string }
  | { type: 'sync-response'; docId: string; update: string }
  | { type: 'update'; docId: string; update: string; fromClientId: string }
  | { type: 'presence'; docId: string; users: { userId: string; email: string }[] } // full roster, on join + whenever the set changes (not per-tab/keystroke)
  | { type: 'cursor'; docId: string; userId: string; position: number }  // throttled ~75-100ms, leading edge fires immediately
  | { type: 'error'; code: string; message: string };
```

`error.code`: `unauthorized` (missing/invalid/expired token) vs `forbidden` (valid token,
no access to that docId — same response for a nonexistent docId, no enumeration).

## Yjs integration — critical detail

Server uses the real `yjs` npm package — `npm install yjs` on the frontend too, don't
hand-roll compatible binary updates.

The shared text field key is **`'content'`** (backend constant `LATTICE_TEXT_KEY` in
`src/sync/doc-schema.ts`) — must call `doc.getText('content')`, any other key won't
merge with server/other clients.

```ts
import * as Y from 'yjs';

const doc = new Y.Doc();
const text = doc.getText('content'); // must be 'content'

const ws = new WebSocket(`ws://localhost:3000/sync`);
ws.onopen = () => ws.send(JSON.stringify({ type: 'join', docId, token }));

ws.onmessage = (evt) => {
  const msg = JSON.parse(evt.data);
  switch (msg.type) {
    case 'joined':
      Y.applyUpdate(doc, base64ToUint8Array(msg.initialState));
      break;
    case 'update':
      Y.applyUpdate(doc, base64ToUint8Array(msg.update));
      break;
    case 'presence':
      // msg.users — render "who's here" list
      break;
    case 'cursor':
      // msg.userId, msg.position — render/update that user's cursor indicator
      break;
  }
};

doc.on('update', (update: Uint8Array, origin) => {
  ws.send(JSON.stringify({ type: 'update', docId, update: uint8ArrayToBase64(update) }));
});

// Reconnect/resync: send current state vector instead of starting from scratch
ws.send(JSON.stringify({
  type: 'sync-request',
  docId,
  stateVector: uint8ArrayToBase64(Y.encodeStateVector(doc)),
}));
// → server replies 'sync-response' with just the diff missing

// Cursor: send on caret move (server throttles broadcast, but don't spam every mousemove)
ws.send(JSON.stringify({ type: 'cursor', docId, position: textareaEl.selectionStart }));
```

## Known limitations to design around

- Cursor position is a raw integer text offset, not CRDT-anchored — can be briefly a
  few characters "off" after a concurrent remote edit elsewhere in the doc. Deliberate
  scope boundary (backend ADR-0007), not a bug — don't build logic assuming pixel-perfect
  accuracy under concurrency.
- Presence is ephemeral — no history, no "last seen," only who's connected right now.
- A client reconnecting to a different server instance (multi-instance deployment) with
  no other local subscriber for that doc can briefly see stale state. Not an issue for
  local single-instance dev.
- No token revocation/refresh — expired token means re-login, no silent-refresh flow.

## Reference implementation

`client/index.html` in the backend repo is a minimal working manual test harness
implementing this exact protocol end-to-end (presence roster, cursor badges) — worth a
direct look, though explicitly not product-quality UI.
