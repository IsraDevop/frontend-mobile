import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';

import { API_URL, REQUEST_TIMEOUT } from '@/utils/constants';
import { normalizeAxiosError } from '@/utils/errors';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from '@/services/tokens';

/** Per-request options. Set `skipAuth: true` for public endpoints. */
export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
}

type RetriableConfig = InternalAxiosRequestConfig & {
  skipAuth?: boolean;
  _retry?: boolean;
};

/** Called when refresh fails so the AuthContext can force logout. */
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

export const api = axios.create({
  baseURL: API_URL,
  timeout: REQUEST_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach the bearer token unless the call opts out.
api.interceptors.request.use(async (config) => {
  const cfg = config as RetriableConfig;
  if (!cfg.skipAuth) {
    const token = await getAccessToken();
    if (token) {
      cfg.headers.Authorization = `Bearer ${token}`;
    }
  }
  return cfg;
});

// Single-flight refresh: concurrent 401s share one refresh request.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;
  try {
    const { data } = await axios.post(
      `${API_URL}/auth/refresh-token`,
      { refreshToken },
      { timeout: REQUEST_TIMEOUT },
    );
    const accessToken: string | undefined =
      data.accessToken ?? data.token ?? data.access_token;
    if (!accessToken) return null;
    const newRefresh: string =
      data.refreshToken ?? data.refresh_token ?? refreshToken;
    await saveTokens({ accessToken, refreshToken: newRefresh });
    return accessToken;
  } catch {
    return null;
  }
}

// Response interceptor: transparent refresh on 401, normalize every error.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;

    if (status === 401 && original && !original._retry && !original.skipAuth) {
      original._retry = true;
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }
      const newToken = await refreshPromise;
      if (newToken) {
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      }
      await clearTokens();
      onUnauthorized?.();
    }

    return Promise.reject(normalizeAxiosError(error));
  },
);
