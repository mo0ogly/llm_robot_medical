# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: redteam-layout.spec.ts >> RedTeam Layout Navigation >> should display navigation tabs
- Location: e2e\specs\redteam-layout.spec.ts:19:7

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - text: The server is configured with a public base URL of /llm_robot_medical/ - did you mean to visit
  - link "/llm_robot_medical/redteam" [ref=e2] [cursor=pointer]:
    - /url: /llm_robot_medical/redteam
  - text: instead?
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { waitForElement, isElementVisible } from '../helpers/test-utils';
  3   | 
  4   | test.describe('RedTeam Layout Navigation', () => {
  5   |   test.beforeEach(async ({ page }) => {
  6   |     await page.goto('/redteam');
  7   |     await page.waitForLoadState('networkidle');
  8   |   });
  9   | 
  10  |   test('should load RedTeam layout successfully', async ({ page }) => {
  11  |     // Verify we're on redteam route
  12  |     expect(page.url()).toContain('/redteam');
  13  | 
  14  |     // Verify main layout exists
  15  |     const mainContent = page.locator('main, [role="main"]');
  16  |     await expect(mainContent).toBeVisible({ timeout: 5000 });
  17  |   });
  18  | 
  19  |   test('should display navigation tabs', async ({ page }) => {
  20  |     // Look for tab buttons/links
  21  |     const tabs = page.locator('a, button').filter({ hasText: /rag|studio|catalog|logs|timeline/i });
  22  |     const count = await tabs.count();
  23  | 
> 24  |     expect(count).toBeGreaterThan(0);
      |                   ^ Error: expect(received).toBeGreaterThan(expected)
  25  |   });
  26  | 
  27  |   test('should navigate to RAG view', async ({ page }) => {
  28  |     const ragLink = page.locator('a:has-text("rag"), button:has-text("rag")').first();
  29  | 
  30  |     if (await ragLink.isVisible()) {
  31  |       await ragLink.click();
  32  |       await page.waitForLoadState('networkidle');
  33  | 
  34  |       // Verify URL changed
  35  |       expect(page.url()).toContain('/redteam/rag');
  36  |     }
  37  |   });
  38  | 
  39  |   test('should navigate to Studio view', async ({ page }) => {
  40  |     const studioLink = page.locator('a:has-text("studio"), button:has-text("studio")').first();
  41  | 
  42  |     if (await studioLink.isVisible()) {
  43  |       await studioLink.click();
  44  |       await page.waitForLoadState('networkidle');
  45  | 
  46  |       expect(page.url()).toContain('/redteam/studio');
  47  |     }
  48  |   });
  49  | 
  50  |   test('should navigate to Catalog view', async ({ page }) => {
  51  |     const catalogLink = page.locator('a:has-text("catalog"), button:has-text("catalog")').first();
  52  | 
  53  |     if (await catalogLink.isVisible()) {
  54  |       await catalogLink.click();
  55  |       await page.waitForLoadState('networkidle');
  56  | 
  57  |       expect(page.url()).toContain('/redteam/catalog');
  58  |     }
  59  |   });
  60  | 
  61  |   test('should navigate to Logs view', async ({ page }) => {
  62  |     const logsLink = page.locator('a:has-text("logs"), button:has-text("logs")').first();
  63  | 
  64  |     if (await logsLink.isVisible()) {
  65  |       await logsLink.click();
  66  |       await page.waitForLoadState('networkidle');
  67  | 
  68  |       expect(page.url()).toContain('/redteam/logs');
  69  |     }
  70  |   });
  71  | 
  72  |   test('should navigate to Timeline view', async ({ page }) => {
  73  |     const timelineLink = page.locator('a:has-text("timeline"), button:has-text("timeline")').first();
  74  | 
  75  |     if (await timelineLink.isVisible()) {
  76  |       await timelineLink.click();
  77  |       await page.waitForLoadState('networkidle');
  78  | 
  79  |       expect(page.url()).toContain('/redteam/timeline');
  80  |     }
  81  |   });
  82  | 
  83  |   test('should navigate to PromptForge view', async ({ page }) => {
  84  |     const promptforgeLink = page.locator('a:has-text("prompt-forge"), button:has-text("prompt-forge")').first();
  85  | 
  86  |     if (await promptforgeLink.isVisible()) {
  87  |       await promptforgeLink.click();
  88  |       await page.waitForLoadState('networkidle');
  89  | 
  90  |       expect(page.url()).toContain('/redteam/prompt-forge');
  91  |     }
  92  |   });
  93  | 
  94  |   test('should load lazy-loaded views without errors', async ({ page }) => {
  95  |     // Monitor for console errors
  96  |     const errors: string[] = [];
  97  |     page.on('console', (msg) => {
  98  |       if (msg.type() === 'error') {
  99  |         errors.push(msg.text());
  100 |       }
  101 |     });
  102 | 
  103 |     // Navigate through multiple views
  104 |     const viewLinks = page.locator('a[href*="/redteam/"]').all();
  105 | 
  106 |     for (const link of await viewLinks) {
  107 |       await link.click();
  108 |       await page.waitForLoadState('networkidle');
  109 |       await page.waitForTimeout(500);
  110 |     }
  111 | 
  112 |     // Should not have critical errors
  113 |     const criticalErrors = errors.filter(
  114 |       (e) => !e.includes('warn') && !e.includes('non-critical')
  115 |     );
  116 |     expect(criticalErrors.length).toBe(0);
  117 |   });
  118 | 
  119 |   test('should maintain layout structure during navigation', async ({ page }) => {
  120 |     // Check initial structure
  121 |     const sidebar = page.locator('nav, [role="navigation"], aside');
  122 |     await expect(sidebar).toBeVisible({ timeout: 5000 });
  123 | 
  124 |     // Navigate to different view
```