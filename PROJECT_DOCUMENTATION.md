# Resilda's Boutique — Project Documentation

> **Last updated:** 2026-08-02
> **Audience:** This document has two voices. Sections marked 🛍️ are written in plain language for the business owner. Sections marked 🔧 are written for a developer.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Authentication](#3-authentication)
4. [Payment Flow](#4-payment-flow)
5. [Cloud Functions Reference](#5-cloud-functions-reference)
6. [Admin Panel Guide](#6-admin-panel-guide)
7. [Deployment](#7-deployment)
8. [Known Limitations](#8-known-limitations)
9. [Environment Variables & Secrets](#9-environment-variables--secrets)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Project Overview

### 🛍️ What This Is

Resilda's Boutique is an online store selling women's ethnic wear — sarees, kurthi sets, unstitched salwar materials, and co-ord sets. Customers browse products, add them to a cart, check out with their delivery details, and pay online via Razorpay (UPI, cards, or net banking). Payments are collected in Indian Rupees (INR). All items ship free.

The store is run entirely online. There is no physical point-of-sale system connected to this codebase.

### 🛍️ Key URLs

| What | URL / Name |
|------|-----------|
| Live store | Deployed via Vercel — check your Vercel dashboard for the current production URL |
| Admin panel | `<your-site-url>/admin` |
| Firebase project | `resildas-fa23f` |
| Firebase console | https://console.firebase.google.com — select `resildas-fa23f` |

### 🔧 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend framework | React | 19 |
| Frontend bundler | Vite | 6 |
| Frontend hosting | Vercel | — |
| Database | Firebase Firestore | — |
| Authentication | Firebase Auth | — |
| File storage | Firebase Storage | — |
| Backend logic | Firebase Cloud Functions | v2 (Node 24) |
| Payment gateway | Razorpay | SDK v2.9.x |
| Animations | Framer Motion | 12 |

---

## 2. Architecture

### 🔧 Folder Structure

```
resildas_boutique_frontend_react/
├── functions/                  ← Firebase Cloud Functions (Node.js backend)
│   ├── index.js                ← All server-side logic (placeOrder, verifyPayment)
│   ├── .env                    ← Local-only secrets (never committed to git)
│   ├── .gitignore              ← Excludes node_modules, .env, *.local
│   └── package.json            ← Node 24 runtime, firebase-functions v7
│
├── src/                        ← React frontend source
│   ├── admin/                  ← Admin-only pages (dashboard, orders, products)
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminOrders.jsx
│   │   ├── AdminProducts.jsx
│   │   ├── AdminRoutes.jsx     ← Admin guard (checks Firebase custom claims)
│   │   ├── ProductForm.jsx     ← Add/edit product form
│   │   ├── CategoryFields.jsx
│   │   ├── ColorVariants.jsx
│   │   ├── SizeStockEditor.jsx
│   │   ├── ImageUploader.jsx
│   │   └── admin.css
│   │
│   ├── components/
│   │   ├── common/             ← Shared UI: Navbar, Footer, CartDrawer, Icons, etc.
│   │   ├── home/               ← Homepage-specific sections
│   │   └── product/            ← ProductCard
│   │
│   ├── context/                ← React context providers
│   │   ├── AuthContext.jsx     ← Wraps Firebase Auth; exposes user, login, logout
│   │   ├── CartContext.jsx     ← Cart state (persisted in localStorage)
│   │   └── WishlistContext.jsx ← Wishlist state (synced to Firestore)
│   │
│   ├── hooks/                  ← Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   ├── useProducts.js      ← Shared cache + BroadcastChannel cross-tab sync
│   │   └── useWishlist.js
│   │
│   ├── pages/                  ← One file per page/route
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Checkout.jsx        ← Payment flow lives here
│   │   ├── Account.jsx         ← Order history (paid orders only)
│   │   ├── Login.jsx
│   │   ├── Wishlist.jsx
│   │   └── [policy pages]
│   │
│   ├── routes/AppRoutes.jsx    ← All page routes; lazy-loaded
│   ├── firebase/firebaseConfig.js  ← Firebase SDK init; reads VITE_* env vars
│   └── utils/
│       ├── stockHelpers.js     ← getMaxQty() — single source of truth for stock
│       ├── formatPrice.js
│       ├── normalizeSizes.js
│       ├── requireLogin.js
│       ├── analytics.js        ← GA4 page-view tracking
│       └── storageHelpers.js
│
├── public/
│   └── ga-init.js              ← Google Analytics init (external file, no inline JS)
│
├── .env                        ← Frontend env vars (VITE_* prefix, never secret)
├── .gitignore                  ← Excludes .env, functions/.env, node_modules, dist
├── firestore.rules             ← Firestore security rules
├── storage.rules               ← Firebase Storage security rules
├── firebase.json               ← Firebase project config (rules, functions)
├── vercel.json                 ← Security headers + SPA rewrite rules
└── index.html                  ← HTML entry; loads /ga-init.js (no inline scripts)
```

### 🔧 Firestore Collections

#### `products`
Each document is one product.

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Display name |
| `category` | string | e.g. `"kurthi-set"`, `"organza-saree"` |
| `price` | number | Base price in rupees |
| `description` | string | Product description |
| `images` | string[] | Array of Firebase Storage URLs |
| `sizes` | array | Either `string[]` (plain) or `{size, stock}[]` (with stock tracking) |
| `colors` | array | `{name, price, images[], sizes[]}` — only if product has colour variants |
| `inStock` | boolean | Legacy fallback for products without numeric stock |

#### `orders`
Each document is one order attempt.

| Field | Type | Description |
|-------|------|-------------|
| `userId` | string or null | Firebase UID of the customer (null for guest orders) |
| `customer` | object | `{name, phone, email, address1, address2, city, state, pincode}` |
| `items` | array | `[{productId, name, price, quantity, size, color, image, lineTotal}]` |
| `total` | number | Total in rupees (server-computed) |
| `paymentMethod` | string | Always `"razorpay"` |
| `paymentStatus` | string | `"pending"` → `"paid"` or `"failed"` |
| `orderStatus` | string | `"pending_payment"` → `"placed"` → `"processing"` → `"shipped"` → `"delivered"` |
| `razorpayOrderId` | string | Razorpay's order ID (`"order_..."`) |
| `razorpayPaymentId` | string | Razorpay's payment ID — only set after successful payment |
| `createdAt` | Timestamp | Server timestamp |

#### `wishlists`
One document per user, document ID = Firebase UID.

| Field | Type | Description |
|-------|------|-------------|
| `items` | string[] | Array of product document IDs |

#### `users`
One document per user, document ID = Firebase UID.

| Field | Type | Description |
|-------|------|-------------|
| Various | any | Customer profile data (address, preferences) — currently minimal |

### 🔧 Data Flow — Page Load

```
Browser requests page
    ↓
Vercel serves index.html + compiled JS bundle
    ↓
React app boots; AuthProvider checks Firebase Auth session
    ↓
useProducts() hook fetches product list from Firestore
  (2-minute in-memory cache; BroadcastChannel syncs across tabs)
    ↓
UI renders with live product data
```

### 🔧 Data Flow — Checkout / Payment

```
User fills checkout form → clicks Pay Now
    ↓
Checkout.jsx calls Cloud Function: placeOrder()
    ↓ (server-side)
placeOrder validates items, reads real prices from Firestore,
checks stock availability, creates order as pending_payment,
creates a matching Razorpay order
    ↓ (returns to browser)
Browser lazy-loads Razorpay script (if not already loaded),
opens Razorpay payment popup
    ↓
User completes payment in Razorpay popup
    ↓ (inside Razorpay success handler)
Checkout.jsx calls Cloud Function: verifyPayment()
    ↓ (server-side)
verifyPayment checks HMAC signature, runs Firestore transaction:
  - decrements stock for each item
  - marks order paymentStatus='paid', orderStatus='placed'
    ↓ (returns to browser)
Browser clears cart, navigates to /?order=success
```

---

## 3. Authentication

### 🛍️ How Customers Log In

Customers can log in using:
- **Email + password** — they create an account with their email
- **Google** — one-tap sign-in with a Google account

Customers need to be logged in to access their Wishlist and Order History. Checkout does **not** require login.

### 🛍️ How Admin Access Works

The admin panel is at `/admin`. Only accounts that have been specifically granted admin access can see it. If a regular customer navigates to `/admin`, they see an "Access Denied" screen.

Admin access is granted using Firebase's **Custom Claims** system — a special flag set on a user's account directly in the Firebase server. It cannot be set from the website itself. To grant admin access, run the appropriate script in the `scripts/` folder using the Firebase Admin SDK service account.

### 🔧 Technical Details

**Auth flow:** `AuthContext.jsx` wraps `onAuthStateChanged`. The `AuthProvider` renders a full-screen loading spinner until auth state resolves.

**Admin guard:** `AdminRoutes.jsx` → `AdminGuard` calls `user.getIdTokenResult(true)` (forces a fresh server token) and checks `tokenResult.claims.admin === true`. Cannot be faked by modifying localStorage.

**Protected routes:** Wishlist and Account are wrapped in `ProtectedRoute` which redirects to `/login`.

**Auth methods configured in Firebase Console:**
- Email/Password ✅
- Google ✅

**Authorized domains** (Firebase Console → Authentication → Settings → Authorized Domains):
- `localhost` (local development)
- Your Vercel production domain
- Any custom domain

---

## 4. Payment Flow

### 🛍️ Overview

When a customer clicks "Pay Now":

1. Your server checks products exist, confirms real prices from your database, and checks stock availability.
2. A Razorpay payment window opens. The customer pays.
3. After payment, your server verifies Razorpay's tamper-proof signature.
4. Only after that verification passes does the server:
   - Deduct items from stock count
   - Mark the order as "Placed" and "Paid"

If the customer closes the payment window without paying, a `pending_payment` order record is created but **stock is not deducted**.

### 🔧 Step-by-Step Technical Walkthrough

#### Step 1 — `placeOrder` Cloud Function

Triggered by `Checkout.jsx` → `placeOrderFn(payload)` via `httpsCallable`.

1. Validates input (non-empty items, required customer fields, integer quantities ≥ 1)
2. Runs a Firestore **transaction** that:
   - Reads each product from Firestore
   - Looks up real price — **ignores any price sent by the client**
   - Validates size/color existence
   - Checks stock availability (throws `resource-exhausted` if insufficient)
   - Creates order as `{ orderStatus: 'pending_payment', paymentStatus: 'pending' }`
   - **Does NOT decrement stock** — stock deduction happens in `verifyPayment`
3. Creates a Razorpay order via `razorpay.orders.create()`
4. Returns `{ orderId, total, razorpayOrderId, razorpayKeyId }` to browser

#### Step 2 — Razorpay Popup (browser)

`Checkout.jsx` lazy-loads the Razorpay script (injected only when Pay Now is clicked, not on every page). Opens `new window.Razorpay({...})`.

- User dismisses popup → order stays `pending_payment`, stock untouched, user sees error
- Payment fails → user sees error, can retry
- Payment succeeds → Razorpay fires the `handler` callback

#### Step 3 — `verifyPayment` Cloud Function

Triggered by Razorpay's `handler` callback → `verifyPaymentFn({...})`.

1. Rejects unauthenticated calls (`request.auth?.uid` check)
2. Validates all 4 required fields are present
3. Computes HMAC-SHA256 signature and compares to `razorpay_signature`
4. On mismatch: marks order `failed`, throws `permission-denied`
5. On match: runs Firestore **transaction** that:
   - Reads order document
   - **Idempotency guard:** if already `paymentStatus === 'paid'`, returns immediately
   - Reads product documents
   - Decrements stock: `Math.max(0, currentStock - quantity)` (never goes negative)
   - Updates products with new stock
   - Updates order: `{ paymentStatus: 'paid', orderStatus: 'placed', razorpayPaymentId }`

### 🔧 Switching from Test to Live Keys

1. Get live keys from Razorpay Dashboard → Account & Settings → API Keys
2. Update Firebase Secret Manager:
   ```bash
   firebase functions:secrets:set RAZORPAY_KEY_ID
   firebase functions:secrets:set RAZORPAY_KEY_SECRET
   ```
3. Redeploy functions: `firebase deploy --only functions`
4. Update `VITE_RAZORPAY_KEY_ID` in Vercel Dashboard → Environment Variables

### 🔧 Secret Manager Secret Names

| Secret Name | Purpose |
|-------------|---------|
| `RAZORPAY_KEY_ID` | Razorpay publishable key (returned to browser at checkout time) |
| `RAZORPAY_KEY_SECRET` | Razorpay private signing key (never sent to browser) |

---

## 5. Cloud Functions Reference

Both functions deployed to region **`asia-south1`** (Mumbai). Firebase Functions v2 `onCall` — called via Firebase client SDK only.

---

### `placeOrder`

| | |
|-|-|
| **Purpose** | Validates cart server-side, creates Firestore order, creates Razorpay order |
| **Auth required** | No (guest checkout supported; uid stored as null) |
| **Secrets** | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` |
| **Region** | `asia-south1` |

**Input:**
```js
{
  customer: { name, phone, email, address1, address2, city, state, pincode },
  items: [{ productId, size, colorName, qty }]
}
```

**Output:**
```js
{ orderId, total, razorpayOrderId, razorpayKeyId }
```

**Errors:**

| Code | Meaning |
|------|---------|
| `invalid-argument` | Empty cart, missing customer fields, invalid item |
| `not-found` | Product no longer exists |
| `failed-precondition` | Color/size unavailable; invalid price |
| `resource-exhausted` | Not enough stock |
| `internal` | Razorpay API failure |

---

### `verifyPayment`

| | |
|-|-|
| **Purpose** | Verifies Razorpay HMAC signature, decrements stock, marks order paid |
| **Auth required** | Yes — unauthenticated calls rejected immediately |
| **Secrets** | `RAZORPAY_KEY_SECRET` |
| **Region** | `asia-south1` |

**Input:**
```js
{ orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
```

**Output:**
```js
{ success: true }
```

**Errors:**

| Code | Meaning |
|------|---------|
| `unauthenticated` | Not logged in |
| `invalid-argument` | Missing required fields |
| `permission-denied` | Signature mismatch (tampered payment) |
| `not-found` | Order document missing |

**Idempotency:** If called twice for the same order, stock is only decremented once (guarded by `paymentStatus === 'paid'` check).

---

## 6. Admin Panel Guide

### 🛍️ Accessing the Admin Panel

Navigate to `<your-site-url>/admin`. Must be logged in with an admin account.

### 🛍️ Dashboard (`/admin`)

| Card | What it shows |
|------|--------------|
| Total Products | Number of products in catalogue |
| Total Orders | All order records (including abandoned) |
| Total Revenue | Sum of orders where `paymentStatus === 'paid'` only |
| Pending Orders | Orders currently in "placed" or "processing" status |

Also shows: 6 most recent orders, and a low-stock alert for any product with ≤ 5 items remaining.

### 🛍️ Orders (`/admin/orders`)

Click any row to expand and see the full delivery address and itemised products.

**Payment column meanings:**
- **Paid** (green) — real confirmed payment; safe to fulfil
- **pending** — customer started but never completed checkout; no money collected
- **failed** — payment attempted and rejected; no money collected

**Order Status Lifecycle:**
```
pending_payment → placed → processing → shipped → delivered
                                              ↘
                                           cancelled
```

**For fulfilment: only process orders that show "Paid" AND "placed" or higher status.**

### 🛍️ Products (`/admin/products`)

Add, edit, or delete products. Three stock-tracking formats:

| Format | When to use |
|--------|------------|
| Plain sizes (labels only) | Frequent restocking; don't need exact counts |
| Sizes with stock numbers | Need exact inventory tracking |
| Colour variants | Products that come in multiple colours, each with own sizes/stock |

---

## 7. Deployment

### Frontend (Vercel)

Deploys automatically on every push to `main` branch.

**Pre-deploy checklist:**
- [ ] Tested locally: `npm run dev`
- [ ] No broken links or missing images
- [ ] New routes added to `KNOWN_ROUTE_PATTERNS` in `src/App.jsx`

**Manual push:**
```bash
git add .
git commit -m "Description"
git push origin main
```

**Environment variables:** Set in Vercel Dashboard → Project Settings → Environment Variables (not in `.env` in production).

---

### Cloud Functions (Firebase)

**Run only when `functions/index.js` or `functions/package.json` changed.**

**Pre-deploy checklist:**
- [ ] Lint passes: `cd functions && npm run lint`
- [ ] Tested locally: `cd functions && npm run serve`
- [ ] Live Razorpay keys updated in Secret Manager if switching from test

**Deploy commands:**
```bash
# Functions only (most common)
firebase deploy --only functions

# Everything (functions + all rules)
firebase deploy

# Rules only
firebase deploy --only firestore:rules

# View live logs
firebase functions:log
```

---

### Switching to Live Razorpay Keys

```bash
# 1. Update secrets
firebase functions:secrets:set RAZORPAY_KEY_ID
# paste: rzp_live_...

firebase functions:secrets:set RAZORPAY_KEY_SECRET
# paste: your live secret

# 2. Redeploy
firebase deploy --only functions

# 3. Update Vercel env var VITE_RAZORPAY_KEY_ID to the live key ID
```

---

## 8. Known Limitations

### 1. Abandoned `pending_payment` orders accumulate

When a customer closes the Razorpay popup without paying, a `pending_payment` order record stays in Firestore. Stock is **not** deducted. These are hidden from the customer's order history but visible in the admin panel under "All Statuses". They slightly inflate the "Total Orders" count.

**Planned fix:** Scheduled Cloud Function to mark orders older than 30 min still in `pending_payment` as `failed`.

### 2. No rate limiting or Firebase App Check

`placeOrder` and `verifyPayment` have no rate limiting. A malicious caller could make many rapid requests, burning Firebase quota.

**Planned fix:** Add `maxInstances` to function config; enable Firebase App Check.

### 3. Firestore order `allow update` is permissive for order owner

A logged-in user can update their own order documents directly via the client SDK (not just through Cloud Functions). In practice all legitimate updates go through Admin SDK. This is a belt-and-suspenders gap, not an active exploit.

**Planned fix:** Restrict `allow update` on orders to admin-only.

### 4. No email notifications

No automatic emails sent when order is placed or status changes.

**Planned fix:** Firebase Trigger Email extension or Cloud Function + SendGrid.

### 5. No COD option

Online payment (Razorpay) only.

### 6. No refund automation

Refunds must be initiated manually through Razorpay Dashboard.

---

## 9. Environment Variables & Secrets

### Frontend Variables (`.env` / Vercel Dashboard)

These are embedded in the compiled JS — they are **not secret**. Firebase config values are safe to expose; security comes from Firestore Rules.

| Variable | File | Purpose |
|----------|------|---------|
| `VITE_FIREBASE_API_KEY` | `firebaseConfig.js` | Firebase project key |
| `VITE_FIREBASE_AUTH_DOMAIN` | `firebaseConfig.js` | Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | `firebaseConfig.js` | Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | `firebaseConfig.js` | Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `firebaseConfig.js` | Sender ID |
| `VITE_FIREBASE_APP_ID` | `firebaseConfig.js` | App ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | `firebaseConfig.js` | GA4 ID |
| `VITE_RAZORPAY_KEY_ID` | Local dev ref only | In prod, key returned from Cloud Function |

### Cloud Functions Secrets (Firebase Secret Manager)

| Secret | Used in | If exposed |
|--------|---------|-----------|
| `RAZORPAY_KEY_ID` | `functions/index.js` | Rotate key in Razorpay Dashboard + update Secret Manager + redeploy |
| `RAZORPAY_KEY_SECRET` | `functions/index.js` | **Critical.** Rotate immediately in Razorpay. Review recent orders for fraud. Update Secret Manager. Redeploy. |

**Local dev only** (`functions/.env` — git-ignored):
```
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```
The `functions/.env` is only used with Firebase emulators locally. Production reads from Secret Manager.

---

## 10. Troubleshooting

### 🛍️ Payments have stopped working

Check in this order:

1. **Razorpay service status:** [status.razorpay.com](https://status.razorpay.com)
2. **Still in test mode?** Razorpay Dashboard top bar — if it says "Test Mode", live payments won't work
3. **Cloud Function errors?** Firebase Console → Functions → Logs — look for errors near the time payments stopped
4. **Secret rotated without redeploying?** Update Secret Manager then `firebase deploy --only functions`
5. **Specific payment method failing?** May be Razorpay-side (e.g., UPI outage)

### 🛍️ Website shows an old version / won't deploy

Check Vercel Dashboard → Deployments. A red ✗ means the build failed. Click it for the build log. Common causes:
- Syntax error in recently committed file
- Missing environment variable in Vercel settings
- Deleted/renamed file still being imported

### 🔧 "Firebase App not initialized" in browser console

A `VITE_FIREBASE_*` env var is missing. Check:
- Local: `.env` file exists with all 7 variables?
- Production: all 7 vars set in Vercel Dashboard?

### 🔧 Cloud Function deploy: "billing not enabled"

Cloud Functions require the Blaze (pay-as-you-go) plan. Firebase Console → Project Settings → Usage and billing.

### 🔧 Admin panel "Access Denied" for correct account

Custom claim not set. Check existing admins:
```bash
node scripts/listAdmins.js
```
Grant access using the appropriate script in `scripts/` with the user's Firebase UID (found in Firebase Console → Authentication → Users).

### 🔧 Log locations

| What | Where |
|------|-------|
| Cloud Function errors | Firebase Console → Functions → Logs |
| Failed payments | Razorpay Dashboard → Payments → filter by Failed |
| JS errors (dev only) | Browser DevTools → Console |
| Build failures | Vercel Dashboard → Deployments |
| Raw Firestore data | Firebase Console → Firestore Database |
| Storage files | Firebase Console → Storage |

---

*End of documentation. Last verified against codebase: 2026-08-02.*
