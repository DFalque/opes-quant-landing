/**
 * Build-time configuration. Public env vars (prefixed with PUBLIC_) are
 * inlined into the client bundle by Astro/Vite; non-public vars are only
 * available server-side.
 *
 * API_BASE: absolute URL of the FastAPI backend.
 *   - dev (vite dev server): empty string → same-origin via Vite proxy.
 *   - prod (GitHub Pages): absolute URL of the API (set via env var at build time).
 *
 * Override at build time:
 *   PUBLIC_API_BASE=https://api.example.com npm run build
 */

export const API_BASE: string =
  // import.meta.env is replaced at build time with the actual value
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (import.meta as any).env?.PUBLIC_API_BASE ?? '';

export const APP_NAME = 'opes-quant-dashboard';
