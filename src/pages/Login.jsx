import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../context/AuthContext'

const TABS = { LOGIN: 'login', REGISTER: 'register', RESET: 'reset' }

function Login() {
  const [tab, setTab]         = useState(TABS.LOGIN)
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]       = useState('')
  const [error, setError]     = useState('')
  const [info, setInfo]       = useState('')
  const [loading, setLoading] = useState(false)

  const { login, register, loginWithGoogle, resetPassword } = useAuth()
  const navigate       = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect       = searchParams.get('redirect') || '/'

  const clearMessages = () => { setError(''); setInfo('') }

  const handleLogin = async (e) => {
    e.preventDefault()
    clearMessages()
    setLoading(true)
    try {
      await login(email, password)
      navigate(redirect, { replace: true })
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
      navigate(redirect, { replace: true })
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
            <div className="form-group">
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
            <div className="form-group">
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
            <button type="submit" className="btn btn--primary auth-form__submit" disabled={loading}>
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
            <div className="form-group">
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
            <div className="form-group">
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
            <div className="form-group">
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
            <button type="submit" className="btn btn--primary auth-form__submit" disabled={loading}>
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
            <div className="form-group">
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
            <button type="submit" className="btn btn--primary auth-form__submit" disabled={loading}>
              {loading ? 'Sending…' : 'Send Reset Link'}
            </button>
            <button
              type="button"
              className="auth-form__forgot"
              onClick={() => { setTab(TABS.LOGIN); clearMessages() }}
            >
              ← Back to Sign In
            </button>
          </form>
        )}

        {/* Google */}
        {tab !== TABS.RESET && (
          <div className="auth-divider">
            <span>or</span>
          </div>
        )}
        {tab !== TABS.RESET && (
          <button
            className="btn btn--google"
            onClick={handleGoogle}
            disabled={loading}
          >
            <img src="/images/google-icon.svg" alt="" width={18} height={18} />
            Continue with Google
          </button>
        )}
      </div>
    </main>
  )
}

export default Login