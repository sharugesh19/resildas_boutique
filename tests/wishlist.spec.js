// tests/wishlist.spec.js
import { test, expect } from '@playwright/test';

test.describe('Wishlist', () => {
  test('redirects logged-out users to login with redirect param', async ({ page }) => {
    await page.goto('/wishlist', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/login/);
    // ProtectedRoute should preserve intent to return to /wishlist after login
    expect(page.url()).toContain('redirect');
  });

  test('wishlist page title clears fixed navbar (regression check)', async ({ page }) => {
    // This will redirect to /login for a logged-out user, so this test
    // is really only meaningful once you add a logged-in auth fixture.
    // Left here as a placeholder for that — see README in this folder.
    test.skip(true, 'Requires an authenticated session — see storageState setup in README');
  });
});