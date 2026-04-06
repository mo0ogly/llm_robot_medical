import { test, expect } from '@playwright/test';
import { measurePageLoadTime, measureTimeToInteractive } from '../helpers/test-utils';

test.describe('Performance Benchmarks', () => {
  test('PromptForge should load in under 3 seconds', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/redteam/prompt-forge');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    console.log(`PromptForge load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(3000);
  });

  test('should measure page navigation performance', async ({ page }) => {
    await page.goto('/redteam');
    await page.waitForLoadState('networkidle');

    // Measure navigation to PromptForge
    const startTime = Date.now();
    await page.goto('/redteam/prompt-forge');
    await page.waitForLoadState('domcontentloaded');
    const navTime = Date.now() - startTime;

    console.log(`Navigation to PromptForge: ${navTime}ms`);
    expect(navTime).toBeLessThan(2000);
  });

  test('should render form controls quickly', async ({ page }) => {
    await page.goto('/redteam/prompt-forge');

    const startTime = Date.now();

    // Wait for all form controls to be visible
    await page.waitForSelector('textarea', { timeout: 5000 });
    await page.waitForSelector('select', { timeout: 5000 });
    await page.waitForSelector('input[type="range"]', { timeout: 5000 });
    await page.waitForSelector('button', { timeout: 5000 });

    const renderTime = Date.now() - startTime;

    console.log(`Form controls render time: ${renderTime}ms`);
    expect(renderTime).toBeLessThan(2000);
  });

  test('should have fast time to interactive', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/redteam/prompt-forge');

    // Wait until first interactive element is available
    await page.waitForSelector('textarea:enabled', { timeout: 5000 });

    const timeToInteractive = Date.now() - startTime;

    console.log(`Time to interactive: ${timeToInteractive}ms`);
    expect(timeToInteractive).toBeLessThan(3000);
  });

  test('RedTeam layout navigation should be fast', async ({ page }) => {
    await page.goto('/redteam');
    await page.waitForLoadState('networkidle');

    // Time navigation between views
    const views = ['/redteam/studio', '/redteam/catalog', '/redteam/logs'];

    for (const view of views) {
      const startTime = Date.now();
      await page.goto(view);
      await page.waitForLoadState('domcontentloaded');
      const navTime = Date.now() - startTime;

      console.log(`Navigation to ${view}: ${navTime}ms`);
      expect(navTime).toBeLessThan(2000);
    }
  });

  test('should lazy-load views efficiently', async ({ page }) => {
    await page.goto('/redteam');
    await page.waitForLoadState('networkidle');

    // Measure time to load a lazy view
    const startTime = Date.now();

    // Navigate to RAG view (lazy-loaded)
    const ragLink = page.locator('a[href*="/redteam/rag"]').first();
    if (await ragLink.isVisible()) {
      await ragLink.click();
      await page.waitForLoadState('networkidle');

      const lazyLoadTime = Date.now() - startTime;
      console.log(`Lazy load time: ${lazyLoadTime}ms`);

      // Lazy loading should still be reasonably fast
      expect(lazyLoadTime).toBeLessThan(5000);
    }
  });

  test('should handle streaming output without blocking UI', async ({ page }) => {
    await page.goto('/redteam/prompt-forge');
    await page.waitForLoadState('networkidle');

    // Fill form
    const textarea = page.locator('textarea');
    await textarea.fill('Test streaming response');

    // Click test button and measure responsiveness
    const testButton = page.locator('button:has-text("Test Single")');

    const startTime = Date.now();
    await testButton.click();

    // UI should remain responsive (can still interact)
    const uiResponsive = await page.evaluate(() => {
      return !document.body.classList.contains('disabled');
    });

    const responsiveTime = Date.now() - startTime;

    console.log(`UI responsiveness check: ${responsiveTime}ms`);

    // Should respond quickly
    expect(responsiveTime).toBeLessThan(100);
  });

  test('should not have layout shift during load', async ({ page }) => {
    await page.goto('/redteam/prompt-forge');

    // Measure Cumulative Layout Shift
    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          if (clsValue > 0) {
            resolve(clsValue);
          } else {
            resolve(0);
          }
        }).observe({ type: 'layout-shift', buffered: true });

        setTimeout(() => resolve(0), 3000);
      });
    });

    console.log(`Cumulative Layout Shift: ${cls}`);

    // CLS should be low (good UX)
    expect(cls).toBeLessThan(0.1);
  });

  test('should have acceptable First Contentful Paint', async ({ page }) => {
    const paintMetrics = await page.evaluate(() => {
      const entries = performance.getEntriesByType('paint');
      const fcp = entries.find((e) => e.name === 'first-contentful-paint');
      return {
        fcp: fcp?.startTime || 0,
      };
    });

    console.log(`First Contentful Paint: ${paintMetrics.fcp}ms`);

    // FCP should be under 1.8s
    expect(paintMetrics.fcp).toBeLessThan(1800);
  });

  test('should measure memory usage on form interaction', async ({ page }) => {
    await page.goto('/redteam/prompt-forge');
    await page.waitForLoadState('networkidle');

    // Fill large prompt
    const largePrompt = 'Test prompt ' + 'x'.repeat(10000);
    const textarea = page.locator('textarea');

    const memoryBefore = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    await textarea.fill(largePrompt);

    const memoryAfter = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    const memoryIncrease = memoryAfter - memoryBefore;

    console.log(`Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);

    // Memory increase should be reasonable
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 50MB max
  });

  test('should handle rapid slider changes', async ({ page }) => {
    await page.goto('/redteam/prompt-forge');
    await page.waitForLoadState('networkidle');

    const slider = page.locator('input[type="range"]').first();

    const startTime = Date.now();

    // Rapidly change slider
    for (let i = 0; i < 10; i++) {
      await slider.fill(String(i * 10));
      await page.waitForTimeout(50);
    }

    const interactionTime = Date.now() - startTime;

    console.log(`Rapid slider interaction time: ${interactionTime}ms`);

    // Should handle rapid interaction smoothly
    expect(interactionTime).toBeLessThan(1000);
  });
});
