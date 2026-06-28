import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  doc,
  onSnapshot,
  setDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'
import { db } from '../firebase/firebaseConfig'
import { useAuth } from './AuthContext'

const WishlistContext = createContext(null)

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>')
  return ctx
}

export function WishlistProvider({ children }) {
  const { user, isLoggedIn } = useAuth()
  const [wishlist, setWishlist] = useState([]) // array of product IDs

  // Real-time sync from Firestore when logged in
  useEffect(() => {
    if (!isLoggedIn || !user) {
      setWishlist([])
      return
    }

    const ref = doc(db, 'wishlists', user.uid)
    const unsub = onSnapshot(ref, (snap) => {
      setWishlist(snap.exists() ? snap.data().productIds ?? [] : [])
    })

    return unsub
  }, [user, isLoggedIn])

  // ── Helpers ─────────────────────────────────────────────────────────────

  const wishlistRef = () => doc(db, 'wishlists', user.uid)

  /**
   * Returns true if action completed, false if user is not logged in.
   * Caller is responsible for redirecting to login when false is returned.
   */
  const addToWishlist = async (productId) => {
    if (!isLoggedIn) return false
    await setDoc(wishlistRef(), { productIds: arrayUnion(productId) }, { merge: true })
    return true
  }

  const removeFromWishlist = async (productId) => {
    if (!isLoggedIn) return false
    await setDoc(wishlistRef(), { productIds: arrayRemove(productId) }, { merge: true })
    return true
  }

  const toggleWishlist = async (productId) => {
    if (!isLoggedIn) return false
    if (wishlist.includes(productId)) {
      return removeFromWishlist(productId)
    }
    return addToWishlist(productId)
  }

  const isWishlisted = (productId) => wishlist.includes(productId)

  const value = {
    wishlist,
    wishlistCount: wishlist.length,
    isWishlisted,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
  }

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  )
}