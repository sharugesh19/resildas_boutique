import React, { createContext, useContext, useEffect, useReducer } from 'react'

const CART_STORAGE_KEY = 'resildas_cart'

const CartContext = createContext(null)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Unique key per product+size combo */
const makeKey = (productId, size) => `${productId}__${size}`

function calcDiscount(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return 0
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

// ── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state, action) {
  switch (action.type) {
    case 'LOAD': {
      return action.payload
    }

    case 'ADD': {
      const { product, size, quantity = 1 } = action.payload
      const key      = makeKey(product.id, size)
      const existing = state.find((i) => i.key === key)

      if (existing) {
        return state.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [...state, { key, product, size, quantity }]
    }

    case 'REMOVE': {
      return state.filter((i) => i.key !== action.payload.key)
    }

    case 'SET_QTY': {
      const { key, quantity } = action.payload
      if (quantity < 1) return state.filter((i) => i.key !== key)
      return state.map((i) => (i.key === key ? { ...i, quantity } : i))
    }

    case 'CLEAR': {
      return []
    }

    default:
      return state
  }
}

// ── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, [])
  const [isOpen, setIsOpen] = React.useState(false)

  // Hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY)
      if (raw) dispatch({ type: 'LOAD', payload: JSON.parse(raw) })
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY)
    }
  }, [])

  // Persist on every cart change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  // ── Public API ────────────────────────────────────────────────────────────

  const addToCart = (product, size, quantity = 1) => {
    dispatch({ type: 'ADD', payload: { product, size, quantity } })
    setIsOpen(true) // open drawer on add
  }

  const removeFromCart = (key) => dispatch({ type: 'REMOVE', payload: { key } })

  const setQuantity = (key, quantity) =>
    dispatch({ type: 'SET_QTY', payload: { key, quantity } })

  const clearCart = () => dispatch({ type: 'CLEAR' })

  const openCart  = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  // ── Derived state ─────────────────────────────────────────────────────────

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0)
  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  const value = {
    cart,
    cartCount,
    cartTotal,
    isOpen,
    addToCart,
    removeFromCart,
    setQuantity,
    clearCart,
    openCart,
    closeCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}