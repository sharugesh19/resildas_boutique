import React, { useEffect, useReducer } from 'react'
import { CartContext } from './CartContextObject'

const CART_STORAGE_KEY = 'resildas_cart'

// ── Helpers ──────────────────────────────────────────────────────────────────

const makeKey = (productId, size, color) =>
  `${productId}__${size}${color ? `__${color}` : ''}`

function resolveUnitPrice(product, color) {
  if (color && Array.isArray(product.colors)) {
    const colorData = product.colors.find((c) => c.name === color)
    if (colorData && Number(colorData.price) > 0) {
      return Number(colorData.price)
    }
  }
  return Number(product.price) || 0
}

// ── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state, action) {
  switch (action.type) {
    case 'LOAD': {
      return action.payload
    }
    case 'ADD': {
      const { product, size, quantity = 1, color = null } = action.payload
      const key = makeKey(product.id, size, color)
      const price = resolveUnitPrice(product, color)
      const existing = state.find((i) => i.key === key)
      if (existing) {
        return state.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [...state, { key, product, size, quantity, color, price }]
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
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [isOpen, setIsOpen] = React.useState(false)

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, size, quantity = 1, color = null) => {
    dispatch({ type: 'ADD', payload: { product, size, quantity, color } })
    setIsOpen(true)
  }

  const removeFromCart = (key) => dispatch({ type: 'REMOVE', payload: { key } })
  const setQuantity = (key, quantity) => dispatch({ type: 'SET_QTY', payload: { key, quantity } })
  const clearCart = () => dispatch({ type: 'CLEAR' })
  const openCart  = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0)
  const cartTotal = cart.reduce((sum, i) => sum + (i.price ?? i.product.price) * i.quantity, 0)

  const value = {
    cart, cartCount, cartTotal, isOpen,
    addToCart, removeFromCart, setQuantity, clearCart, openCart, closeCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}