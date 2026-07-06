import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart }     from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useAuth } from '../../hooks/useAuth'
import { formatPrice, calcDiscount } from '../../utils/formatPrice'
import { requireLogin } from '../../utils/requireLogin'
import { CATEGORY_LABELS } from '../../data/productsData'

function ProductCard({ product }) {
  const { addToCart }                    = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { isLoggedIn }                   = useAuth()
  const navigate                         = useNavigate()
  const [imgError, setImgError]          = useState(false)
  const [pressed, setPressed]            = useState(false)

  const discount      = calcDiscount(product.price, product.originalPrice)
  const wishlisted    = isWishlisted(product.id)
  const defaultSize   = product.sizes?.[0] ?? 'Free Size'
  const imgSrc        = product.images?.[0]
  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category

  const handleWishlist = async (e) => {
    e.preventDefault()
    if (!requireLogin(isLoggedIn, navigate)) return
    await toggleWishlist(product.id)
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product, defaultSize, 1)
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
    </motion.article>
  )
}

export default ProductCard