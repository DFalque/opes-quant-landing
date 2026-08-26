import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { api, getStoredAuth, setStoredAuth, ApiError } from './api';
import type { User } from './types';

describe('stored auth', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
  });

  it('returns null when nothing stored', () => {
    expect(getStoredAuth()).toBeNull();
  });

  it('roundtrips auth via setStoredAuth + getStoredAuth', () => {
    setStoredAuth({ username: 'alice', password: 's3cret' });
    expect(getStoredAuth()).toEqual({ username: 'alice', password: 's3cret' });
  });

  it('clears auth when setStoredAuth(null)', () => {
    setStoredAuth({ username: 'alice', password: 's3cret' });
    setStoredAuth(null);
    expect(getStoredAuth()).toBeNull();
  });
});

describe('apiFetch', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('attaches Basic auth header from localStorage', async () => {
    setStoredAuth({ username: 'bob', password: 'pw' });
    const mock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: 1, username: 'bob', role: 'admin' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', mock);

    const user = await api.me();
    expect(user.username).toBe('bob');
    expect(mock).toHaveBeenCalledTimes(1);
    const [, init] = mock.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Record<string, string>;
    expect(headers['Authorization']).toBe(`Basic ${btoa('bob:pw')}`);
  });

  it('does not attach auth when not stored', async () => {
    const mock = vi.fn().mockResolvedValue(
      new Response('{}', { status: 200 }),
    );
    vi.stubGlobal('fetch', mock);

    await api.health();
    const [, init] = mock.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Record<string, string>;
    expect(headers['Authorization']).toBeUndefined();
  });

  it('throws ApiError on non-2xx with the body parsed', async () => {
    const mock = vi.fn().mockImplementation(
      () =>
        new Response(JSON.stringify({ detail: 'unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }),
    );
    vi.stubGlobal('fetch', mock);

    await expect(api.me()).rejects.toBeInstanceOf(ApiError);
    try {
      await api.me();
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      const err = e as ApiError;
      expect(err.status).toBe(401);
      expect((err.body as { detail: string }).detail).toBe('unauthorized');
    }
  });

  it('appends query params with proper encoding', async () => {
    const mock = vi.fn().mockResolvedValue(
      new Response('{"items":[],"total":0,"open_count":0,"closed_count":0}', {
        status: 200,
      }),
    );
    vi.stubGlobal('fetch', mock);

    await api.positions({ status: 'open', ticker: 'AAPL', limit: 10 });
    const [url] = mock.mock.calls[0] as [string];
    expect(url).toContain('status=open');
    expect(url).toContain('ticker=AAPL');
    expect(url).toContain('limit=10');
  });

  it('omits undefined / empty query params', async () => {
    const mock = vi.fn().mockResolvedValue(
      new Response('{"items":[],"total":0}', { status: 200 }),
    );
    vi.stubGlobal('fetch', mock);

    await api.orders({ status: undefined, ticker: '', side: 'buy' });
    const [url] = mock.mock.calls[0] as [string];
    expect(url).toContain('side=buy');
    expect(url).not.toContain('status=');
    expect(url).not.toContain('ticker=');
  });
});
