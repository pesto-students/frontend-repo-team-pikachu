'use client';

import { useAuthStore } from 'stores/authStore';
import { useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { SplashScreen } from 'src/components/loading-screen';

type Props = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isChecking, setIsChecking] = useState<boolean>(true);

  // Use the Zustand store instead of useAuthContext
  const { token } = useAuthStore();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const checkAuthentication = useCallback(async () => {
    if (!token) {
      const { method } = CONFIG.auth;
      const signInPath = {
        jwt: paths.auth.signIn,
        auth0: paths.auth.signIn,
        amplify: paths.auth.signIn,
        firebase: paths.auth.signIn,
        supabase: paths.auth.signIn,
      }[method];

      const href = `${signInPath}?${createQueryString('returnTo', pathname)}`;
      router.replace(href);
    } else {
      setIsChecking(false);
    }
  }, [token, router, pathname, createQueryString]);

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
