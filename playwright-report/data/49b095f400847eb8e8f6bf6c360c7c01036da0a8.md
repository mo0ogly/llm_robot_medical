# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: redteam-layout.spec.ts >> RedTeam Layout Navigation >> should not show 404 errors for valid routes
- Location: e2e\specs\redteam-layout.spec.ts:175:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
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
  125 |     const viewLink = page.locator('a[href*="/redteam/"]').first();
  126 |     if (await viewLink.isVisible()) {
  127 |       await viewLink.click();
  128 |       await page.waitForLoadState('networkidle');
  129 | 
  130 |       // Sidebar should still be visible
  131 |       await expect(sidebar).toBeVisible();
  132 |     }
  133 |   });
  134 | 
  135 |   test('should handle rapid navigation without crashes', async ({ page }) => {
  136 |     const links = page.locator('a[href*="/redteam/"]');
  137 |     const count = await links.count();
  138 | 
  139 |     if (count > 1) {
  140 |       // Rapidly navigate
  141 |       for (let i = 0; i < Math.min(3, count); i++) {
  142 |         const link = links.nth(i);
  143 |         if (await link.isVisible()) {
  144 |           await link.click({ timeout: 1000 });
  145 |           await page.waitForLoadState('domcontentloaded');
  146 |         }
  147 |       }
  148 | 
  149 |       // Should still be on a valid redteam route
  150 |       expect(page.url()).toContain('/redteam');
  151 |     }
  152 |   });
  153 | 
  154 |   test('should display loading spinner during lazy load', async ({ page }) => {
  155 |     // Find a link to a lazy-loaded view
  156 |     const lazyLink = page.locator('a[href*="/redteam/rag"], a[href*="/redteam/results"]').first();
  157 | 
  158 |     if (await lazyLink.isVisible()) {
  159 |       // Click and check for loading state
  160 |       await lazyLink.click();
  161 | 
  162 |       // There might be a loading spinner briefly
  163 |       const loading = page.locator('text=/loading|loading.../i');
  164 |       const spinnerVisible = await loading.isVisible({ timeout: 1000 }).catch(() => false);
  165 | 
  166 |       // View should eventually load
  167 |       await page.waitForLoadState('networkidle');
  168 | 
  169 |       // Content should be visible
  170 |       const content = page.locator('main, [role="main"]');
  171 |       await expect(content).toBeVisible();
  172 |     }
  173 |   });
  174 | 
  175 |   test('should not show 404 errors for valid routes', async ({ page }) => {
  176 |     let notFound = false;
  177 | 
  178 |     page.on('response', (response) => {
  179 |       if (response.status() === 404) {
  180 |         notFound = true;
  181 |       }
  182 |     });
  183 | 
  184 |     await page.goto('/redteam');
  185 |     await page.waitForLoadState('networkidle');
  186 | 
> 187 |     expect(notFound).toBe(false);
      |                      ^ Error: expect(received).toBe(expected) // Object.is equality
  188 |   });
  189 | });
  190 | 
```