# Resilda's Boutique — Frontend

Premium ethnic wear ecommerce store built with React + Vite + Firebase.

## Tech Stack
- React 18 + Vite
- React Router v6
- Firebase (Auth, Firestore, Storage)
- CSS Variables (no UI framework)

## Project Structure
src/

├── admin/          # Admin panel (protected)

├── components/     # Reusable components

├── context/        # Auth, Cart, Wishlist contexts

├── data/           # Static product/category data

├── firebase/       # Firebase config

├── pages/          # Route-level pages

├── routes/         # App routing

├── styles/         # Global CSS

└── utils/          # Helper functions

## Environment Variables
Create a `.env` file in the root with:
VITE_FIREBASE_API_KEY=

VITE_FIREBASE_AUTH_DOMAIN=

VITE_FIREBASE_PROJECT_ID=

VITE_FIREBASE_STORAGE_BUCKET=

VITE_FIREBASE_MESSAGING_SENDER_ID=

VITE_FIREBASE_APP_ID=

VITE_FIREBASE_MEASUREMENT_ID=

VITE_ADMIN_EMAIL=

## Local Development
```bash
npm install
npm run dev
```

## Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password + Google)
3. Enable Firestore Database
4. Upgrade to Blaze plan for Storage + Cloud Functions
5. Deploy security rules:
```bash
npx firebase deploy --only firestore:rules,storage
```

## Admin Panel
- Visit `/login` and sign in with the admin email set in `VITE_ADMIN_EMAIL`
- Then visit `/admin`
- After Blaze upgrade: admin access will be controlled via Firebase Custom Claims

## Pending (requires Firebase Blaze)
- Firebase Storage (product image uploads)
- Razorpay payment integration
- Cloud Functions (order notifications, custom claims)
- Storage security rules deployment

## Store Address
Resilda's Boutique
1st Floor, 11, 2nd Street, near UK hospital,
Aishwarya Nagar, Udumalaipettai,
Tamil Nadu 642154