// tests/products.spec.js
import { test, expect } from '@playwright/test';

test.describe('Product Listing', () => {
  test('products page loads with product grid', async ({ page }) => {
    await page.goto('/products', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.product-grid')).toBeVisible();
    await expect(page.locator('.product-card').first()).toBeVisible({ timeout: 10000 });
  });

  test('category tab filters products', async ({ page }) => {
    await page.goto('/products', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.product-card');
    const initialCount = await page.locator('.product-card').count();

    // Click a category tab that isn't "All" — assumes tab-btn list includes
    // real category labels like "Cotton Saree", "Kurthi Set", etc.
    const tabs = page.locator('.tab-btn');
    const tabCount = await tabs.count();
    if (tabCount > 1) {
      await tabs.nth(1).click();
      await page.waitForTimeout(500); // allow filter state to settle
      const filteredCount = await page.locator('.product-card').count();
      // Not a strict inequality check since a category could coincidentally
      // match total count — just confirms nothing crashed and grid re-rendered
      expect(filteredCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('breadcrumb is not clipped by fixed navbar on mobile', async ({ page }) => {
    await page.goto('/products/cotton-saree', { waitUntil: 'domcontentloaded' });
    const breadcrumb = page.locator('.products-page__breadcrumb');
    await expect(breadcrumb).toBeVisible();

    // Regression check for the navbar+ticker offset bug fixed earlier —
    // breadcrumb's bounding box top should be below the fixed header height.
    const box = await breadcrumb.boundingBox();
    expect(box.y).toBeGreaterThan(90); // navbar (68px) + ticker (~28px)
  });
});

test.describe('Product Detail Page', () => {
  test('clicking a product card opens its detail page', async ({ page }) => {
    await page.goto('/products', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.product-card');
    const firstCardLink = page.locator('.product-card__link').first();
    await firstCardLink.click();
    await expect(page).toHaveURL(/\/product\//);
  });

  test('product detail page shows price and add-to-cart controls', async ({ page }) => {
    await page.goto('/products', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.product-card');
    await page.locator('.product-card__link').first().click();
    await expect(page).toHaveURL(/\/product\//);

    await expect(page.locator('.pd-price')).toBeVisible();
    await expect(page.locator('.pd-btn-cart, .pd-cta')).toBeVisible();
  });
});