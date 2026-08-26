import { describe, expect, it } from 'vitest';
import {
  formatCostUsd,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatDuration,
  formatNumber,
  formatPercent,
  formatRuntime,
  formatTokens,
  pnlColor,
} from './format';

describe('formatCurrency', () => {
  it('formats positive USD', () => {
    expect(formatCurrency(1234.5)).toBe('$1,234.50');
  });
  it('formats negative USD', () => {
    expect(formatCurrency(-100)).toBe('-$100.00');
  });
  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });
  it('supports custom currency', () => {
    expect(formatCurrency(100, 'EUR')).toMatch(/€/);
  });
});

describe('formatPercent', () => {
  it('adds + sign to positive', () => {
    expect(formatPercent(2.5)).toBe('+2.50%');
  });
  it('keeps - sign on negative', () => {
    expect(formatPercent(-1.2)).toBe('-1.20%');
  });
  it('zero is +0.00%', () => {
    expect(formatPercent(0)).toBe('+0.00%');
  });
});

describe('formatNumber', () => {
  it('formats with decimals', () => {
    expect(formatNumber(1234.5678, 2)).toBe('1,234.57');
  });
  it('formats with zero decimals', () => {
    expect(formatNumber(1234, 0)).toBe('1,234');
  });
});

describe('formatDateTime / formatDate', () => {
  it('formats a valid ISO date', () => {
    const out = formatDateTime('2026-05-29T15:00:00Z');
    expect(out).toMatch(/2026/);
    expect(out).toMatch(/May/);
  });
  it('formats a date only', () => {
    const out = formatDate('2026-05-29T15:00:00Z');
    expect(out).toMatch(/2026/);
    expect(out).toMatch(/May/);
  });
  it('returns original on invalid input', () => {
    expect(formatDateTime('garbage')).toBe('garbage');
  });
});

describe('pnlColor', () => {
  it('profit for positive', () => {
    expect(pnlColor(10)).toBe('text-profit');
  });
  it('loss for negative', () => {
    expect(pnlColor(-5)).toBe('text-loss');
  });
  it('muted for null', () => {
    expect(pnlColor(null)).toBe('text-muted');
  });
  it('muted for undefined', () => {
    expect(pnlColor(undefined)).toBe('text-muted');
  });
  it('muted for zero', () => {
    expect(pnlColor(0)).toBe('text-muted');
  });
});

describe('formatDuration', () => {
  it('formats hours/minutes/seconds', () => {
    expect(formatDuration(3725)).toBe('1h 2m 5s');
  });
  it('formats minutes/seconds only', () => {
    expect(formatDuration(252)).toBe('4m 12s');
  });
  it('formats seconds only', () => {
    expect(formatDuration(45)).toBe('45s');
  });
  it('returns em-dash for null', () => {
    expect(formatDuration(null)).toBe('—');
  });
  it('returns em-dash for undefined', () => {
    expect(formatDuration(undefined)).toBe('—');
  });
  it('returns em-dash for zero', () => {
    expect(formatDuration(0)).toBe('—');
  });
  it('handles negative as zero', () => {
    expect(formatDuration(-5)).toBe('0s');
  });
});

describe('formatTokens', () => {
  it('formats small numbers raw', () => {
    expect(formatTokens(850)).toBe('850');
  });
  it('formats thousands with 1 decimal under 10K', () => {
    expect(formatTokens(1200)).toBe('1.2K');
  });
  it('formats thousands with 0 decimals over 10K', () => {
    expect(formatTokens(14300)).toBe('14K');
  });
  it('formats millions with 2 decimals', () => {
    expect(formatTokens(1_040_000)).toBe('1.04M');
  });
  it('returns em-dash for null/undefined/zero', () => {
    expect(formatTokens(null)).toBe('—');
    expect(formatTokens(undefined)).toBe('—');
    expect(formatTokens(0)).toBe('—');
  });
});

describe('formatCostUsd', () => {
  it('formats sub-dollar with 4 decimals', () => {
    expect(formatCostUsd(0.0123)).toBe('$0.0123');
  });
  it('formats >= $1 with 2 decimals', () => {
    expect(formatCostUsd(1.5)).toBe('$1.50');
  });
  it('returns em-dash for null/undefined/zero', () => {
    expect(formatCostUsd(null)).toBe('—');
    expect(formatCostUsd(undefined)).toBe('—');
    expect(formatCostUsd(0)).toBe('—');
  });
});

describe('formatRuntime', () => {
  it('shows 0s for zero', () => {
    expect(formatRuntime(0)).toBe('0s');
  });
  it('delegates to formatDuration for non-zero', () => {
    expect(formatRuntime(3725)).toBe('1h 2m 5s');
  });
});
