import { useState, useEffect, useCallback } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/firebaseConfig'

// ─── Shared module-level store (per-tab) ─────────────────────────────────────
let cachedProducts = null
let cachedAt       = null
let isFetching     = false

// Each mounted useProducts() registers its own setters here.
// When a fetch completes, ALL registered callbacks are called at once.
const subscribers = new Set()

function notifyAll(data) {
  subscribers.forEach(({ setProducts, setLoading, setError }) => {
    setProducts(data)
    setLoading(false)
    setError(null)
  })
}

// Cache is considered stale after 2 minutes.
const CACHE_TTL_MS        = 2 * 60 * 1000
// Background staleness check every 30 seconds.
const BACKGROUND_CHECK_MS = 30 * 1000

function isCacheStale() {
  if (!cachedProducts || !cachedAt) return true
  return Date.now() - cachedAt > CACHE_TTL_MS
}

// ─── Shared fetch ─────────────────────────────────────────────────────────────
async function doFetch() {
  if (isFetching) return
  isFetching = true
  try {
    const snap = await getDocs(collection(db, 'products'))
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    cachedProducts = data
    cachedAt       = Date.now()
    notifyAll(data)
  } catch {
    // silent — subscribers keep their current data; next interval will retry
  } finally {
    isFetching = false
  }
}

// ─── Cross-tab sync via BroadcastChannel ──────────────────────────────────────
// When the admin saves a product in Tab A, a message is broadcast so that
// Tab B (storefront) immediately re-fetches and updates — no page reload needed.
let bc = null
try {
  bc = new BroadcastChannel('resildas-products-sync')
  bc.onmessage = (e) => {
    if (e.data === 'invalidated') {
      // Another tab (admin) saved changes — bust our local cache and re-fetch.
      cachedProducts = null
      cachedAt       = null
      doFetch()
    }
  }
} catch {
  // BroadcastChannel not available (very old browsers) — graceful degradation.
}

// ─── Public invalidation helper ───────────────────────────────────────────────
// Call this after any admin write (add, edit, delete) to:
//  1. Bust this tab's cache and immediately re-fetch from Firestore.
//  2. Broadcast to ALL other open tabs so they also update instantly.
export async function invalidateProductsCache() {
  cachedProducts = null
  cachedAt       = null
  // Notify other tabs first (they can start fetching in parallel)
  try { bc?.postMessage('invalidated') } catch { /* ignore */ }
  // Fetch in this tab and push to all same-tab subscribers
  await doFetch()
}

// Keep the old name working too
export { invalidateProductsCache as clearProductsCache }

// ─── Singleton background refresh ─────────────────────────────────────────────
let backgroundTimer = null
function ensureBackgroundRefresh() {
  if (backgroundTimer) return
  backgroundTimer = setInterval(() => {
    if (isCacheStale()) doFetch()
  }, BACKGROUND_CHECK_MS)
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useProducts() {
  const [products, setProducts] = useState(cachedProducts ?? [])
  const [loading, setLoading]   = useState(isCacheStale())
  const [error, setError]       = useState(null)

  // React guarantees useState setters are stable — no ref needed.
  useEffect(() => {
    const sub = { setProducts, setLoading, setError }
    subscribers.add(sub)

    // Use cached data immediately if fresh; otherwise fetch.
    if (!isCacheStale()) {
      setProducts(cachedProducts)
      setLoading(false)
    } else {
      setLoading(true)
      doFetch()
    }

    ensureBackgroundRefresh()

    return () => {
      subscribers.delete(sub)
    }
  }, [setProducts, setLoading, setError])

  // Expose a manual refetch (bypasses TTL — useful for pull-to-refresh).
  const refetch = useCallback(() => {
    setLoading(true)
    return doFetch()
  }, [setLoading])

  return { products, loading, error, refetch }
}