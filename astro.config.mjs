// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// Site config for GitHub Pages. Both vars come from env at build time:
//   SITE_URL: full site URL (e.g. "https://opes.example.com"). If set,
//     used as `site` and `base: '/'`.
//   BASE_PATH: subpath under the domain (e.g. "/opes-quant-dashboard" for
//     project pages on *.github.io). Default '/'.
//
//   Examples:
//     - Custom domain:  SITE_URL=https://opes.example.com
//     - Project page:   SITE_URL=https://DFalque.github.io/opes-quant-landing
//     - Local dev:      (no env vars, defaults apply)
const siteUrl = process.env.SITE_URL;
const basePath = process.env.BASE_PATH || '/';

export default defineConfig({
  output: 'static',
  site: siteUrl,
  base: basePath,
  integrations: [
    react(),
    tailwind({ applyBaseStyles: true }),
  ],
  server: {
    host: '0.0.0.0',
    port: 4321,
    // In dev, proxy /api/* to the FastAPI backend (so the frontend can
    // call relative URLs even when running standalone).
    proxy: {
      '/api': {
        target: process.env.PUBLIC_API_BASE?.replace(/\/api$/, '') || 'http://127.0.0.1:8765',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  vite: {
    server: {
      hmr: { overlay: false },
    },
  },
});
