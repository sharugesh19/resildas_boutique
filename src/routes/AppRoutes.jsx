import { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import PageTransition from '../components/common/PageTransition'
import Loader from '../components/common/Loader'
import Home from '../pages/Home'


const Products          = lazy(() => import('../pages/Products'))
const ProductDetail     = lazy(() => import('../pages/ProductDetail'))
const Wishlist          = lazy(() => import('../pages/Wishlist'))
const Account           = lazy(() => import('../pages/Account'))
const Login             = lazy(() => import('../pages/Login'))
const Checkout          = lazy(() => import('../pages/Checkout'))
const NotFound          = lazy(() => import('../pages/NotFound'))
const ProtectedRoute    = lazy(() => import('../components/common/ProtectedRoute'))
const AdminRoutes       = lazy(() => import('../admin/AdminRoutes'))
const About              = lazy(() => import('../pages/About'))
// Policy pages
const ShippingPolicy    = lazy(() => import('../pages/ShippingPolicy'))
const ReturnPolicy      = lazy(() => import('../pages/ReturnPolicy'))
const PrivacyPolicy     = lazy(() => import('../pages/PrivacyPolicy'))
const TermsConditions   = lazy(() => import('../pages/TermsConditions'))

function PageLoader() {
  return <Loader fullScreen={true} />
}

function AppRoutes() {
  const location = useLocation()

  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>

          {/* Public routes */}
          <Route path="/" element={
            <PageTransition><Home /></PageTransition>
          } />
          <Route path="/products" element={
            <PageTransition><Products /></PageTransition>
          } />
          <Route path="/products/:category" element={
            <PageTransition><Products /></PageTransition>
          } />
          <Route path="/product/:id" element={
            <PageTransition><ProductDetail /></PageTransition>
          } />
          <Route path="/login" element={
            <PageTransition><Login /></PageTransition>
          } />
          <Route path="/checkout" element={
            <PageTransition><Checkout /></PageTransition>
          } />
          <Route path="/about" element={
            <PageTransition><About /></PageTransition>
          } />

          {/* Policy pages */}
          <Route path="/shipping-policy" element={
            <PageTransition><ShippingPolicy /></PageTransition>
          } />
          <Route path="/return-policy" element={
            <PageTransition><ReturnPolicy /></PageTransition>
          } />
          <Route path="/privacy-policy" element={
            <PageTransition><PrivacyPolicy /></PageTransition>
          } />
          <Route path="/terms-and-conditions" element={
            <PageTransition><TermsConditions /></PageTransition>
          } />

          {/* Protected — login required */}
          <Route path="/wishlist" element={
            <PageTransition>
              <ProtectedRoute><Wishlist /></ProtectedRoute>
            </PageTransition>
          } />
          <Route path="/account" element={
            <PageTransition>
              <ProtectedRoute><Account /></ProtectedRoute>
            </PageTransition>
          } />

          {/* Admin Panel */}
          <Route path="/admin/*" element={<AdminRoutes />} />

          {/* 404 */}
          <Route path="*" element={
            <PageTransition><NotFound /></PageTransition>
          } />

        </Routes>
      </AnimatePresence>
    </Suspense>
  )
}

export default AppRoutes