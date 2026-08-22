'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { apiFetch } from './api';
import type { AuthUser } from './types';

const TOKEN_STORAGE_KEY = 'lattice.token';

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  login: (accessToken: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// The backend issues 24h JWTs with no refresh flow (see docs/backend-integration.md) —
// an expired token just means /auth/me fails and we drop back to logged-out state.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async (accessToken: string) => {
    try {
      const me = await apiFetch<AuthUser>('/auth/me', { token: accessToken });
      setUser(me);
      setToken(accessToken);
    } catch {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setUser(null);
      setToken(null);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!stored) {
      // One-time sync read of localStorage on mount, not a cascading update.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      await loadUser(stored);
      if (!cancelled) setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [loadUser]);

  const login = useCallback(
    async (accessToken: string) => {
      localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
      await loadUser(accessToken);
    },
    [loadUser],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
