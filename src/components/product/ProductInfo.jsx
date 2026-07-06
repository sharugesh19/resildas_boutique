import { useState } from 'react'
import { useNavigate }  from 'react-router-dom'
import { useCart }      from '../../context/CartContext'
import { useWishlist }  from '../../context/WishlistContext'
import { useAuth }      from '../../context/AuthContext'
import { formatPrice, calcDiscount } from '../../utils/formatPrice'
import { requireLogin } from '../../utils/requireLogin'
import { getCategorySpec } from '../../data/categorySpecs'
import SizeSelector from './SizeSelector'

function ProductInfo({ product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] ?? '')
  const [qty, setQty]                   = useState(1)
  const [sizeError, setSizeError]       = useState(false)

  const { addToCart }                   = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { isLoggedIn }                  = useAuth()
  const navigate                        = useNavigate()

  const discount   = calcDiscount(product.price, product.originalPrice)
  const wishlisted = isWishlisted(product.id)
  const spec       = getCategorySpec(product.category)

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); return }
    setSizeError(false)
    addToCart(product, selectedSize, qty)
  }

  const handleWishlist = async () => {
    if (!requireLogin(isLoggedIn, navigate)) return
    await toggleWishlist(product.id)
  }

  return (
    <div className="product-info">
      <h1 className="product-info__name">{product.name}</h1>

      {/* Pricing */}
      <div className="product-info__pricing">
        <span className="product-info__price">{formatPrice(product.price)}</span>
        {product.originalPrice > product.price && (
          <>
            <span className="product-info__original">{formatPrice(product.originalPrice)}</span>
            <span className="product-info__discount">{discount}% off</span>
          </>
        )}
      </div>

      <p className="product-info__desc">{product.description}</p>

      {/* Size */}
      <SizeSelector
        sizes={product.sizes}
        selected={selectedSize}
        onChange={(s) => { setSelectedSize(s); setSizeError(false) }}
      />
      {sizeError && <p className="product-info__size-error">Please select a size</p>}

      {/* Qty + CTA */}
      <div className="product-info__actions">
        <div className="qty-control">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
          <span className="qty-control__val">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">+</button>
        </div>

        <button
          className="btn btn--primary product-info__add"
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>

        <button
          className={`product-info__wishlist${wishlisted ? ' product-info__wishlist--active' : ''}`}
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          {wishlisted ? '♥' : '♡'}
        </button>
      </div>

      {/* Spec table */}
      {spec && (
        <div className="product-info__specs">
          <h3 className="product-info__specs-title">Product Details</h3>
          <table className="spec-table">
            <tbody>
              {spec.specFields.map(({ key, label, format }) => {
                const val = product[key]
                if (val === undefined || val === null) return null
                return (
                  <tr key={key}>
                    <th>{label}</th>
                    <td>{format ? format(val) : val}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {spec.sizeNote && (
            <p className="product-info__size-note">{spec.sizeNote}</p>
          )}
          {spec.sizeChart && (
            <details className="product-info__size-chart">
              <summary>Size Chart</summary>
              <table className="spec-table">
                <thead>
                  <tr>{spec.sizeChart.headers.map((h) => <th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {spec.sizeChart.rows.map((row, i) => (
                    <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </details>
          )}
        </div>
      )}
    </div>
  )
}

export default ProductInfo