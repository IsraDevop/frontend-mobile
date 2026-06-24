import { api, RequestConfig } from '@/services/client';
import { clearTokens, saveTokens } from '@/services/tokens';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserProfile,
} from '@/types/api';

const PUBLIC: RequestConfig = { skipAuth: true };

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', payload, PUBLIC);
  await saveTokens({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });
  return data;
}

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  const body: RegisterRequest = { role: 'USER', ...payload };
  const { data } = await api.post<AuthResponse>('/auth/register', body, PUBLIC);
  if (data.accessToken) {
    await saveTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
  }
  return data;
}

export async function getCurrentUser(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>('/users/me');
  return data;
}

export async function logout(): Promise<void> {
  await clearTokens();
}
