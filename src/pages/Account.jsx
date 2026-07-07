// src/pages/Account.jsx
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { auth, db } from '../firebase/firebaseConfig'
import { useAuth } from '../hooks/useAuth'
import { formatPrice } from '../utils/formatPrice'

const STATUS_LABEL = {
  placed: 'Placed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

function Account() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return

    async function fetchOrders() {
      setLoading(true)
      setError(null)
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        )
        const snap = await getDocs(q)
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      } catch (err) {
        console.error('ORDER FETCH ERROR:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/')
  }

  const fmtDate = (ts) => {
    if (!ts) return '—'
    const d = ts.toDate ? ts.toDate() : new Date(ts)
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <main
      className="container"
      style={{
        padding: '2rem 1rem 4rem',
        maxWidth: 800,
        margin: '0 auto',
        marginTop: 'calc(var(--navbar-height, 88px) + 24px)',
      }}
    >
      <Helmet>
        <title>My Account | Resilda's Boutique</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* ── Profile card ── */}
      <div
        style={{
          padding: '1.75rem',
          borderRadius: 12,
          border: '1px solid rgba(0,0,0,0.08)',
          background: '#f9f7f4',
          marginBottom: '2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>
            {user?.displayName || 'My Account'}
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>{user?.email}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link
            to="/wishlist"
            style={{
              padding: '0.6rem 1.25rem',
              border: '1.5px solid rgba(0,0,0,0.15)',
              borderRadius: 8,
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
              color: '#000',
            }}
          >
            My Wishlist
          </Link>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.6rem 1.25rem',
              border: 'none',
              borderRadius: 8,
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: '#000',
              color: '#fff',
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* ── Order history ── */}
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Order History</h2>

      {loading && (
        <p style={{ color: '#666', textAlign: 'center', padding: '2rem 0' }}>
          Loading your orders…
        </p>
      )}

      {!loading && error && (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <p style={{ color: '#666', marginBottom: 16 }}>
            We couldn't load your orders right now. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.6rem 1.5rem',
              background: 'var(--color-gold, #c2903a)',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            border: '1px dashed rgba(0,0,0,0.15)',
            borderRadius: 12,
          }}
        >
          <p style={{ color: '#666', marginBottom: 16 }}>
            You haven't placed any orders yet.
          </p>
          <Link
            to="/products"
            style={{
              padding: '0.6rem 1.5rem',
              background: 'var(--color-gold, #c2903a)',
              borderRadius: 8,
              fontWeight: 600,
              textDecoration: 'none',
              color: '#000',
            }}
          >
            Start Shopping
          </Link>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((o) => (
            <div
              key={o.id}
              style={{
                padding: '1.25rem',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 12,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div>
                <p style={{ fontSize: '0.75rem', color: '#999', marginBottom: 4 }}>
                  Order #{o.id.slice(0, 8).toUpperCase()} · {fmtDate(o.createdAt)}
                </p>
                <p style={{ fontWeight: 600 }}>{formatPrice(o.total || 0)}</p>
              </div>
              <span
                style={{
                  padding: '0.35rem 0.9rem',
                  borderRadius: 999,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: 'rgba(194,144,58,0.12)',
                  color: '#8a6420',
                }}
              >
                {STATUS_LABEL[o.orderStatus] || 'Placed'}
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default Account