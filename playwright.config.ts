import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:8765',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'cd ../backend && OPES_QUANT_DASHBOARD_DATA_DIR=/tmp/dash_e2e OPES_QUANT_DASHBOARD_DB_URL=sqlite:////tmp/dash_e2e/db.sqlite .venv/bin/python -m uvicorn opes_quant_dashboard.main:app --host 127.0.0.1 --port 8765 --log-level error',
    url: 'http://127.0.0.1:8765/api/health',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
    env: {
      OPES_QUANT_DASHBOARD_DATA_DIR: '/tmp/dash_e2e',
      OPES_QUANT_DASHBOARD_DB_URL: 'sqlite:////tmp/dash_e2e/db.sqlite',
    },
  },
});
