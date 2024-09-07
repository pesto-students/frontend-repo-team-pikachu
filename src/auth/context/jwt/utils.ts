// src/auth/context/jwt/utils.ts

import { useAuthStore } from 'stores/authStore';

import { paths } from 'src/routes/paths';

import axios from 'src/utils/axios';

export function jwtDecode(token: string) {
  try {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length < 2) {
      throw new Error('Invalid token!');
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(base64));

    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    throw error;
  }
}

export function isValidToken(accessToken: string) {
  if (!accessToken) {
    return false;
  }

  try {
    const decoded = jwtDecode(accessToken);

    if (!decoded || !('exp' in decoded)) {
      return false;
    }

    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Error during token validation:', error);
    return false;
  }
}

export function tokenExpired(exp: number) {
  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;

  setTimeout(() => {

    useAuthStore.getState().clearAuth();
    window.location.href = paths.auth.signIn;
  }, timeLeft);
}

export async function setSession(accessToken: string | null) {
  if (accessToken) {
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    const decodedToken = jwtDecode(accessToken);

    if (decodedToken && 'exp' in decodedToken) {
      tokenExpired(decodedToken.exp);
    } else {
      throw new Error('Invalid access token!');
    }
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
}
