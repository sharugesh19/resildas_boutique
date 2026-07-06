import { useState, useEffect, useCallback } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/firebaseConfig'

let cachedProducts = null
let cachedAt = null

// Cache is considered stale after this long — new products added in the
// admin panel will show up on the storefront automatically once this
// expires, without needing a manual page refresh.
const CACHE_TTL_MS = 2 * 60 * 1000 // 2 minutes

function isCacheStale() {
  if (!cachedProducts || !cachedAt) return true
  return Date.now() - cachedAt > CACHE_TTL_MS
}

export function useProducts() {
  const [products, setProducts] = useState(cachedProducts ?? [])
  const [loading, setLoading]   = useState(isCacheStale())
  const [error, setError]       = useState(null)

  const fetchProducts = useCallback(async (force = false) => {
    if (!force && !isCacheStale()) {
      setProducts(cachedProducts)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const snap = await getDocs(collection(db, 'products'))
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      cachedProducts = data
      cachedAt = Date.now()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function run() {
      if (!isCacheStale()) {
        setProducts(cachedProducts)
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const snap = await getDocs(collection(db, 'products'))
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        if (!cancelled) {
          cachedProducts = data
          cachedAt = Date.now()
          setProducts(data)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      }
    }

    run()
    return () => { cancelled = true }
  }, [])

  // Call refetch(true) after admin add/edit/delete to force a fresh
  // read immediately, bypassing the TTL.
  const refetch = useCallback(() => fetchProducts(true), [fetchProducts])

  return { products, loading, error, refetch }
}