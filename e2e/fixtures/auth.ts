import { test as base, Page } from '@playwright/test';

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Navigate to app
    await page.goto('/');

    // If login is required, handle it here
    // For now, app is public, so just navigate

    await use(page);
  },
});

export { expect } from '@playwright/test';
