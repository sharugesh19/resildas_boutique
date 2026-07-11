import { Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { useProducts } from '../../hooks/useProducts'
import { formatPrice } from '../../utils/formatPrice'
import { ImagePlaceholderIcon } from './Icons'

function CartDrawer() {
  const { cart, cartTotal, cartCount, isOpen, closeCart, removeFromCart, setQuantity } = useCart()
  const { products: liveProducts } = useProducts()

  return (
    <>
      <div
        className={`cart-drawer-overlay${isOpen ? ' open' : ''}`}
        onClick={closeCart}
      />

      <aside className={`cart-drawer${isOpen ? ' open' : ''}`} aria-label="Shopping cart">
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">
            Cart {cartCount > 0 && <span className="cart-drawer__count">({cartCount})</span>}
          </h2>
          <button className="cart-drawer__close" onClick={closeCart} aria-label="Close cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-drawer__empty">
            <div className="cart-drawer__empty-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <p>Your cart is empty</p>
            <button className="cart-drawer__continue" onClick={closeCart}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-drawer__items">
            {cart.map((item) => (
              <CartItem
                key={item.key}
                item={item}
                liveProducts={liveProducts}
                onRemove={() => removeFromCart(item.key)}
                onQtyChange={(qty) => setQuantity(item.key, qty)}
              />
            ))}
          </div>
        )}

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

// Reads stock from the LIVE product data (fetched fresh, refreshed
// automatically every couple minutes) instead of the snapshot saved on the
// cart item when it was first added — so admin stock edits are respected
// without needing to remove and re-add the item.
import { getMaxQty } from '../../utils/stockHelpers'

function getCartItemMaxQty(item, liveProducts) {
  const liveProduct = liveProducts.find((p) => p.id === item.product.id) || item.product
  return getMaxQty(liveProduct, item.size, item.color)
}
function CartItem({ item, liveProducts, onRemove, onQtyChange }) {
  const { product, size, quantity, color } = item
  const unitPrice = item.price ?? product.price // fallback for carts saved before the price fix
  const maxQty = getCartItemMaxQty(item, liveProducts)

  return (
    <div className="cart-drawer__item">
      {product.images?.[0] ? (
  <img
    src={product.images[0]}
    alt={product.name}
    className="cart-drawer__item-img"
  />
) : (
  <div className="cart-drawer__item-img cart-drawer__item-img--placeholder">
    <span style={{ display: 'inline-flex', alignItems: 'center' }}><ImagePlaceholderIcon size={20} /></span>
  </div>
)}
      <div className="cart-drawer__item-body">
        <p className="cart-drawer__item-name">{product.name}</p>
        <p className="cart-drawer__item-meta">Size: {size}</p>
        {color && <p className="cart-drawer__item-meta">Colour: {color}</p>}

        <div className="cart-drawer__qty">
          <button className="cart-drawer__qty-btn" onClick={() => onQtyChange(quantity - 1)}>−</button>
          <span className="cart-drawer__qty-val">{quantity}</span>
          <button
            className="cart-drawer__qty-btn"
            onClick={() => onQtyChange(Math.min(maxQty, quantity + 1))}
            disabled={quantity >= maxQty}
          >
            +
          </button>
        </div>

        {quantity >= maxQty && (typeof product.stock === 'number' || color || product.sizes?.length > 0) && (
          <p style={{ fontSize: '0.7rem', color: '#cc0000', marginTop: '-4px', marginBottom: '8px' }}>
            Max available reached
          </p>
        )}

        <div className="cart-drawer__item-footer">
          <span className="cart-drawer__item-price">{formatPrice(unitPrice * quantity)}</span>
          <button className="cart-drawer__remove" onClick={onRemove}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartDrawer