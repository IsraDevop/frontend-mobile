import { AxiosError } from 'axios';

export type ApiErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'SERVER_ERROR'
  | 'CANCELED'
  | 'UNKNOWN';

/** Normalized error surfaced to the UI layer. `message` is already user-friendly. */
export class ApiError extends Error {
  status: number;
  code: ApiErrorCode;
  details?: unknown;

  constructor(message: string, status: number, code: ApiErrorCode, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function messageForStatus(status: number, serverMessage?: string): string {
  if (serverMessage && status >= 400 && status < 500) return serverMessage;
  if (status === 401) return 'Tu sesión expiró. Vuelve a iniciar sesión.';
  if (status === 403) return 'No tienes permisos para realizar esta acción.';
  if (status === 404) return 'No encontramos lo que buscas.';
  if (status === 409) return serverMessage ?? 'Hubo un conflicto con tu solicitud.';
  if (status === 422 || status === 400) return serverMessage ?? 'Revisa los datos ingresados.';
  if (status >= 500) return 'El servidor no está disponible. Inténtalo más tarde.';
  return serverMessage ?? 'Ocurrió un error inesperado.';
}

/** Converts any axios failure into a consistent ApiError with a Spanish message. */
export function normalizeAxiosError(error: AxiosError): ApiError {
  if (error.code === 'ERR_CANCELED') {
    return new ApiError('Solicitud cancelada.', 0, 'CANCELED');
  }
  if (error.code === 'ECONNABORTED') {
    return new ApiError(
      'La conexión tardó demasiado. Verifica tu internet e inténtalo de nuevo.',
      0,
      'TIMEOUT',
    );
  }
  if (!error.response) {
    return new ApiError(
      'Sin conexión. Verifica tu red e inténtalo de nuevo.',
      0,
      'NETWORK_ERROR',
    );
  }

  const { status, data } = error.response;
  const serverMessage =
    (data as { message?: string; error?: string })?.message ??
    (data as { error?: string })?.error;

  let code: ApiErrorCode = 'UNKNOWN';
  if (status === 401) code = 'UNAUTHORIZED';
  else if (status === 403) code = 'FORBIDDEN';
  else if (status === 404) code = 'NOT_FOUND';
  else if (status === 400 || status === 422) code = 'VALIDATION';
  else if (status >= 500) code = 'SERVER_ERROR';

  return new ApiError(messageForStatus(status, serverMessage), status, code, data);
}

/** Safely extract a user-facing message from any thrown value. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Ocurrió un error inesperado.';
}
