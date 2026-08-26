export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number, fractionDigits = 2): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(fractionDigits)}%`;
}

export function formatNumber(value: number, fractionDigits = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

export function pnlColor(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'text-muted';
  if (value > 0) return 'text-profit';
  if (value < 0) return 'text-loss';
  return 'text-muted';
}

/**
 * Format seconds as a compact duration: "1h 23m 45s", "4m 12s", or "45s".
 * Returns "—" for null/undefined/zero.
 */
export function formatDuration(seconds: number | null | undefined): string {
  if (seconds == null || seconds === 0) return '—';
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

/**
 * Format token count as compact: "1.2K", "14.3K", "1.04M", "850".
 * Returns "—" for null/undefined/zero.
 */
export function formatTokens(value: number | null | undefined): string {
  if (value == null || value === 0) return '—';
  if (value < 1000) return String(value);
  if (value < 1_000_000) return `${(value / 1000).toFixed(value < 10_000 ? 1 : 0)}K`;
  return `${(value / 1_000_000).toFixed(2)}M`;
}

/**
 * Format a USD cost: "$0.0123" for sub-dollar, "$1.23" otherwise.
 * Returns "—" for null/undefined/zero.
 */
export function formatCostUsd(value: number | null | undefined): string {
  if (value == null || value === 0) return '—';
  if (value < 1) return `$${value.toFixed(4)}`;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a runtime in seconds as a longer duration for chart axes / tooltips.
 * Same logic as formatDuration but allows 0 to display as "0s" (not em-dash).
 */
export function formatRuntime(seconds: number): string {
  if (seconds === 0) return '0s';
  return formatDuration(seconds);
}
