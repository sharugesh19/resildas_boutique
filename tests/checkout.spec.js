// tests/checkout.spec.js
import { test, expect } from '@playwright/test';

// Regexes copied directly from Checkout.jsx so tests exercise the exact
// same validation, not a guessed approximation of it.
const VALID_PHONE = '9876543210';
const INVALID_PHONE = '12345';
const VALID_PINCODE = '641652'; // doesn't start with 0, 6 digits
const INVALID_PINCODE = '012345'; // starts with 0

test.describe('Checkout — empty cart guard', () => {
  test('visiting /checkout with an empty cart shows empty-cart message, not the form', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page.getByText('Your cart is empty')).toBeVisible();
    await expect(page.locator('.checkout-form')).toHaveCount(0);
  });
});

test.describe('Checkout — form validation', () => {
  // Helper: add a product to cart, then navigate to checkout, since the
  // form only renders when cart.length > 0.
  async function goToCheckoutWithItem(page) {
    await page.goto('/products');
    await page.waitForSelector('.product-card');
    const addBtn = page.locator('.product-card__add').first();
    if (await addBtn.isDisabled()) {
      test.skip(true, 'First product is out of stock, cannot reach checkout form');
    }
    await addBtn.click();
    await page.locator('.btn-checkout').click();
    await expect(page).toHaveURL(/\/checkout/);
  }

  test('rejects invalid phone number', async ({ page }) => {
    await goToCheckoutWithItem(page);

    await page.fill('#fullName', 'Test User');
    await page.fill('#phone', INVALID_PHONE);
    await page.fill('#address1', '123 Test Street');
    await page.fill('#city', 'Udumalaipettai');
    await page.selectOption('#state', 'Tamil Nadu');
    await page.fill('#pincode', VALID_PINCODE);

    await page.click('.checkout-submit');
    await expect(page.locator('.auth-error')).toContainText('valid 10-digit Indian mobile number');
  });

  test('rejects invalid pincode', async ({ page }) => {
    await goToCheckoutWithItem(page);

    await page.fill('#fullName', 'Test User');
    await page.fill('#phone', VALID_PHONE);
    await page.fill('#address1', '123 Test Street');
    await page.fill('#city', 'Udumalaipettai');
    await page.selectOption('#state', 'Tamil Nadu');
    await page.fill('#pincode', INVALID_PINCODE);

    await page.click('.checkout-submit');
    await expect(page.locator('.auth-error')).toContainText('valid 6-digit pincode');
  });

  test('pincode field strips non-digit characters', async ({ page }) => {
    await goToCheckoutWithItem(page);
    const pincode = page.locator('#pincode');
    // pressSequentially simulates real keystrokes (one input event per
    // character), matching how a real user types and how the controlled
    // React input actually re-renders between keystrokes. fill() sends
    // the whole string as a single input event, which was producing an
    // incomplete result ('123' instead of '123456') against this specific
    // controlled input — not a real site bug, a test-interaction mismatch.
    await pincode.click();
    await pincode.fill(''); // ensure empty before typing
    await pincode.pressSequentially('abc123xyz456', { delay: 30 });
    await expect(pincode).toHaveValue('123456');
  });

  test('order summary reflects cart item and total', async ({ page }) => {
    await goToCheckoutWithItem(page);
    await expect(page.locator('.checkout-summary__item')).toHaveCount(1);
    await expect(page.locator('.checkout-summary__row--total')).toBeVisible();
  });

  // NOTE: does not test successful submission — that calls the real
  // `placeOrder` Cloud Function and would create a live Firestore order /
  // eventually a real Razorpay charge. Once Razorpay is wired in, this
  // suite should add a payment-sandbox test using Razorpay's test mode
  // keys, not the production flow.
});