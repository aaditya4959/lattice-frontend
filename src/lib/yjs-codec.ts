// Wire format for Yjs updates over /sync is base64 (see docs/backend-integration.md).

// Backend's shared text field key (LATTICE_TEXT_KEY in src/sync/doc-schema.ts) — any
// other key won't merge with the server or other clients.
export const LATTICE_TEXT_KEY = 'content';

export function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
