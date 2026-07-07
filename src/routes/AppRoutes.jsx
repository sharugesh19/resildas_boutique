import { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import PageTransition from '../components/common/PageTransition'
import Loader from '../components/common/Loader'

const Home              = lazy(() => import('../pages/Home'))
const Products          = lazy(() => import('../pages/Products'))
const ProductDetail     = lazy(() => import('../pages/ProductDetail'))
const Wishlist          = lazy(() => import('../pages/Wishlist'))
const Account           = lazy(() => import('../pages/Account'))
const Login             = lazy(() => import('../pages/Login'))
const Checkout          = lazy(() => import('../pages/Checkout'))
const NotFound          = lazy(() => import('../pages/NotFound'))
const ProtectedRoute = lazy(() => import('../components/common/ProtectedRoute'))
const AdminRoutes       = lazy(() => import('../admin/AdminRoutes'))

function PageLoader() {
  return <Loader fullScreen={false} />
}

function AppRoutes() {
  const location = useLocation()

  return (
    <Suspense fallback={<PageLoader />}>
      {/*
        AnimatePresence watches for route changes and plays exit animation
        before the new page mounts. mode="wait" ensures one page exits
        fully before the next one enters.
      */}
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

          {/* Protected — login required */}
          <Route path="/wishlist" element={
            <PageTransition>
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            </PageTransition>
          } />
           <Route path="/account" element={
            <PageTransition>
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            </PageTransition>
          } />

          {/* Admin Panel — no transition, it has its own layout */}
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