import * as SecureStore from 'expo-secure-store';

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/utils/constants';
import { AuthTokens } from '@/types/api';

/**
 * JWT storage backed by Expo SecureStore (Keychain on iOS, Keystore on Android).
 * Tokens are NEVER persisted in AsyncStorage / plain storage (CLAUDE.md #13).
 */
export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function saveTokens(tokens: AuthTokens): Promise<void> {
  if (tokens.accessToken) {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken);
  }
  if (tokens.refreshToken) {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }
}

export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}

export async function hasSession(): Promise<boolean> {
  return (await getAccessToken()) != null;
}
