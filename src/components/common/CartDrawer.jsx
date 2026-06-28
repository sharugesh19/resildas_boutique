import React from 'react'
import { Link } from 'react-router-dom'
import { useCart }     from '../../context/CartContext'
import { formatPrice } from '../../utils/formatPrice'

function CartDrawer() {
  const { cart, cartTotal, cartCount, isOpen, closeCart, removeFromCart, setQuantity } = useCart()

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cart-drawer-overlay${isOpen ? ' open' : ''}`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside className={`cart-drawer${isOpen ? ' open' : ''}`} aria-label="Shopping cart">
        {/* Header */}
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">
            Cart {cartCount > 0 && <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-base)', fontFamily: 'var(--font-body)', fontWeight: 400 }}>({cartCount})</span>}
          </h2>
          <button className="cart-drawer__close" onClick={closeCart} aria-label="Close cart">✕</button>
        </div>

        {/* Items */}
        {cart.length === 0 ? (
          <div className="cart-drawer__empty">
            <span style={{ fontSize: '2.5rem' }}>🛍</span>
            <p>Your cart is empty</p>
            <button onClick={closeCart} style={{ color: 'var(--color-gold)', fontSize: 'var(--text-sm)', fontWeight: 500, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-drawer__items">
            {cart.map((item) => (
              <CartItem
                key={item.key}
                item={item}
                onRemove={() => removeFromCart(item.key)}
                onQtyChange={(qty) => setQuantity(item.key, qty)}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        {cart.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__total">
              <span>Total</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <Link to="/checkout" className="btn-checkout" onClick={closeCart}>
              Proceed to Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}

function CartItem({ item, onRemove, onQtyChange }) {
  const { product, size, quantity } = item
  return (
    <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
      <img
        src={product.images[0]}
        alt={product.name}
        style={{ width: 72, height: 96, objectFit: 'cover', flexShrink: 0, background: 'var(--color-grey-100)' }}
      />
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 500, lineHeight: 1.3, marginBottom: 'var(--space-1)' }}>
          {product.name}
        </p>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-3)' }}>
          Size: {size}
        </p>

        {/* Qty control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
          <button onClick={() => onQtyChange(quantity - 1)} style={{ width: 28, height: 28, border: '1px solid var(--color-border)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-lg)' }}>−</button>
          <span style={{ fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{quantity}</span>
          <button onClick={() => onQtyChange(quantity + 1)} style={{ width: 28, height: 28, border: '1px solid var(--color-border)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-lg)' }}>+</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600 }}>{formatPrice(product.price * quantity)}</span>
          <button onClick={onRemove} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-error)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartDrawer