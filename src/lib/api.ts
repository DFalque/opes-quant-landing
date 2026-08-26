/**
 * HTTP client for the FastAPI backend.
 *
 * - Injects `Authorization: Basic <base64(user:pass)>` from localStorage on every request.
 * - In dev, Vite proxies `/api/*` to the FastAPI server. In prod (GitHub Pages),
 *   the API base is read from `PUBLIC_API_BASE` (see `lib/config.ts`).
 * - Throws `ApiError` on non-2xx so callers can branch on `error.status`.
 */

import { ApiError, type HealthStatus, type User } from './types';
import { API_BASE } from './config';

export { ApiError };
export type { HealthStatus, User };

const STORAGE_KEY = 'opes_auth';

export interface Auth {
  username: string;
  password: string;
}

function encodeBasic(auth: Auth): string {
  return btoa(`${auth.username}:${auth.password}`);
}

export function getStoredAuth(): Auth | null {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Auth;
  } catch {
    return null;
  }
}

export function setStoredAuth(auth: Auth | null): void {
  if (typeof localStorage === 'undefined') return;
  if (auth === null) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  }
}

export interface RequestOpts {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  auth?: Auth | null;
}

export async function apiFetch<T>(path: string, opts: RequestOpts = {}): Promise<T> {
  const { method = 'GET', body, query, auth } = opts;
  const usedAuth = auth === undefined ? getStoredAuth() : auth;

  const url = new URL(`${API_BASE}${path}`, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== '') {
        url.searchParams.set(k, String(v));
      }
    }
  }

  const headers: Record<string, string> = {};
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (usedAuth) {
    headers['Authorization'] = `Basic ${encodeBasic(usedAuth)}`;
  }

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: 'same-origin',
  });

  const text = await res.text();
  let parsed: unknown = null;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  }

  if (!res.ok) {
    throw new ApiError(res.status, parsed, `HTTP ${res.status} on ${method} ${path}`);
  }
  return parsed as T;
}

export async function apiWithCreds<T>(
  path: string,
  username: string,
  password: string,
  opts: Omit<RequestOpts, 'auth'> = {},
): Promise<T> {
  return apiFetch<T>(path, { ...opts, auth: { username, password } });
}

export const api = {
  health: () => apiFetch<HealthStatus>('/api/health'),

  me: (_opts?: Record<string, never>, creds?: { username: string; password: string }) => {
    if (creds) {
      return apiFetch<User>('/api/auth/me', { auth: creds });
    }
    return apiFetch<User>('/api/auth/me');
  },
  meWithCreds: (username: string, password: string) =>
    apiFetch<User>('/api/auth/me', { auth: { username, password } }),
  changePassword: (current: string, next: string) =>
    apiFetch<User>('/api/auth/change-password', {
      method: 'POST',
      body: { current_password: current, new_password: next },
    }),

  portfolio: () => apiFetch<import('./types').PortfolioSummary>('/api/portfolio'),
  equityCurve: (range: '1w' | '1m' | '3m' | 'ytd' | 'all' = 'all') =>
    apiFetch<import('./types').EquityCurvePoint[]>('/api/portfolio/equity-curve', {
      query: { range },
    }),

  positions: (params: {
    status?: 'open' | 'closed' | 'cancelled';
    ticker?: string;
    from?: string;
    to?: string;
    limit?: number;
    offset?: number;
  } = {}) =>
    apiFetch<import('./types').PositionList>('/api/positions', { query: params }),

  orders: (params: {
    ticker?: string;
    side?: 'buy' | 'sell';
    status?: string;
    from?: string;
    to?: string;
    limit?: number;
    offset?: number;
  } = {}) =>
    apiFetch<import('./types').OrderList>('/api/orders', { query: params }),

  analyses: (params: { ticker?: string; skill?: string; from?: string; to?: string; limit?: number; offset?: number } = {}) =>
    apiFetch<import('./types').AnalysisList>('/api/analyses', { query: params }),
  analysesByTicker: (ticker: string, params: { limit?: number; offset?: number } = {}) =>
    apiFetch<import('./types').AnalysisList>(`/api/analyses/${ticker}`, { query: params }),
  analysisDetail: (ticker: string, id: number) =>
    apiFetch<import('./types').AnalysisDetail>(`/api/analyses/${ticker}/${id}`),

  agentMetrics: (params: { model?: string; from?: string; to?: string; limit?: number } = {}) =>
    apiFetch<import('./types').AgentMetric[]>('/api/agent/metrics', { query: params }),
  agentMetricsSummary: (range: '1d' | '1w' | '1m' | 'all' = '1w') =>
    apiFetch<import('./types').AgentSummary>('/api/agent/metrics/summary', { query: { range } }),
  agentSessions: (params: { status?: string; limit?: number } = {}) =>
    apiFetch<import('./types').AgentSession[]>('/api/agent/sessions', { query: params }),
  agentSession: (id: number) =>
    apiFetch<import('./types').AgentSession>(`/api/agent/sessions/${id}`),
  agentSessionByKey: (key: string) =>
    apiFetch<import('./types').AgentSession>(
      `/api/agent/sessions/${encodeURIComponent(key)}`,
    ),

  skills: () => apiFetch<import('./types').Skill[]>('/api/skills'),
  skill: (name: string) => apiFetch<import('./types').Skill>(`/api/skills/${name}`),
  drafts: (status?: string) =>
    apiFetch<import('./types').SkillDraft[]>('/api/skills/_drafts/list', {
      query: status ? { status_filter: status } : {},
    }),
  createDraft: (name: string, body: { frontmatter_yaml: string; body_markdown: string; bump_type: 'patch' | 'minor' | 'major' }) =>
    apiFetch<import('./types').SkillDraft>(`/api/skills/${name}/draft`, {
      method: 'POST',
      body,
    }),
};
