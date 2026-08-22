'use client';

import { useEffect } from 'react';

// Catches errors thrown by the root layout itself (route-segment error.tsx
// can't — it renders inside that same layout). Must render its own
// <html>/<body> since it replaces the entire root layout on error.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif' }}>
        <main
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            minHeight: '100vh',
            textAlign: 'center',
            padding: '1.5rem',
          }}
        >
          <h1 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Something went wrong</h1>
          <p style={{ color: '#71717a', maxWidth: '24rem', fontSize: '0.875rem' }}>
            The app failed to load. Try reloading the page.
          </p>
          <button
            onClick={() => reset()}
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid #e4e4e7',
              background: 'white',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
