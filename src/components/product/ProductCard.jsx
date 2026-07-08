import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart }     from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useAuth } from '../../hooks/useAuth'
import { formatPrice, calcDiscount } from '../../utils/formatPrice'
import { requireLogin } from '../../utils/requireLogin'
import { CATEGORY_LABELS } from '../../data/productsData'
import { normalizeSizes } from '../../utils/normalizeSizes'

// Resolves which color to use (first one with any in-stock size, else the
// first color regardless) and returns that color's size options.
// For plain (no-color) products, just resolves the top-level sizes.
function getAddToCartOptions(product) {
  if (Array.isArray(product.colors) && product.colors.length > 0) {
    for (const c of product.colors) {
      const opts = normalizeSizes(c.sizes || [])
      if (opts.some((o) => o.stock > 0)) {
        return { color: c.name, sizeOptions: opts }
      }
    }
    const fallback = product.colors[0]
    return { color: fallback.name, sizeOptions: normalizeSizes(fallback.sizes || []) }
  }
  return { color: null, sizeOptions: normalizeSizes(product.sizes || []) }
}

function ProductCard({ product }) {
  const { addToCart }                    = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { isLoggedIn }                   = useAuth()
  const navigate                         = useNavigate()
  const [imgError, setImgError]          = useState(false)
  const [pressed, setPressed]            = useState(false)
  const [showSizePicker, setShowSizePicker]         = useState(false)
  const [pendingColor, setPendingColor]             = useState(null)
  const [pendingSizeOptions, setPendingSizeOptions] = useState([])

  const discount      = calcDiscount(product.price, product.originalPrice)
  const wishlisted    = isWishlisted(product.id)

  const imgSrc        = product.images?.[0]
  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category

  const handleWishlist = async (e) => {
    e.preventDefault()
    if (!requireLogin(isLoggedIn, navigate)) return
    await toggleWishlist(product.id)
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    const { color, sizeOptions } = getAddToCartOptions(product)

    // Only one size available (or none tracked) — just add it directly,
    // no need to make the customer pick from a list of one.
    if (sizeOptions.length <= 1) {
      const size = sizeOptions[0]?.size ?? 'Free Size'
      addToCart(product, size, 1, color)
      return
    }

    // Multiple sizes — ask which one via the inline popup.
    setPendingColor(color)
    setPendingSizeOptions(sizeOptions)
    setShowSizePicker(true)
  }

  const handlePickSize = (e, size) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, size, 1, pendingColor)
    setShowSizePicker(false)
  }

  const closeSizePicker = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowSizePicker(false)
  }

  const showPlaceholder = !imgSrc || imgError

  return (
    <motion.article
      className="product-card"
      whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
      whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
    >
      <Link to={`/product/${product.id}`} className="product-card__link">

        {/* Image */}
        <div className="product-card__img-wrap">
          {showPlaceholder ? (
            <div className="product-card__placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span>Add Image</span>
            </div>
          ) : (
            <img
              src={imgSrc}
              alt={product.name}
              className="product-card__img"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          )}

          {/* Badges */}
          <div className="product-card__badges">
            {product.isFeatured ? (
              <span className="product-card__badge product-card__badge--bestseller">Best Seller</span>
            ) : product.isNewArrival ? (
              <span className="product-card__badge product-card__badge--new">New</span>
            ) : discount > 0 ? (
              <span className="product-card__badge product-card__badge--sale">Sale</span>
            ) : null}
          </div>

          {/* Actions — wishlist + quick view ONLY (no Add to Cart here) */}
          <div className="product-card__actions">
            <motion.button
              className={`product-card__wishlist${wishlisted ? ' product-card__wishlist--active' : ''}`}
              onClick={handleWishlist}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              whileTap={{ scale: 1.3, transition: { duration: 0.15 } }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </motion.button>
            <button
              className="product-card__eye"
              aria-label="Quick view"
              onClick={(e) => { e.preventDefault(); navigate(`/product/${product.id}`) }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="product-card__info">
          <p className="product-card__category">{categoryLabel}</p>
          <h3 className="product-card__name">{product.name}</h3>
          <div className="product-card__pricing">
            <span className="product-card__price">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="product-card__original">{formatPrice(product.originalPrice)}</span>
                <span className="product-card__discount">{discount}% off</span>
              </>
            )}
          </div>
        </div>
      </Link>

      {/* The ONE real Add to Cart button — outside the Link, at the bottom */}
      <div style={{ position: 'relative' }}>
        <motion.button
          className={`product-card__add${pressed ? ' product-card__add--pressed' : ''}`}
          onClick={handleAddToCart}
          disabled={!product.inStock}
          whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            setPressed(true)
          }}
          onPointerUp={() => setPressed(false)}
          onPointerCancel={() => setPressed(false)}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </motion.button>

        {showSizePicker && (
          <>
            {/* Invisible overlay — click anywhere outside to dismiss without adding */}
            <div
              onClick={closeSizePicker}
              style={{ position: 'fixed', inset: 0, zIndex: 40 }}
            />
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 8px)',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#fff',
                border: '1px solid #e5e5e5',
                borderRadius: 8,
                padding: '10px 12px',
                boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                zIndex: 50,
                minWidth: 180,
              }}
            >
              <p style={{ fontSize: 12, fontWeight: 600, margin: '0 0 8px', color: '#555' }}>
                Select Size
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {pendingSizeOptions.map((opt) => (
                  <button
                    key={opt.size}
                    type="button"
                    disabled={opt.stock <= 0}
                    onClick={(e) => handlePickSize(e, opt.size)}
                    style={{
                      padding: '6px 10px',
                      fontSize: 12,
                      border: '1px solid #ccc',
                      borderRadius: 6,
                      background: opt.stock <= 0 ? '#f2f2f2' : '#fff',
                      color: opt.stock <= 0 ? '#aaa' : '#111',
                      cursor: opt.stock <= 0 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {opt.size}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.article>
  )
}

export default ProductCard