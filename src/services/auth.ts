import { api, RequestConfig } from '@/services/client';
import { clearTokens, saveTokens } from '@/services/tokens';
import {
  AuthResponse,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  UserProfile,
} from '@/types/api';

const PUBLIC: RequestConfig = { skipAuth: true };

function extractTokens(data: AuthResponse): AuthTokens {
  const accessToken =
    data.accessToken ?? data.token ?? (data as { access_token?: string }).access_token ?? '';
  const refreshToken =
    data.refreshToken ?? (data as { refresh_token?: string }).refresh_token ?? '';
  return { accessToken, refreshToken };
}

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', payload, PUBLIC);
  await saveTokens(extractTokens(data));
  return data;
}

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  const body: RegisterRequest = { role: 'USER', ...payload };
  const { data } = await api.post<AuthResponse>('/auth/register', body, PUBLIC);
  const tokens = extractTokens(data);
  if (tokens.accessToken) {
    await saveTokens(tokens);
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
