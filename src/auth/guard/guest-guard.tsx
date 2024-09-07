'use client';

import { useAuthStore } from 'stores/authStore';
import { useState, useEffect, useCallback } from 'react';

import { useRouter, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { SplashScreen } from 'src/components/loading-screen';

type Props = {
  children: React.ReactNode;
};

export function GuestGuard({ children }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isChecking, setIsChecking] = useState<boolean>(true);

  // Use the Zustand store instead of useAuthContext
  const { token } = useAuthStore();

  const returnTo = searchParams.get('returnTo') || CONFIG.auth.redirectPath;

  const checkAuthentication = useCallback(async () => {
    if (token) {
      // User is authenticated, redirect to returnTo path
      router.replace(returnTo);
    } else {
      // User is not authenticated, allow access to guest pages
      setIsChecking(false);
    }
  }, [token, router, returnTo]);

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
