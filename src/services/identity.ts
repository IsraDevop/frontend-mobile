import { api } from '@/services/client';
import { DNI_VERIFICATION_MODE } from '@/utils/constants';
import { isValidDni } from '@/utils/validation';
import { DniVerificationRequest, DniVerificationResult } from '@/types/api';

/**
 * Verifies a Peruvian DNI.
 *
 * SECURITY: the Didit API key must NEVER live in the mobile bundle (CLAUDE.md #13).
 * In 'backend' mode the request hits POST /identity/verify-dni and the Spring
 * backend injects the `x-api-key` server-side before calling Didit
 * (https://verification.didit.me/v3/database-validation/).
 *
 * In 'demo' mode we validate format locally and simulate the response so the
 * feature is demonstrable without exposing any secret.
 */
export async function verifyDni(
  req: DniVerificationRequest,
): Promise<DniVerificationResult> {
  if (DNI_VERIFICATION_MODE === 'backend') {
    const { data } = await api.post<DniVerificationResult>(
      '/identity/verify-dni',
      req,
    );
    return data;
  }
  return demoVerify(req);
}

function demoVerify(
  req: DniVerificationRequest,
): Promise<DniVerificationResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (isValidDni(req.personalNumber)) {
        resolve({
          status: 'Approved',
          matchType: 'full_match',
          message: 'DNI verificado correctamente (modo demo).',
        });
      } else {
        resolve({
          status: 'Declined',
          matchType: 'no_match',
          message: 'El número de DNI debe tener 8 dígitos.',
        });
      }
    }, 1200);
  });
}
