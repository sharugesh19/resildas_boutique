import { useContext } from 'react'
import { WishlistContext } from '../context/WishlistContextObject'

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>')
  return ctx
}