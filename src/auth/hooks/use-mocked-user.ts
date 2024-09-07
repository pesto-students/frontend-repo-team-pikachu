// src/auth/hooks/use-mocked-user.ts
import { useAuthContext } from './use-auth-context';

export function useMockedUser() {
  const { user } = useAuthContext();
  return { user };
}
