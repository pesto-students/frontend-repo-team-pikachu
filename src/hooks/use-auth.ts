// hooks/useAuth.ts
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from 'stores/authStore';

export const useAuth = (requireAuth = true) => {
  const { token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (requireAuth && !token) {
      router.push('/signin');
    } else if (!requireAuth && token) {
      router.push('/app');
    }
  }, [token, requireAuth, router]);

  return { isAuthenticated: !!token };
};
