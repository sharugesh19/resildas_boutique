/**
 * REQUIRE LOGIN HELPER
 * Use this in event handlers that need authentication
 * (e.g. wishlist toggle from a product card).
 *
 * Usage:
 *   import { requireLogin } from '../utils/requireLogin'
 *
 *   const handleWishlist = () => {
 *     if (!requireLogin(isLoggedIn, navigate)) return
 *     toggleWishlist(product.id)
 *   }
 */

/**
 * @param {boolean}  isLoggedIn   - from useAuth()
 * @param {Function} navigate     - from useNavigate()
 * @param {string}   [redirect]   - where to send the user after login (default: current path)
 * @returns {boolean}             - true if logged in, false if redirected
 */
export function requireLogin(isLoggedIn, navigate, redirect = null) {
  if (isLoggedIn) return true

  const returnTo = redirect ?? window.location.pathname
  navigate(`/login?redirect=${encodeURIComponent(returnTo)}`)
  return false
}