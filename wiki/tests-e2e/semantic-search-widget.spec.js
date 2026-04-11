/**
 * E2E test for the AEGIS semantic search widget (PDCA cycle 3, P2.5).
 *
 * Strategy: load the widget JS in a minimal HTML page via data URI + mock fetch.
 * This avoids the need for:
 *   - a running mkdocs serve (localhost:8001)
 *   - a running AEGIS backend (localhost:8042)
 *   - a ChromaDB with real data
 *
 * The test validates the widget's behavior against mocked API responses,
 * exercising:
 *   - DOM injection (aegis-semantic-search container receives form + inputs)
 *   - XSS defense (escapeHtml correctly escapes query + title + source)
 *   - Query submission (fetch call with correct body)
 *   - Hit rendering (cards with rank, title, paper_id, similarity)
 *   - Error handling (bad backend URL → user-visible error)
 *   - Backend health check
 *
 * Run from the wiki/ directory with:
 *   npx playwright test tests-e2e/semantic-search-widget.spec.js
 *
 * Reuses @playwright/test from frontend/node_modules (monorepo-style).
 */

const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');

const WIDGET_JS = path.resolve(__dirname, '..', 'docs', 'javascripts', 'semantic-search.js');
const WIDGET_CSS = path.resolve(__dirname, '..', 'docs', 'stylesheets', 'semantic-search.css');

// Read widget files once at suite startup — inlined into the host HTML to
// avoid file:// CORS issues when the test loads from a data: URL.
const widgetJsSource = fs.readFileSync(WIDGET_JS, 'utf8');
const widgetCssSource = fs.readFileSync(WIDGET_CSS, 'utf8');

function getHostHtml() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>AEGIS Widget Test</title>
  <style>${widgetCssSource}</style>
</head>
<body>
  <div id="aegis-semantic-search"></div>
  <script>${widgetJsSource}</script>
</body>
</html>`;
}

test.describe('AEGIS Semantic Search Widget', () => {
  test.beforeEach(async ({ page }) => {
    // Serve the inlined HTML via page.setContent() to avoid file:// CORS
    await page.setContent(getHostHtml(), { waitUntil: 'domcontentloaded' });
    // Widget initialization runs on DOMContentLoaded — give it a beat
    await page.waitForSelector('#aegis-search-form', { timeout: 5000 });
  });

  test('widget renders form with search input and buttons', async ({ page }) => {
    await expect(page.locator('#aegis-query')).toBeVisible();
    await expect(page.locator('#aegis-search-btn')).toBeVisible();
    await expect(page.locator('#aegis-collection')).toBeVisible();
    await expect(page.locator('#aegis-limit')).toBeVisible();
    await expect(page.locator('#aegis-save-backend')).toBeVisible();
    await expect(page.locator('#aegis-check-backend')).toBeVisible();
  });

  test('default backend URL is populated', async ({ page }) => {
    const url = await page.locator('#aegis-backend-url').inputValue();
    expect(url).toMatch(/^https?:\/\/.+/);
  });

  test('collection select has 3 expected options', async ({ page }) => {
    const options = await page.locator('#aegis-collection option').allTextContents();
    expect(options.length).toBe(3);
    expect(options.some((o) => o.includes('aegis_bibliography'))).toBe(true);
    expect(options.some((o) => o.includes('aegis_corpus'))).toBe(true);
    expect(options.some((o) => o.includes('medical_rag'))).toBe(true);
  });

  test('search with mocked hits renders card with all fields', async ({ page }) => {
    // Mock the semantic-search endpoint
    await page.route('**/api/rag/semantic-search', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          query: 'HyDE',
          collection: 'aegis_bibliography',
          total_hits: 2,
          hits: [
            {
              id: 'hit_1',
              source: 'P117_Yoon_2025_HyDE.pdf',
              title: 'Knowledge Leakage in HyDE',
              paper_id: 'P117',
              year: '2025',
              delta_layer: 'δ²',
              distance: 0.312,
              similarity: 0.688,
              content: 'HyDE generates a hypothetical document with multi-line content.\nLine 2.\nLine 3.',
              content_length: 80,
            },
            {
              id: 'hit_2',
              source: 'P081_CaMeL.pdf',
              title: null,
              paper_id: 'P081',
              year: null,
              delta_layer: null,
              distance: 0.55,
              similarity: 0.45,
              content: 'CaMeL provides provable security via capability model.',
              content_length: 54,
            },
          ],
        }),
      });
    });

    await page.locator('#aegis-query').fill('HyDE');
    await page.locator('#aegis-search-btn').click();

    // Wait for results
    await page.waitForSelector('.aegis-hit', { timeout: 5000 });

    const hits = await page.locator('.aegis-hit').count();
    expect(hits).toBe(2);

    // First hit should have all metadata visible
    const firstHit = page.locator('.aegis-hit').first();
    await expect(firstHit.locator('.aegis-rank')).toHaveText('#1');
    await expect(firstHit.locator('.aegis-title')).toContainText('Knowledge Leakage in HyDE');
    await expect(firstHit.locator('.aegis-sim')).toContainText('68.8%');

    // Content should be fully rendered (not truncated — PDCA cycle 2 requirement)
    const content = await firstHit.locator('.aegis-hit-content').innerHTML();
    expect(content).toContain('Line 2');
    expect(content).toContain('Line 3');
    // Newlines converted to <br>
    expect(content).toContain('<br>');
  });

  test('XSS defense: malicious query is escaped in results header', async ({ page }) => {
    await page.route('**/api/rag/semantic-search', async (route) => {
      const body = await route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          query: body.query,
          collection: body.collection,
          total_hits: 0,
          hits: [],
        }),
      });
    });

    // Try to inject a script tag via the query
    const maliciousQuery = '<script>window.xssFired=true</script>';
    await page.locator('#aegis-query').fill(maliciousQuery);
    await page.locator('#aegis-search-btn').click();

    await page.waitForSelector('.aegis-no-results, .aegis-results-header', { timeout: 5000 });

    // Script should NOT have executed
    const xssFired = await page.evaluate(() => window.xssFired === true);
    expect(xssFired).toBe(false);

    // The escaped version should appear in the DOM as text
    const pageContent = await page.content();
    expect(pageContent).not.toContain('<script>window.xssFired');
    // The escaped version (&lt;script&gt;) might appear in an error message
  });

  test('XSS defense: malicious hit title is escaped', async ({ page }) => {
    await page.route('**/api/rag/semantic-search', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          query: 'test',
          collection: 'aegis_bibliography',
          total_hits: 1,
          hits: [
            {
              id: 'hit_xss',
              source: '<img src=x onerror=window.xssViaSource=true>',
              title: '<script>window.xssViaTitle=true</script>',
              paper_id: 'P999',
              year: '2026',
              delta_layer: null,
              distance: 0.1,
              similarity: 0.9,
              content: '<iframe src="javascript:alert(1)"></iframe>',
              content_length: 45,
            },
          ],
        }),
      });
    });

    await page.locator('#aegis-query').fill('test');
    await page.locator('#aegis-search-btn').click();
    await page.waitForSelector('.aegis-hit', { timeout: 5000 });

    // Neither the script nor the img onerror should have executed
    const xssViaTitle = await page.evaluate(() => window.xssViaTitle === true);
    const xssViaSource = await page.evaluate(() => window.xssViaSource === true);
    expect(xssViaTitle).toBe(false);
    expect(xssViaSource).toBe(false);

    // The text should appear escaped in the DOM (no LIVE tags, no LIVE handlers).
    // We check that no unescaped opening tags remain — escaped &lt; is fine.
    const hitHtml = await page.locator('.aegis-hit').first().innerHTML();
    expect(hitHtml).not.toMatch(/<script(\s|>)/);
    expect(hitHtml).not.toMatch(/<iframe(\s|>)/);
    // No live "onerror=" attribute on an img/input/body tag. Escaped forms
    // like "&lt;img...onerror=...&gt;" are fine because they are text.
    expect(hitHtml).not.toMatch(/<(img|input|body|svg)[^>]*onerror=/i);
    // Sanity: the malicious content IS present in escaped form
    expect(hitHtml).toMatch(/&lt;script&gt;/);
  });

  test('network error shows user-visible error message', async ({ page }) => {
    await page.route('**/api/rag/semantic-search', async (route) => {
      await route.abort('failed');
    });

    await page.locator('#aegis-query').fill('anything');
    await page.locator('#aegis-search-btn').click();

    await page.waitForSelector('.aegis-error', { timeout: 5000 });
    const err = await page.locator('.aegis-error').textContent();
    expect(err).toContain('Error');
  });

  test('http error returns user-visible error', async ({ page }) => {
    await page.route('**/api/rag/semantic-search', async (route) => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({ detail: 'Rate limit exceeded: 20 requests per minute per IP.' }),
      });
    });

    await page.locator('#aegis-query').fill('test');
    await page.locator('#aegis-search-btn').click();

    await page.waitForSelector('.aegis-error', { timeout: 5000 });
    const err = await page.locator('.aegis-error').textContent();
    expect(err).toMatch(/429|Error/);
  });

  test('backend health check populates status', async ({ page }) => {
    await page.route('**/api/rag/collections', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          collections: [
            { name: 'aegis_bibliography', chunk_count: 4700 },
            { name: 'aegis_corpus', chunk_count: 4200 },
          ],
        }),
      });
    });

    await page.locator('#aegis-check-backend').click();
    await page.waitForSelector('.aegis-status-ok', { timeout: 5000 });

    const status = await page.locator('.aegis-status-ok').textContent();
    expect(status).toContain('Backend OK');
    expect(status).toContain('aegis_bibliography');
  });
});
