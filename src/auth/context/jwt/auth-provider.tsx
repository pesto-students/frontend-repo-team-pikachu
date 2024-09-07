// src/auth/context/jwt/auth-provider.tsx

'use client';

import { useAuthStore } from 'stores/authStore';
import { useMemo, useEffect, useCallback } from 'react';

import axios, { endpoints } from 'src/utils/axios';

import { AuthContext } from '../auth-context';

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { token, clearAuth } = useAuthStore();

  const checkUserSession = useCallback(async () => {
    try {
      if (token) {
        const response = await axios.get(endpoints.auth.me);
        const { data } = response.data;
        const { user } = data;
        return { ...user, accessToken: token };
      }
      return null;
    } catch (error) {
      console.error('Error checking user session:', error);
      clearAuth();
      return null;
    }
  }, [token, clearAuth]);

  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);

  const memoizedValue = useMemo(
    () => ({
      user: token ? { accessToken: token } : null,
      checkUserSession,
      loading: false,
      authenticated: !!token,
      unauthenticated: !token,
    }),
    [token, checkUserSession]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
