# QA Automation — Resilda's Boutique

Automated end-to-end tests using [Playwright](https://playwright.dev), covering
navbar/cart, product listing/detail, and checkout validation flows.

## Setup (one-time)

Copy these into your project root:
- `playwright.config.js`
- `tests/` folder
- `.github/workflows/playwright.yml`

Then install:

```bash
npm install -D @playwright/test
npx playwright install
```

## Running locally

Against the live deployed site (default):
```bash
npx playwright test
```

Against your local dev server instead:
```bash
npm run dev
# in a second terminal:
BASE_URL=http://localhost:5173 npx playwright test
```

## Viewing the report

After a run:
```bash
npx playwright show-report
```
This opens an HTML report in your browser — pass/fail per test, screenshots
and video for any failures, and full traces you can step through frame by
frame.

## Automatic runs (GitHub Actions)

Once `.github/workflows/playwright.yml` is pushed to your repo, tests run
automatically on every push to `main`. Check results under the **Actions**
tab on GitHub — click a run, scroll to **Artifacts**, download
`playwright-report`, unzip, and open `index.html`. That artifact IS the
"QA report" — no manual write-up needed anymore.

You can also trigger a run manually anytime from the Actions tab (no need
to push a commit) via the "Run workflow" button, since the workflow
includes `workflow_dispatch`.

## What's covered vs. what's stubbed

**Covered with real selectors** (pulled from actual component code you've
shared in this project):
- Navbar: search, wishlist, cart icon behavior
- Cart Drawer: empty state, adding items, proceeding to checkout
- Product listing: grid loads, category tab filtering, breadcrumb offset
  regression check (catches the navbar+ticker clipping bug from earlier)
- Product detail: navigation from card, price/CTA visibility
- Checkout: empty-cart guard, phone/pincode validation, pincode
  digit-stripping, order summary totals

**Stubbed / not yet covered:**
- **Login/signup flows** — `Login.jsx` wasn't shared in this conversation,
  so selectors would be guessed rather than real. Paste that file and this
  can be filled in.
- **Wishlist authenticated behavior** — needs a logged-in session. Playwright
  supports this via `storageState` (save a logged-in browser session once,
  reuse it across tests) — worth adding once Login test coverage exists.
- **Successful checkout submission** — intentionally NOT tested end-to-end,
  since it calls the real `placeOrder` Cloud Function and would create a
  live Firestore order. Once Razorpay is integrated, add a dedicated test
  using Razorpay's sandbox/test-mode keys, run against a staging
  environment — not production.
- **Admin panel** — no tests yet. Given it's behind an email allowlist
  (`VITE_ADMIN_EMAILS`), this also needs an authenticated fixture.

## Suggested next steps, in order

1. Paste `Login.jsx` → get real auth test coverage
2. Add a `storageState` fixture for logged-in tests (wishlist, account, admin)
3. Once Razorpay is wired in with test-mode keys, add a checkout success test
   against a staging deployment (not production)
4. Consider adding visual regression tests (`expect(page).toHaveScreenshot()`)
   for the mobile layout bugs already fixed this session, so future CSS
   changes can't silently reintroduce them