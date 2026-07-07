import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

/**
 * Wraps any route that requires login.
 * Redirects to /login with a `redirect` param so the user is
 * sent back to their original destination after logging in.
 */
function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  const location       = useLocation()

  if (!isLoggedIn) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    )
  }

  return children
}

export default ProtectedRoute
