import type { ApiErrorShape } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export class ApiError extends Error {
  statusCode: number;
  details: string[];

  constructor(shape: ApiErrorShape) {
    const messages = Array.isArray(shape.message) ? shape.message : [shape.message];
    super(messages.join(', '));
    this.statusCode = shape.statusCode;
    this.details = messages;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'DELETE' | 'PATCH';
  body?: unknown;
  token?: string | null;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      data ?? { statusCode: res.status, message: res.statusText, error: 'Unknown' },
    );
  }

  return data as T;
}
