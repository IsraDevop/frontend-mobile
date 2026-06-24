/** Formats a numeric amount as Peruvian soles (PEN). */
export function formatCurrency(amount?: number | null): string {
  if (amount == null || Number.isNaN(amount)) return 'S/ —';
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  }).format(amount);
}

/** Formats an ISO date string into a short readable date. */
export function formatDate(iso?: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/** Returns a human-friendly countdown like "2d 4h" or "Finalizada". */
export function timeRemaining(iso?: string | null): string {
  if (!iso) return '';
  const end = new Date(iso).getTime();
  const diff = end - Date.now();
  if (Number.isNaN(end)) return '';
  if (diff <= 0) return 'Finalizada';
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
