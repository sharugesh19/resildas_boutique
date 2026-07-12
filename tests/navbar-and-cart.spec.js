// tests/navbar-and-cart.spec.js
import { test, expect } from '@playwright/test';

test.describe('Navbar', () => {
  test('loads home page with navbar visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.navbar')).toBeVisible();
    // Scoped to the navbar logo specifically — getByAltText alone also
    // matched the Loader's logo image (same alt text, different class).
    await expect(page.locator('.navbar__logo-img')).toBeVisible();
  });

  test('search icon opens SearchBar', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Search' }).click();
    // SearchBar renders conditionally when searchOpen === true
    await expect(page.locator('input[type="text"], input[type="search"]').first()).toBeVisible({ timeout: 5000 });
  });

  test('wishlist icon redirects to login when logged out', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Wishlist' }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('cart icon opens CartDrawer', async ({ page }) => {
    await page.goto('/');
    // exact: true — without it, "Cart" also fuzzy-matches the drawer's
    // own "Close cart" button aria-label.
    await page.getByRole('button', { name: 'Cart', exact: true }).click();
    await expect(page.locator('.cart-drawer')).toHaveClass(/open/);
  });
});

test.describe('Cart Drawer', () => {
  test('shows empty state with no items', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Cart', exact: true }).click();
    // Fresh browser context = empty cart (CartContext isn't seeded)
    await expect(page.locator('.cart-drawer__empty')).toBeVisible();
    await expect(page.locator('.cart-drawer__empty')).toContainText('Your cart is empty');
  });

  test('adding a product from a product card opens drawer with item', async ({ page }) => {
    await page.goto('/products');
    const firstCard = page.locator('.product-card').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });

    const addBtn = firstCard.locator('.product-card__add');
    // Skip if the first product happens to be out of stock
    if (await addBtn.isDisabled()) {
      test.skip(true, 'First product card is out of stock, skipping add-to-cart check');
    }
    await addBtn.click();

    await expect(page.locator('.cart-drawer')).toHaveClass(/open/);
    await expect(page.locator('.cart-drawer__item')).toHaveCount(1);
  });

  test('proceed to checkout navigates to /checkout with items in cart', async ({ page }) => {
    await page.goto('/products');
    const addBtn = page.locator('.product-card__add').first();
    if (await addBtn.isDisabled()) {
      test.skip(true, 'First product card is out of stock, skipping checkout nav check');
    }
    await addBtn.click();
    await page.locator('.btn-checkout').click();
    await expect(page).toHaveURL(/\/checkout/);
  });
});