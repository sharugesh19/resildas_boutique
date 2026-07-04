import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/firebaseConfig'

let cachedProducts = null

export function useProducts() {
  const [products, setProducts] = useState(cachedProducts ?? [])
  const [loading, setLoading]   = useState(!cachedProducts)
  const [error, setError]       = useState(null)

  useEffect(() => {
    if (cachedProducts) return
    let cancelled = false

    async function fetch() {
      try {
        const snap = await getDocs(collection(db, 'products'))
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        if (!cancelled) {
          cachedProducts = data
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

    fetch()
    return () => { cancelled = true }
  }, [])

  return { products, loading, error }
}