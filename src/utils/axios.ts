import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';
import { useAuthStore } from 'stores/authStore';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.site.serverUrl });

axiosInstance.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

const backendURL = CONFIG.backend.url;
const apiVersion = CONFIG.backend.version;

export const endpoints = {
  auth: {
    me: `${backendURL}/${apiVersion}/auth/me`,
    signIn: `${backendURL}/${apiVersion}/auth/signin`,
    signUp: `${backendURL}/${apiVersion}/auth/signup`,
  },
  user: {
    me: `${backendURL}/${apiVersion}/user/me`,
  },
  organization: {
    me: `${backendURL}/${apiVersion}/organization/me`,
  },
  tour: {
    all: `${backendURL}/${apiVersion}/tour/all`,
    get: (id: string) => `${backendURL}/${apiVersion}/tour/get/${id}`,
    create: `${backendURL}/${apiVersion}/tour/create`,
    update: (id: string) => `${backendURL}/${apiVersion}/tour/update/${id}`,
    delete: (id: string) => `${backendURL}/${apiVersion}/tour/delete/${id}`,
  },
};
