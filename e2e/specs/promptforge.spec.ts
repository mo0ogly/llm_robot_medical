import { test, expect } from '@playwright/test';
import { waitForElement, fillFormInput, waitForText, getStreamingOutput, measurePageLoadTime } from '../helpers/test-utils';

test.describe('PromptForge Multi-LLM Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/redteam/prompt-forge');
  });

  test('should load PromptForge page successfully', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/PoC LLM Medical/);

    // Verify main heading visible
    const heading = page.locator('h2:has-text("Prompt Forge")');
    await expect(heading).toBeVisible();

    // Verify provider selector exists
    const providerSelect = page.locator('select').first();
    await expect(providerSelect).toBeVisible();
  });

  test('should display available LLM providers', async ({ page }) => {
    // Wait for provider select to populate
    const providerSelect = page.locator('select').first();
    await page.waitForLoadState('networkidle');

    // Get all options
    const options = page.locator('select option');
    const count = await options.count();

    // Should have at least Ollama
    expect(count).toBeGreaterThanOrEqual(1);

    // Verify Ollama is present
    const ollamaOption = page.locator('option:has-text("ollama")');
    await expect(ollamaOption).toBeVisible();
  });

  test('should change models when provider is selected', async ({ page }) => {
    // Select first provider
    const providerSelect = page.locator('select').first();
    await providerSelect.selectOption(await providerSelect.locator('option').first().getAttribute('value') || '');

    // Wait for models to load
    await page.waitForTimeout(500);

    // Verify model select populated
    const modelSelect = page.locator('select').nth(1);
    const modelOptions = modelSelect.locator('option');
    const modelCount = await modelOptions.count();

    expect(modelCount).toBeGreaterThan(0);
  });

  test('should update temperature and max_tokens sliders', async ({ page }) => {
    // Find temperature slider
    const temperatureSlider = page.locator('input[type="range"]').first();
    await temperatureSlider.fill('0.5');

    // Verify value changed
    const tempValue = await temperatureSlider.getAttribute('value');
    expect(Number(tempValue)).toBeCloseTo(0.5, 1);

    // Find max_tokens slider
    const maxTokensSlider = page.locator('input[type="range"]').nth(1);
    await maxTokensSlider.fill('2048');

    const tokenValue = await maxTokensSlider.getAttribute('value');
    expect(Number(tokenValue)).toBe(2048);
  });

  test('should populate prompt textarea', async ({ page }) => {
    const textarea = page.locator('textarea');
    const testPrompt = 'Test prompt for LLM evaluation';

    await textarea.fill(testPrompt);
    await expect(textarea).toHaveValue(testPrompt);
  });

  test('should enable Test Single button when prompt entered', async ({ page }) => {
    // Initially disabled
    const testButton = page.locator('button:has-text("Test Single")');
    let disabled = await testButton.isDisabled();
    expect(disabled).toBe(true);

    // Enter prompt
    const textarea = page.locator('textarea');
    await textarea.fill('Test prompt');

    // Button should be enabled
    disabled = await testButton.isDisabled();
    expect(disabled).toBe(false);
  });

  test('should stream output from LLM test', async ({ page }) => {
    // Fill prompt
    const textarea = page.locator('textarea');
    await textarea.fill('Respond with "Hello world" only');

    // Select provider (should be Ollama by default)
    const providerSelect = page.locator('select').first();
    await page.waitForLoadState('networkidle');

    // Click Test Single button
    const testButton = page.locator('button:has-text("Test Single")');
    await testButton.click();

    // Wait for output to appear (streaming)
    const outputDiv = page.locator('div.bg-neutral-900').last();
    await expect(outputDiv).toBeVisible({ timeout: 10000 });

    // Verify some content appears (even if partial due to streaming)
    const text = await outputDiv.textContent();
    expect(text?.length).toBeGreaterThan(0);
  });

  test('should handle missing prompt gracefully', async ({ page }) => {
    const testButton = page.locator('button:has-text("Test Single")');

    // Button should be disabled without prompt
    const disabled = await testButton.isDisabled();
    expect(disabled).toBe(true);
  });

  test('should measure page load time under 3 seconds', async ({ page }) => {
    const loadTime = await measurePageLoadTime(page);
    console.log(`Page load time: ${loadTime}ms`);

    // Expect load time under 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have proper form labels for accessibility', async ({ page }) => {
    // Check for label elements
    const labels = page.locator('label');
    const labelCount = await labels.count();

    // Should have at least 4 labels (provider, model, prompt, temperature, max_tokens)
    expect(labelCount).toBeGreaterThanOrEqual(4);

    // Verify labels are visible
    for (let i = 0; i < labelCount; i++) {
      const label = labels.nth(i);
      await expect(label).toBeVisible();
    }
  });

  test('should persist state during slider adjustments', async ({ page }) => {
    // Fill form
    const textarea = page.locator('textarea');
    const testText = 'Persistent test';
    await textarea.fill(testText);

    // Adjust sliders
    const tempSlider = page.locator('input[type="range"]').first();
    await tempSlider.fill('0.3');

    // Verify text still in textarea
    await expect(textarea).toHaveValue(testText);

    // Verify slider value
    const sliderValue = await tempSlider.getAttribute('value');
    expect(Number(sliderValue)).toBeCloseTo(0.3, 1);
  });
});
