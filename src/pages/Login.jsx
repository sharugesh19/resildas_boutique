import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../hooks/useAuth'
import { ArrowLeftIcon } from '../components/common/Icons'

const TABS = { LOGIN: 'login', REGISTER: 'register', RESET: 'reset' }

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
  )
}

function Login() {
  const [tab, setTab]         = useState(TABS.LOGIN)
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]       = useState('')
  const [error, setError]     = useState('')
  const [info, setInfo]       = useState('')
  const [loading, setLoading] = useState(false)

  const { login, register, loginWithGoogle, resetPassword, isLoggedIn } = useAuth()
  const navigate       = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect       = searchParams.get('redirect') || '/'

  // Redirect once auth state resolves to logged-in.
  // Covers normal login/register AND coming back from the Google redirect flow.
  useEffect(() => {
    if (isLoggedIn) {
      navigate(redirect, { replace: true })
    }
  }, [isLoggedIn, redirect, navigate])

  const clearMessages = () => { setError(''); setInfo('') }

  const handleLogin = async (e) => {
    e.preventDefault()
    clearMessages()
    setLoading(true)
    try {
      await login(email, password)
      // useEffect above will handle navigation once isLoggedIn updates
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    clearMessages()
    setLoading(true)
    try {
      await register(email, password, name)
      // useEffect above will handle navigation once isLoggedIn updates
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
  clearMessages()
  setLoading(true)
  try {
    await loginWithGoogle()
    navigate(redirect, { replace: true })
  } catch (err) {
    setError(err.message || 'Google sign-in failed.')
  } finally {
    setLoading(false)
  }
}

  const handleReset = async (e) => {
    e.preventDefault()
    clearMessages()
    setLoading(true)
    try {
      await resetPassword(email)
      setInfo('Password reset email sent. Please check your inbox.')
    } catch (err) {
      setError(err.message || 'Could not send reset email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <Helmet>
        <title>Sign In | Resilda's Boutique</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="auth-card">
        <h1 className="auth-card__title">Resilda's Boutique</h1>

        {/* Tab switcher */}
        {tab !== TABS.RESET && (
          <div className="auth-tabs">
            <button
              className={`auth-tab${tab === TABS.LOGIN ? ' auth-tab--active' : ''}`}
              onClick={() => { setTab(TABS.LOGIN); clearMessages() }}
            >
              Sign In
            </button>
            <button
              className={`auth-tab${tab === TABS.REGISTER ? ' auth-tab--active' : ''}`}
              onClick={() => { setTab(TABS.REGISTER); clearMessages() }}
            >
              Register
            </button>
          </div>
        )}

        {error && <p className="auth-error">{error}</p>}
        {info  && <p className="auth-info">{info}</p>}

        {/* Login */}
        {tab === TABS.LOGIN && (
          <form className="auth-form" onSubmit={handleLogin} noValidate>
            <div className="form-field">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>
            <div className="form-field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="auth-form__submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
            <button
              type="button"
              className="auth-form__forgot"
              onClick={() => { setTab(TABS.RESET); clearMessages() }}
            >
              Forgot password?
            </button>
          </form>
        )}

        {/* Register */}
        {tab === TABS.REGISTER && (
          <form className="auth-form" onSubmit={handleRegister} noValidate>
            <div className="form-field">
              <label htmlFor="reg-name">Full Name</label>
              <input
                id="reg-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
              />
            </div>
            <div className="form-field">
              <label htmlFor="reg-email">Email</label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>
            <div className="form-field">
              <label htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Min. 6 characters"
                autoComplete="new-password"
              />
            </div>
            <button type="submit" className="auth-form__submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        )}

        {/* Reset password */}
        {tab === TABS.RESET && (
          <form className="auth-form" onSubmit={handleReset} noValidate>
            <p style={{ marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
              Enter your email and we'll send you a link to reset your password.
            </p>
            <div className="form-field">
              <label htmlFor="reset-email">Email</label>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>
            <button type="submit" className="auth-form__submit" disabled={loading}>
              {loading ? 'Sending…' : 'Send Reset Link'}
            </button>
            <button
              type="button"
              className="auth-form__forgot"
              onClick={() => { setTab(TABS.LOGIN); clearMessages() }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              <ArrowLeftIcon size={14} /> Back to Sign In
            </button>
          </form>
        )}

        {/* Google */}
        {tab !== TABS.RESET && (
          <>
            <div className="auth-divider">
              <span>or</span>
            </div>
            <button
              className="btn-google"
              onClick={handleGoogle}
              disabled={loading}
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </>
        )}
      </div>
    </main>
  )
}

export default Login