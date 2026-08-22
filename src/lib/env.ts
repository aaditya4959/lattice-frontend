const isProd = process.env.NODE_ENV === 'production';

function resolve(value: string | undefined, fallback: string, name: string): string {
  if (!value) {
    const message = `${name} is not set — falling back to ${fallback}. Set it explicitly for any non-local deployment.`;
    if (isProd) console.error(message);
    else console.warn(message);
    return fallback;
  }
  return value;
}

export const API_URL = resolve(
  process.env.NEXT_PUBLIC_API_URL,
  'http://localhost:3000',
  'NEXT_PUBLIC_API_URL',
);

export const WS_URL = resolve(
  process.env.NEXT_PUBLIC_WS_URL,
  'ws://localhost:3000/sync',
  'NEXT_PUBLIC_WS_URL',
);
