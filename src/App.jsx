import { BrowserRouter, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { trackPageView } from './utils/analytics'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import AppRoutes from './routes/AppRoutes'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import CartDrawer from './components/common/CartDrawer'
import Toast from './components/common/Toast'
import ScrollToTop from './components/common/ScrollToTop'
import ErrorBoundary from './components/common/ErrorBoundary'

// useLocation() only works inside <BrowserRouter>, so the check has to live
// in a component rendered *inside* it — App() itself renders BrowserRouter,
// so it can't call useLocation directly.
function AppShell() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  useEffect(() => {
    if (isAdminRoute) return // don't track admin/dashboard traffic, only real customer visits
    trackPageView(location.pathname + location.search)
  }, [location, isAdminRoute])

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      <AppRoutes />
      {!isAdminRoute && <Footer />}
      <CartDrawer />
      <Toast />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <AppShell />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App