const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

/** Peruvian DNI: exactly 8 digits. */
export function isValidDni(dni: string): boolean {
  return /^\d{8}$/.test(dni.trim());
}

export function isPositiveNumber(value: string | number): boolean {
  const n = typeof value === 'string' ? Number(value) : value;
  return Number.isFinite(n) && n > 0;
}

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}
