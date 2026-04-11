/**
 * Playwright config for the AEGIS wiki widget tests (PDCA cycle 3).
 *
 * These tests validate the semantic-search widget JS in isolation — no
 * mkdocs serve and no backend required. The widget is loaded via data URI
 * with the real JS + CSS files, and the /api/rag/semantic-search endpoint
 * is mocked via page.route().
 *
 * Run from the repo root:
 *   cd wiki/tests-e2e
 *   npx --prefix ../../frontend playwright test
 *
 * Or from wiki/:
 *   npx --prefix ../frontend playwright test tests-e2e/
 *
 * We reuse @playwright/test from frontend/node_modules to avoid duplicating
 * a 300MB browser install just for these tests.
 */

const path = require('path');

module.exports = {
  testDir: '.',
  testMatch: '**/*.spec.js',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    // Allow file:// and data: URIs (widget is loaded inline)
    bypassCSP: true,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        // Use the bundled Chromium from @playwright/test
        browserName: 'chromium',
      },
    },
  ],
};
