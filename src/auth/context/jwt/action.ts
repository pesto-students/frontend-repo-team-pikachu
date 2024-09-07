// src/auth/context/jwt/action.ts

'use client';

import { useAuthStore } from 'stores/authStore';

import axios, { endpoints } from 'src/utils/axios';

export type SignInParams = {
  email: string;
  password: string;
};

export type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export const signInWithPassword = async ({
  email,
  password,
}: SignInParams): Promise<{ status: string; code: number; message: string }> => {
  try {
    const response = await axios.post(endpoints.auth.signIn, { email, password });
    console.log('response.data', response.data);
    const { data } = response.data;
    const { token } = data;
    if (!token) {
      throw new Error('Access token not found in response');
    }
    useAuthStore.getState().setAuth(token);
    return response.data;
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
}: SignUpParams): Promise<{ status: string; code: number; message: string }> => {
  try {
    const response = await axios.post(endpoints.auth.signUp, {
      email,
      password,
      firstName,
      lastName,
    });
    return response.data;
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    useAuthStore.getState().clearAuth();
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
