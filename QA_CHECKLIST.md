# End-to-End QA Checklist: Resilda's Boutique

This checklist outlines the comprehensive end-to-end (E2E) testing procedures for Resilda's Boutique frontend application. Developers should use this document to verify code correctness, routing behavior, database sync, and user workflows before any production deployment.

> [!NOTE]
> **Out-of-Scope / Ignored for this QA Version:**
> - WhatsApp chat link placeholders (`https://wa.me/919876543210` and phone number placeholders in the contact section) are ignored.
> - Store directions and map embed location placeholders (showing Coimbatore on maps instead of Udumalaipettai) are ignored.

---

## Table of Contents
1. [User Authentication & Accounts](#1-user-authentication--accounts)
2. [Product Catalog & Search](#2-product-catalog--search)
3. [Wishlist & Cart Operations](#3-wishlist--cart-operations)
4. [Checkout & Order Placement](#4-checkout--order-placement)
5. [Admin Panel & Order Management](#5-admin-panel--order-management)
6. [Cross-Cutting Concerns (SEO, Responsive UI, Performance)](#6-cross-cutting-concerns-seo-responsive-ui-performance)

---

## 1. User Authentication & Accounts

### Sign-In and Registration
- [ ] **Email & Password Authentication**
  - Verify that a user can sign up with a valid email and a strong password.
  - Verify that a user cannot sign up with an existing email.
  - Verify error handling for invalid credentials, weak passwords, and incorrectly formatted emails.
- [ ] **Google Sign-In**
  - Verify that clicking the Google Sign-In button correctly opens the Google authentication popup/redirect.
  - Verify that successful Google login correctly creates a user profile and logs the user in.
- [ ] **State Preservation & Redirects**
  - Verify that if an unauthenticated user tries to visit a protected route (e.g., `/checkout`, `/account`, `/wishlist`), they are redirected to `/login` with a `redirect` query parameter.
  - Verify that logging in successfully redirects the user back to the originally requested page.

### Account Dashboard
- [ ] **Profile Display**
  - Verify that the logged-in user's display name and email address are shown correctly on `/account`.
- [ ] **Order History Integration**
  - Verify that the order history loads from the Firestore `orders` collection and displays all past orders placed by the current user.
  - Verify that orders are ordered chronologically by creation date (newest first).
  - Verify order summary details: Order ID (truncated or full), total cost formatting, order date (formatted `DD MMM YYYY`), and order status label.
- [ ] **Logout Flow**
  - Verify that clicking "Sign Out" signs the user out of Firebase Auth, clears local user state, and redirects the user back to the Home page (`/`).

---

## 2. Product Catalog & Search

### Home Page Sections
- [ ] **Hero Section**
  - Verify the entry transition animations load smoothly.
  - Verify that CTA buttons link to `/products`.
- [ ] **New Arrivals & Best Sellers Carousels**
  - Verify that carousels display products correctly and are navigable on both desktop and mobile devices.
  - Verify clicking a product card opens the correct product detail page (`/product/:id`).
- [ ] **Category Sections**
  - Verify that category grid cards route to `/products/:category` and filter the product catalog accordingly.

### Product Listing & Filters
- [ ] **Filtering Mechanics**
  - Verify category filters display products corresponding to the chosen category.
  - Verify multiple filters (e.g., size, color, sorting options) can be applied and clear out stale listings.
- [ ] **Search Functionality**
  - Verify that typing in the search bar dynamically filters products by matching name, description, or tags.
  - Verify search results update instantly or upon pressing enter.
  - Verify that empty state designs are displayed when no products match the query.

### Product Detail Page (`/product/:id`)
- [ ] **Image Gallery**
  - Verify that thumbnails update the main image correctly upon click/hover.
  - Verify image layout maintains aspect ratio and scales responsively.
- [ ] **Variant Selector**
  - Verify size selection is required before adding a product to the cart.
  - Verify stock indicator displays warning text if stock is low, or shows "Out of Stock" (disabling Add to Cart) when stock is 0.
- [ ] **Cart & Wishlist Actions**
  - Verify clicking "Add to Cart" opens the Cart Drawer and lists the newly added item with the chosen size/color.
  - Verify clicking "Add to Wishlist" adds the item to the wishlist (saving it to the database for logged-in users).

---

## 3. Wishlist & Cart Operations

### Wishlist Page (`/wishlist`)
- [ ] **Authentication Guard**
  - Verify that only authenticated users can access the wishlist.
- [ ] **Operations**
  - Verify items can be added directly to the wishlist from product cards and product details.
  - Verify items can be removed from the wishlist.
  - Verify that adding a wishlisted item to the cart does not crash the wishlist view.

### Cart Drawer
- [ ] **UI Transitions & Display**
  - Verify that the Cart Drawer slides out smoothly from the side of the screen when toggled.
  - Verify the item count indicator in the Navbar updates dynamically.
- [ ] **Quantity & Variant Adjustment**
  - Verify users can increase/decrease quantities of items directly from the drawer.
  - Verify items are removed from the cart if quantity is reduced to 0 or when "Remove" is clicked.
  - Verify that adding the same product with a *different* size creates a separate cart item.
- [ ] **Subtotal Calculation**
  - Verify the cart subtotal is computed correctly by adding `price * quantity` for all line items.

---

## 4. Checkout & Order Placement

### Cart Guard
- [ ] **Empty Cart Verification**
  - Verify that navigating to `/checkout` with an empty cart displays a prompt stating the cart is empty and links back to `/products`.

### Delivery Details Validation
- [ ] **Full Name & Address Fields**
  - Verify that the Full Name, Address Line 1, City, and State are required fields.
- [ ] **Phone Number Validation**
  - Test phone numbers against regex: `^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$`.
  - Verify that invalid phone inputs (e.g. letters, short numbers, incorrect country codes) trigger an validation error.
- [ ] **Pincode Validation**
  - Test 6-digit Indian pincode input against regex: `/^[1-9][0-9]{5}$/` (must not start with 0 and must be exactly 6 digits).
  - Verify typing non-digits is prevented or stripped instantly.
- [ ] **State Dropdown Selection**
  - Verify the state selector displays all Indian States and Territories and binds selection correctly.

### Order Submission & Firestore Sync
- [ ] **Prepaid Order Creation**
  - Verify that clicking "Pay Now" successfully submits the order payload to the Firestore `orders` collection with:
    - `userId` (bound to logged-in user)
    - Customer Details (Name, Phone, Email, Delivery Address)
    - Items Array (Product ID, Name, Price, Quantity, Size, Color, Image URL)
    - `total` (Order subtotal, free shipping applied)
    - `paymentMethod: 'prepaid'`
    - `orderStatus: 'placed'`
    - `createdAt` (server timestamp)
- [ ] **Post-Order Clean-up**
  - Verify that once the order is placed:
    - The local cart context is cleared completely.
    - The user is redirected to the home page with the query param `?order=success`.
    - A success toast or modal notification is displayed.

---

## 5. Admin Panel & Order Management

### Route Access Control
- [ ] **Authentication Guard**
  - Verify that only users logged in with an email matching the environment configuration `VITE_ADMIN_EMAIL` can access `/admin/*`.
  - Verify that non-admin logged-in users are blocked or redirected.

### Product Management (`/admin/products`)
- [ ] **Add/Edit Product Form**
  - Verify all fields (Name, Category, Price, Description) are saved correctly.
  - Verify the Size & Stock editor stores custom size-to-stock mappings.
  - Verify Color variants can be declared and saved.
  - Verify product image uploading to Firebase Storage saves the downloadable URLs into the product's database record.
- [ ] **Delete Product**
  - Verify deleting a product removes it from both Firestore and the frontend catalog.

### Order Management (`/admin/orders`)
- [ ] **Order Tracking**
  - Verify the admin can view all customer orders sorted by date.
- [ ] **Status Updates**
  - Verify that changing the order status (e.g., from `placed` to `processing` or `shipped`) updates the database record instantly.
  - Verify that updating status reflects immediately on the customer's `/account` page.

---

## 6. Cross-Cutting Concerns (SEO, Responsive UI, Performance)

### SEO & Layout Semantics
- [ ] **React Helmet Elements**
  - Verify each page has a unique, descriptive `<title>`.
  - Verify meta descriptions and OG tag values are populated correctly.
- [ ] **Structured Schema (JSON-LD)**
  - Verify the Local Business schema markup loads correctly on the home page.

### Layout & Responsiveness
- [ ] **Mobile & Tablet Display**
  - Verify navbar collapses into a functional hamburger menu.
  - Verify search drawer and cart drawer do not overflow on viewport widths under 360px.
- [ ] **Page Transitions & Fallbacks**
  - Verify Framer Motion exit animations load without layout shifts.
  - Verify Suspense `Loader` components are displayed during lazy-loading page chunks.
- [ ] **Global Error Boundary**
  - Verify that a React layout crash triggers the global fallback screen instead of showing a blank white page.
