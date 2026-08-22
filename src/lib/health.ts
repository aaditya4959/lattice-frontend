import { API_URL } from './env';

export interface HealthResponse {
  status: string;
  postgres: string;
  redis: string;
}

// Both 200 and 503 carry a meaningful body here (see docs/backend-integration.md)
// — only a fetch() rejection (network failure, or a CORS block, which looks
// identical to the browser) means "truly unreachable."
export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_URL}/health`);
  return res.json();
}
