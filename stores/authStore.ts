// stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  token: string | null;
  setAuth: (token: string) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setAuth: (token: string) => set({ token }),
      clearAuth: () => set({ token: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
