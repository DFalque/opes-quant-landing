/**
 * Playwright e2e: login flow + dashboard navigation.
 *
 * Requires the FastAPI backend to be running on http://127.0.0.1:8765
 * with OPES_QUANT_DASHBOARD_DATA_DIR pointing to a writable directory
 * (and an admin user seeded). The playwright.config.ts `webServer`
 * starts the backend automatically.
 */
import { expect, test } from '@playwright/test';

test.describe('static pages', () => {
  test('root renders the dashboard directly', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('h2', { hasText: 'Dashboard' })).toBeVisible();
  });

  test('login page renders with form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h2', { hasText: 'Iniciar sesión' })).toBeVisible();
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
    await expect(page.locator('[data-testid="username-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
  });

  test('dashboard page renders (without auth: API calls fail but page loads)', async ({ page }) => {
    const response = await page.goto('/dashboard');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h2', { hasText: 'Dashboard' })).toBeVisible();
    await expect(page.locator('text=opes-quant')).toBeVisible();
  });

  test('sidebar navigation is present on all dashboard pages', async ({ page }) => {
    await page.goto('/dashboard');
    const links = ['Dashboard', 'Posiciones', 'Sesiones', 'Agente', 'Skills'];
    for (const label of links) {
      await expect(page.locator(`nav a:has-text("${label}")`)).toBeVisible();
    }
  });

  test('skills page renders list (empty or with skills)', async ({ page }) => {
    await page.goto('/skills');
    await expect(page.locator('h2', { hasText: 'Skills' })).toBeVisible();
  });

  test('drafts page renders', async ({ page }) => {
    await page.goto('/skills/drafts');
    await expect(page.locator('h2', { hasText: 'Borradores' })).toBeVisible();
  });

  test('SPA fallback: /skills/<name>/edit returns the edit placeholder', async ({ page }) => {
    const response = await page.goto('/skills/technical-analysis/edit');
    expect(response?.status()).toBe(200);
    // Verify the initial HTML contains the editor template marker.
    const html = await response!.text();
    expect(html).toContain('Editar');
    expect(html).toContain('editor-mount');
  });

  test('dist build includes 404.html (GitHub Pages SPA fallback)', async ({ request }) => {
    // Static check against the built dist. The postbuild script copies
    // dist/index.html → dist/404.html so GitHub Pages serves the SPA
    // fallback for unknown URLs.
    const fs = await import('node:fs');
    const path = await import('node:path');
    const html = await import('node:fs/promises');
    // Playwright runs from the frontend/ directory; dist/ is a sibling of e2e/
    const dist404 = path.resolve(process.cwd(), 'dist', '404.html');
    expect(fs.existsSync(dist404)).toBe(true);
    const content = await html.readFile(dist404, 'utf-8');
    expect(content).toContain('window.location.replace');
  });

  test('SPA fallback: /skills/<name> returns the placeholder template', async ({ page }) => {
    const response = await page.goto('/skills/technical-analysis');
    expect(response?.status()).toBe(200);
    // Verify the initial HTML contains the placeholder template marker.
    // (After the JS runs, the content is replaced with API data or an error,
    // depending on auth state. We just check the server response.)
    const html = await response!.text();
    expect(html).toContain('Cargando');
    expect(html).toContain('skill-detail');
  });

  test('positions page renders', async ({ page }) => {
    await page.goto('/dashboard/positions');
    await expect(page.locator('h2', { hasText: 'Posiciones' })).toBeVisible();
  });

  test('sessions page renders', async ({ page }) => {
    await page.goto('/dashboard/sessions');
    await expect(page.locator('h2', { hasText: 'Sesiones' })).toBeVisible();
  });

  test('agent page renders', async ({ page }) => {
    await page.goto('/dashboard/agent');
    await expect(page.locator('h2', { hasText: 'Métricas' })).toBeVisible();
  });

  test('landing draft renders and its method is interactive', async ({ page }) => {
    await page.goto('/landing');
    await expect(page.locator('h1', { hasText: 'Todos los mercados.' })).toBeVisible();
    await expect(page.locator('text=SESSION / DEMO')).toBeVisible();

    await page.getByRole('link', { name: 'El método' }).click();
    await expect(page).toHaveURL(/\/landing#metodo$/);
    await page.getByRole('button', { name: 'Decidir' }).click();
    await expect(page.locator('h3', { hasText: 'Todo converge en una dirección.' })).toBeVisible();

    const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(horizontalOverflow).toBe(false);
  });

  test('landing draft navigation works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/landing');
    await page.getByRole('button', { name: 'Abrir menú' }).click();
    await expect(page.getByRole('link', { name: 'El sistema', exact: true })).toBeVisible();
    await page.getByRole('link', { name: 'El sistema', exact: true }).click();
    await expect(page).toHaveURL(/\/landing#sistema$/);
  });

  test('landing services link to their own detail pages', async ({ page }) => {
    await page.goto('/landing');
    const services = [
      ['Signal', 'signal'],
      ['Atlas', 'atlas'],
      ['Lens', 'lens'],
      ['Wave', 'wave'],
      ['Flux', 'flux'],
      ['Cortex', 'cortex'],
      ['Reflex', 'reflex'],
      ['Vision', 'vision'],
      ['Link', 'link'],
    ] as const;

    await page.locator('#servicios').scrollIntoViewIfNeeded();
    for (const [name, slug] of services) {
      const serviceLink = page.getByRole('link', { name: `Saber más sobre ${name}` });
      await expect(serviceLink).toBeVisible();
      await expect(serviceLink).toHaveAttribute('href', `/landing/${slug}`);
    }

    await expect(page.getByRole('link', { name: 'Saber más sobre OPES Intelligence' })).toHaveAttribute('href', '/landing/opes-intelligence');

    await page.getByRole('link', { name: 'Saber más sobre Signal' }).click();
    await expect(page).toHaveURL(/\/landing\/signal$/);
    await expect(page.locator('h1', { hasText: 'Signal' })).toBeVisible();
    await expect(page.getByText('Aprender del pasado para mirar hacia delante.')).toBeVisible();
  });
});

test.describe('API smoke', () => {
  test('GET /api/health returns ok or degraded', async ({ request }) => {
    const r = await request.get('/api/health');
    expect(r.status()).toBe(200);
    const body = await r.json();
    expect(body.status).toMatch(/^(ok|degraded)$/);
    expect(body.version).toBeTruthy();
  });

  test('GET /api/auth/me without auth returns 401', async ({ request }) => {
    const r = await request.get('/api/auth/me');
    expect(r.status()).toBe(401);
  });
});
