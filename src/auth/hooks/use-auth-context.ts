// src/auth/hooks/use-auth-context.ts

'use client';

import { useContext } from 'react';
import { useAuthStore } from 'stores/authStore';

import { AuthContext } from '../context/auth-context';

export function useAuthContext() {
  const context = useContext(AuthContext);
  const { token } = useAuthStore();

  if (!context) {
    throw new Error('useAuthContext: Context must be used inside AuthProvider');
  }

  return {
    ...context,
    user: token ? { accessToken: token } : null,
  };
}
