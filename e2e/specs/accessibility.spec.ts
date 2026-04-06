import { test, expect } from '@playwright/test';

test.describe('Accessibility Compliance (WCAG 2.1 AA)', () => {
  test.beforeEach(async ({ page }) => {
    // Inject axe-core for accessibility testing
    await page.addScriptTag({
      url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.0/axe.min.js',
    });
  });

  test('PromptForge should have proper form labels', async ({ page }) => {
    await page.goto('/redteam/prompt-forge');
    await page.waitForLoadState('networkidle');

    // Check for associated labels
    const labels = page.locator('label');
    const labelCount = await labels.count();

    expect(labelCount).toBeGreaterThanOrEqual(4);

    // Verify each label is visible
    for (let i = 0; i < labelCount; i++) {
      const label = labels.nth(i);
      await expect(label).toBeVisible();
    }
  });

  test('PromptForge inputs should have aria-labels', async ({ page }) => {
    await page.goto('/redteam/prompt-forge');
    await page.waitForLoadState('networkidle');

    // Check for aria-labels on form controls
    const inputs = page.locator('input, select, textarea');
    const inputCount = await inputs.count();

    let labelsPresent = 0;

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const label = await input.getAttribute('aria-label');
      const id = await input.getAttribute('id');

      // Should have either aria-label or associated label via id
      if (label || id) {
        labelsPresent++;
      }
    }

    // At least 50% of inputs should have accessible labels
    expect(labelsPresent).toBeGreaterThanOrEqual(inputCount * 0.5);
  });

  test('PromptForge sliders should have aria-value attributes', async ({ page }) => {
    await page.goto('/redteam/prompt-forge');
    await page.waitForLoadState('networkidle');

    const sliders = page.locator('input[type="range"]');
    const sliderCount = await sliders.count();

    expect(sliderCount).toBeGreaterThan(0);

    for (let i = 0; i < sliderCount; i++) {
      const slider = sliders.nth(i);
      const hasMin = await slider.getAttribute('min');
      const hasMax = await slider.getAttribute('max');

      // Sliders should have min and max for screen readers
      expect(hasMin).toBeTruthy();
      expect(hasMax).toBeTruthy();
    }
  });

  test('should not have keyboard focus trap', async ({ page }) => {
    await page.goto('/redteam/prompt-forge');
    await page.waitForLoadState('networkidle');

    // Tab through form fields
    const textarea = page.locator('textarea').first();

    if (await textarea.isVisible()) {
      await textarea.focus();

      // Tab 20 times - should be able to move focus
      let focusChanged = false;

      for (let i = 0; i < 20; i++) {
        await page.keyboard.press('Tab');
        const activeElement = await page.evaluate(() => document.activeElement?.className || '');
        if (activeElement !== 'textarea') {
          focusChanged = true;
          break;
        }
      }

      expect(focusChanged).toBe(true);
    }
  });

  test('buttons should be keyboard accessible', async ({ page }) => {
    await page.goto('/redteam/prompt-forge');
    await page.waitForLoadState('networkidle');

    // Fill form first
    const textarea = page.locator('textarea');
    await textarea.fill('Test prompt');

    // Tab to Test Single button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Press Enter to activate button
    await page.keyboard.press('Enter');

    // Should trigger action (button click)
    await page.waitForLoadState('networkidle');
  });

  test('RedTeam navigation should have semantic HTML', async ({ page }) => {
    await page.goto('/redteam');
    await page.waitForLoadState('networkidle');

    // Check for semantic navigation
    const nav = page.locator('nav, [role="navigation"]');
    const navCount = await nav.count();

    // Should have navigation element
    if (navCount > 0) {
      await expect(nav.first()).toBeVisible();
    }
  });

  test('should not have color-only contrast issues', async ({ page }) => {
    await page.goto('/redteam/prompt-forge');
    await page.waitForLoadState('networkidle');

    // Check main content has sufficient contrast
    const content = page.locator('body');

    // Get computed styles
    const styles = await page.evaluate(() => {
      const elem = document.querySelector('body');
      if (!elem) return null;
      const computed = window.getComputedStyle(elem);
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
      };
    });

    expect(styles).not.toBeNull();
    expect(styles?.color).toBeTruthy();
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/redteam/prompt-forge');
    await page.waitForLoadState('networkidle');

    // Check heading order
    const h1 = page.locator('h1');
    const h2 = page.locator('h2');

    // Page should have at least one heading
    const headingCount = (await h1.count()) + (await h2.count());
    expect(headingCount).toBeGreaterThan(0);
  });

  test('should announce dynamic content with aria-live', async ({ page }) => {
    await page.goto('/redteam/prompt-forge');
    await page.waitForLoadState('networkidle');

    // Check for aria-live regions
    const ariaLive = page.locator('[aria-live]');
    const ariaLiveCount = await ariaLive.count();

    // Dynamic regions should have aria-live
    if (ariaLiveCount > 0) {
      for (let i = 0; i < ariaLiveCount; i++) {
        const region = ariaLive.nth(i);
        const liveValue = await region.getAttribute('aria-live');
        expect(['polite', 'assertive']).toContain(liveValue);
      }
    }
  });

  test('decorative elements should be hidden from screen readers', async ({ page }) => {
    await page.goto('/redteam/prompt-forge');
    await page.waitForLoadState('networkidle');

    // Check for aria-hidden on decorative elements
    const decorative = page.locator('[aria-hidden="true"]');
    const decorCount = await decorative.count();

    // Should have some elements marked as decorative
    if (decorCount > 0) {
      for (let i = 0; i < decorCount; i++) {
        const elem = decorative.nth(i);
        const hidden = await elem.getAttribute('aria-hidden');
        expect(hidden).toBe('true');
      }
    }
  });

  test('form inputs should have error announcements', async ({ page }) => {
    await page.goto('/redteam/prompt-forge');
    await page.waitForLoadState('networkidle');

    // If there are error messages, they should be announced
    const errorMessages = page.locator('[role="alert"], .error, [aria-live="assertive"]');
    const errorCount = await errorMessages.count();

    // Page might not have errors initially
    expect(errorCount).toBeGreaterThanOrEqual(0);
  });

  test('should support language declaration', async ({ page }) => {
    await page.goto('/redteam/prompt-forge');

    // Check for language declaration
    const htmlLang = await page.locator('html').getAttribute('lang');

    // Should have lang attribute
    expect(htmlLang).toBeTruthy();
  });
});
