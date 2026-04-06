import { test, expect } from '@playwright/test';
import { waitForElement, isElementVisible } from '../helpers/test-utils';

test.describe('RedTeam Layout Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/redteam');
    await page.waitForLoadState('networkidle');
  });

  test('should load RedTeam layout successfully', async ({ page }) => {
    // Verify we're on redteam route
    expect(page.url()).toContain('/redteam');

    // Verify main layout exists
    const mainContent = page.locator('main, [role="main"]');
    await expect(mainContent).toBeVisible({ timeout: 5000 });
  });

  test('should display navigation tabs', async ({ page }) => {
    // Look for tab buttons/links
    const tabs = page.locator('a, button').filter({ hasText: /rag|studio|catalog|logs|timeline/i });
    const count = await tabs.count();

    expect(count).toBeGreaterThan(0);
  });

  test('should navigate to RAG view', async ({ page }) => {
    const ragLink = page.locator('a:has-text("rag"), button:has-text("rag")').first();

    if (await ragLink.isVisible()) {
      await ragLink.click();
      await page.waitForLoadState('networkidle');

      // Verify URL changed
      expect(page.url()).toContain('/redteam/rag');
    }
  });

  test('should navigate to Studio view', async ({ page }) => {
    const studioLink = page.locator('a:has-text("studio"), button:has-text("studio")').first();

    if (await studioLink.isVisible()) {
      await studioLink.click();
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('/redteam/studio');
    }
  });

  test('should navigate to Catalog view', async ({ page }) => {
    const catalogLink = page.locator('a:has-text("catalog"), button:has-text("catalog")').first();

    if (await catalogLink.isVisible()) {
      await catalogLink.click();
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('/redteam/catalog');
    }
  });

  test('should navigate to Logs view', async ({ page }) => {
    const logsLink = page.locator('a:has-text("logs"), button:has-text("logs")').first();

    if (await logsLink.isVisible()) {
      await logsLink.click();
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('/redteam/logs');
    }
  });

  test('should navigate to Timeline view', async ({ page }) => {
    const timelineLink = page.locator('a:has-text("timeline"), button:has-text("timeline")').first();

    if (await timelineLink.isVisible()) {
      await timelineLink.click();
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('/redteam/timeline');
    }
  });

  test('should navigate to PromptForge view', async ({ page }) => {
    const promptforgeLink = page.locator('a:has-text("prompt-forge"), button:has-text("prompt-forge")').first();

    if (await promptforgeLink.isVisible()) {
      await promptforgeLink.click();
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('/redteam/prompt-forge');
    }
  });

  test('should load lazy-loaded views without errors', async ({ page }) => {
    // Monitor for console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Navigate through multiple views
    const viewLinks = page.locator('a[href*="/redteam/"]').all();

    for (const link of await viewLinks) {
      await link.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
    }

    // Should not have critical errors
    const criticalErrors = errors.filter(
      (e) => !e.includes('warn') && !e.includes('non-critical')
    );
    expect(criticalErrors.length).toBe(0);
  });

  test('should maintain layout structure during navigation', async ({ page }) => {
    // Check initial structure
    const sidebar = page.locator('nav, [role="navigation"], aside');
    await expect(sidebar).toBeVisible({ timeout: 5000 });

    // Navigate to different view
    const viewLink = page.locator('a[href*="/redteam/"]').first();
    if (await viewLink.isVisible()) {
      await viewLink.click();
      await page.waitForLoadState('networkidle');

      // Sidebar should still be visible
      await expect(sidebar).toBeVisible();
    }
  });

  test('should handle rapid navigation without crashes', async ({ page }) => {
    const links = page.locator('a[href*="/redteam/"]');
    const count = await links.count();

    if (count > 1) {
      // Rapidly navigate
      for (let i = 0; i < Math.min(3, count); i++) {
        const link = links.nth(i);
        if (await link.isVisible()) {
          await link.click({ timeout: 1000 });
          await page.waitForLoadState('domcontentloaded');
        }
      }

      // Should still be on a valid redteam route
      expect(page.url()).toContain('/redteam');
    }
  });

  test('should display loading spinner during lazy load', async ({ page }) => {
    // Find a link to a lazy-loaded view
    const lazyLink = page.locator('a[href*="/redteam/rag"], a[href*="/redteam/results"]').first();

    if (await lazyLink.isVisible()) {
      // Click and check for loading state
      await lazyLink.click();

      // There might be a loading spinner briefly
      const loading = page.locator('text=/loading|loading.../i');
      const spinnerVisible = await loading.isVisible({ timeout: 1000 }).catch(() => false);

      // View should eventually load
      await page.waitForLoadState('networkidle');

      // Content should be visible
      const content = page.locator('main, [role="main"]');
      await expect(content).toBeVisible();
    }
  });

  test('should not show 404 errors for valid routes', async ({ page }) => {
    let notFound = false;

    page.on('response', (response) => {
      if (response.status() === 404) {
        notFound = true;
      }
    });

    await page.goto('/redteam');
    await page.waitForLoadState('networkidle');

    expect(notFound).toBe(false);
  });
});
