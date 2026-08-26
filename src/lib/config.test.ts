import { describe, expect, it } from 'vitest';
import { API_BASE } from './config';

describe('config', () => {
  it('API_BASE defaults to empty string (same-origin in dev)', () => {
    expect(API_BASE).toBe('');
  });
});
