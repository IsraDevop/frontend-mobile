import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import * as authService from '@/services/auth';
import { setUnauthorizedHandler } from '@/services/client';
import { hasSession } from '@/services/tokens';
import { LoginRequest, RegisterRequest, UserProfile } from '@/types/api';

interface AuthContextValue {
  user: UserProfile | null;
  initializing: boolean;
  isAuthenticated: boolean;
  signIn: (payload: LoginRequest) => Promise<void>;
  signUp: (payload: RegisterRequest) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [initializing, setInitializing] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      setUser(await authService.getCurrentUser());
    } catch {
      setUser(null);
    }
  }, []);

  // Restore session on launch + wire the global logout trigger from the client.
  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));
    (async () => {
      if (await hasSession()) {
        await loadUser();
      }
      setInitializing(false);
    })();
    return () => setUnauthorizedHandler(null);
  }, [loadUser]);

  const signIn = useCallback(
    async (payload: LoginRequest) => {
      await authService.login(payload);
      await loadUser();
    },
    [loadUser],
  );

  const signUp = useCallback(
    async (payload: RegisterRequest) => {
      const res = await authService.register(payload);
      // Register returns tokens; fall back to login only if it somehow didn't.
      if (!res.accessToken) {
        await authService.login({
          email: payload.email,
          password: payload.password,
        });
      }
      await loadUser();
    },
    [loadUser],
  );

  const signOut = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      initializing,
      isAuthenticated: user != null,
      signIn,
      signUp,
      signOut,
      refreshUser: loadUser,
    }),
    [user, initializing, signIn, signUp, signOut, loadUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
