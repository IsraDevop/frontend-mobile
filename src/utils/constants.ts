import Constants from 'expo-constants';

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, unknown>;

/** Base URL of the Yala REST backend. */
export const API_URL: string =
  (extra.apiUrl as string) ?? 'https://yala.dpdns.org/api/v1';

/**
 * DNI verification mode.
 * - 'demo': local simulation, never exposes the Didit API key.
 * - 'backend': calls POST /identity/verify-dni (backend proxies Didit server-side).
 */
export const DNI_VERIFICATION_MODE: 'demo' | 'backend' =
  (extra.dniVerificationMode as 'demo' | 'backend') ?? 'demo';

/** SecureStore keys (alphanumeric + ._- only). */
export const ACCESS_TOKEN_KEY = 'yala.accessToken';
export const REFRESH_TOKEN_KEY = 'yala.refreshToken';

export const REQUEST_TIMEOUT = 15000;
export const DEFAULT_PAGE_SIZE = 12;

/** Default map region centered on Lima, Peru. */
export const DEFAULT_REGION = {
  latitude: -12.0464,
  longitude: -77.0428,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};
