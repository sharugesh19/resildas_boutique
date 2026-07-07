# QA Audit Implementation: Developer TODO List

This document acts as the developer task checklist to address the vulnerabilities, security gaps, and configuration issues identified in the Freelance QA Audit Report. 

Each issue has been verified against the current codebase and is confirmed as **still active and needing resolution**.

---

## 🔴 CRITICAL (Immediate Fix Required)

### 1. Stop the "Free Order" Checkout Bug
- **File:** [Checkout.jsx](file:///c:/Users/user/Downloads/resildas_boutique-main/resildas_boutique-main/src/pages/Checkout.jsx)
- **Status:** 🔴 **Confirmed Active.** Orders are saved directly to Firestore without executing a payment flow.
- **Tasks:**
  - [ ] Integrate the actual Razorpay checkout SDK flow in the browser.
  - [ ] Implement signature validation on a backend environment (such as a Firebase Cloud Function) before writing the order to Firestore or updating the status.
  - [ ] *Alternative (Temporary):* If Razorpay cannot be configured yet due to lack of a Firebase Blaze plan, change the "Pay Now" flow to trigger a WhatsApp checkout redirection with the order details, or set `orderStatus` to `pending_payment` and mark the payment method as `Manual Bank Transfer / Cod` with strict admin verification.

### 2. Secure Order Pricing and Totals
- **Files:** [Checkout.jsx](file:///c:/Users/user/Downloads/resildas_boutique-main/resildas_boutique-main/src/pages/Checkout.jsx), [CartContext.jsx](file:///c:/Users/user/Downloads/resildas_boutique-main/resildas_boutique-main/src/context/CartContext.jsx)
- **Status:** 🔴 **Confirmed Active.** Checkout total and item prices are written directly from the client's `localStorage` / cart state to the Firestore order doc.
- **Tasks:**
  - [ ] Modify the checkout write behavior: never trust client-submitted `price` or `total` fields.
  - [ ] Re-calculate item prices on a secure backend (Cloud Function) using Firestore `products/{id}` documents as the single source of truth prior to validating payments and creating orders.
  - [ ] Update Firestore rules for `orders` collection writes to ensure client-provided totals match expectations, or restrict direct client writes to orders entirely (using a secure Cloud Function instead).

---

## 🟠 HIGH PRIORITY

### 3. Add Stock Decrement & Overselling Protection
- **Files:** [Checkout.jsx](file:///c:/Users/user/Downloads/resildas_boutique-main/resildas_boutique-main/src/pages/Checkout.jsx), [ProductDetail.jsx](file:///c:/Users/user/Downloads/resildas_boutique-main/resildas_boutique-main/src/pages/ProductDetail.jsx)
- **Status:** 🟠 **Confirmed Active.** Product stock counts are read-only on the frontend and are never updated in Firestore when orders are created.
- **Tasks:**
  - [ ] Wrap checkout order placement inside a Firestore Transaction.
  - [ ] For each item in the order, read the current stock for the selected size/color variant from Firestore.
  - [ ] Verify that requested quantity is available; if not, reject order creation and notify the user of stock exhaustion.
  - [ ] Decrement the matching stock quantity in the database as part of the transaction block.

### 4. Scrub PII and Local Directories from Admin Scripts
- **Files:** [setAdminClaim.js](file:///c:/Users/user/Downloads/resildas_boutique-main/resildas_boutique-main/scripts/setAdminClaim.js), [uploadProducts.js](file:///c:/Users/user/Downloads/resildas_boutique-main/resildas_boutique-main/scripts/uploadProducts.js)
- **Status:** 🟠 **Confirmed Active.** Hardcoded personal email addresses are present in `setAdminClaim.js` comments, and a local Windows user path (`C:\Users\kmahe\OneDrive\Desktop\product-images`) is hardcoded in `uploadProducts.js`.
- **Tasks:**
  - [ ] Replace the hardcoded email in `setAdminClaim.js` (lines 7, 9) with generic instructions or placeholders (e.g., `admin@example.com`).
  - [ ] Change the hardcoded absolute directory in `uploadProducts.js` (line 30) to retrieve the image directory path dynamically via environment variables or CLI arguments (e.g., `process.env.PRODUCT_IMAGES_DIR` or `process.argv[2]`).

---

## 🟡 MEDIUM PRIORITY

### 5. Catalog Pagination in `useProducts`
- **File:** [useProducts.js](file:///c:/Users/user/Downloads/resildas_boutique-main/resildas_boutique-main/src/hooks/useProducts.js)
- **Status:** 🟡 **Confirmed Active.** The hook reads the entire `products` collection without category limits or query cursor pagination.
- **Tasks:**
  - [ ] Add query limits and cursor pagination to `getDocs(collection(db, 'products'))` so the catalog loads in chunks (e.g., 20 items per page).
  - [ ] Filter by category at the database query level rather than pulling all products into memory and filtering client-side.

### 6. Introduce Automated Testing and CI Checks
- **Status:** 🟡 **Confirmed Active.** No test suite or CI pipelines exist.
- **Tasks:**
  - [ ] Set up Vitest or Jest along with React Testing Library.
  - [ ] Write integration tests for the checkout flow (specifically verifying that order placement fails or remains pending if payment is invalid).
  - [ ] Set up a GitHub Action to run ESLint and test checks automatically on every pull request to `main`.

---

## 🟢 LOW PRIORITY & NIT-PICKS

### 7. File Size Validation for Image Uploads
- **Files:** [ImageUploader.jsx](file:///c:/Users/user/Downloads/resildas_boutique-main/resildas_boutique-main/src/admin/ImageUploader.jsx), `storage.rules`
- **Status:** 🟢 **Confirmed Active.** Size constraints are not verified in Firestore storage rules or fully on client-side uploads.
- **Tasks:**
  - [ ] Add a file size validator in `ImageUploader.jsx` (e.g. limit to 5MB per image).
  - [ ] Update `storage.rules` to enforce maximum size limits on uploaded files (`request.resource.size < 5 * 1024 * 1024`).

### 8. Pincode and Phone Validation Sync
- **Files:** [Checkout.jsx](file:///c:/Users/user/Downloads/resildas_boutique-main/resildas_boutique-main/src/pages/Checkout.jsx), `firestore.rules`
- **Status:** 🟢 **Confirmed Active.** Validation regexes exist only in frontend JS.
- **Tasks:**
  - [ ] Add validation checks inside `firestore.rules` to assert that order payloads conform to the expected format (e.g., pincode matches regex, phone matches pattern).

### 9. Update README.md Mismatches
- **File:** [README.md](file:///c:/Users/user/Downloads/resildas_boutique-main/resildas_boutique-main/README.md)
- **Status:** 🟢 **Confirmed Active.** The README mentions Razorpay as a "Pending" task, whereas the Checkout UI presents it as live.
- **Tasks:**
  - [ ] Align the wording in README and the checkout page. Clearly label the checkout payment method as a test/sandbox version or update the UI text to reflect actual system capabilities.
