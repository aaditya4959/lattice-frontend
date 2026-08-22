// Deterministic per-user color so the same person shows up in the same color
// on every client, with no coordination needed — just hash their userId.
const PALETTE = [
  '#2563eb', // blue
  '#16a34a', // green
  '#d97706', // amber
  '#e11d48', // rose
  '#7c3aed', // violet
  '#0891b2', // cyan
  '#ea580c', // orange
  '#0d9488', // teal
];

export function getUserColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) | 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}
