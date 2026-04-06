import { Page, expect } from '@playwright/test';

/**
 * Wait for an element to be visible and interactable
 */
export async function waitForElement(page: Page, selector: string, timeout = 5000) {
  await page.locator(selector).waitFor({ state: 'visible', timeout });
  return page.locator(selector);
}

/**
 * Fill form input and verify value
 */
export async function fillFormInput(page: Page, selector: string, value: string) {
  const input = page.locator(selector);
  await input.fill(value);
  await expect(input).toHaveValue(value);
}

/**
 * Select dropdown option by value or text
 */
export async function selectDropdownOption(page: Page, selector: string, optionText: string) {
  const select = page.locator(selector);
  await select.selectOption({ label: optionText });
}

/**
 * Check if element is visible
 */
export async function isElementVisible(page: Page, selector: string): Promise<boolean> {
  try {
    await page.locator(selector).waitFor({ state: 'visible', timeout: 1000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Wait for text to appear on page
 */
export async function waitForText(page: Page, text: string, timeout = 5000) {
  await page.waitForFunction(
    (searchText) => document.body.innerText.includes(searchText),
    text,
    { timeout }
  );
}

/**
 * Get streaming output text (for PromptForge)
 */
export async function getStreamingOutput(page: Page, outputSelector: string, timeout = 10000) {
  const startTime = Date.now();
  let lastText = '';

  while (Date.now() - startTime < timeout) {
    const element = page.locator(outputSelector);
    const text = await element.textContent();

    if (text && text.length > lastText.length) {
      lastText = text;
    }

    // Check if streaming appears to be complete (no new text for 500ms)
    await page.waitForTimeout(500);
    const newText = await element.textContent();

    if (newText === lastText && lastText.length > 0) {
      return lastText;
    }
    lastText = newText || '';
  }

  return lastText;
}

/**
 * Measure page load time
 */
export async function measurePageLoadTime(page: Page): Promise<number> {
  const navigationTiming = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return navigation.loadEventEnd - navigation.fetchStart;
  });

  return navigationTiming;
}

/**
 * Measure time to first interactive element
 */
export async function measureTimeToInteractive(page: Page): Promise<number> {
  const timing = await page.evaluate(() => {
    const paint = performance.getEntriesByType('paint');
    const largestPaint = paint.find((p) => p.name === 'largest-contentful-paint');
    return largestPaint ? largestPaint.startTime : 0;
  });

  return timing;
}

/**
 * Check accessibility violations using axe-core
 */
export async function checkAccessibility(page: Page) {
  // Dynamically import axe-core runtime
  await page.addScriptTag({
    url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.0/axe.min.js',
  });

  const results = await page.evaluate(() => {
    return (window as any).axe.run((error: any, results: any) => {
      if (error) throw error;
      return results;
    });
  });

  return results;
}
