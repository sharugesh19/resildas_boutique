import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getProductById, getRelatedProducts, CATEGORY_LABELS } from '../data/productsData'
import { useCart }      from '../context/CartContext'
import { useWishlist }  from '../context/WishlistContext'
import { useAuth }      from '../context/AuthContext'
import { formatPrice, calcDiscount } from '../utils/formatPrice'
import { requireLogin } from '../utils/requireLogin'
import ProductCard from '../components/product/ProductCard'

const CATEGORY_DETAILS = {
  'unstitched-salwar': {
    showSize: false,
    highlights: [
      ['Fabric', 'Premium Cotton Blend'],
      ['Work Type', 'Printed / Embroidered'],
      ['Length', 'Unstitched Material'],
      ['Occasion', 'Daily / Festive Wear'],
      ['Package', 'Top + Bottom + Dupatta'],
      ['Care', 'Gentle Wash'],
    ],
    specTitle: 'Fabric Details',
    specs: [
      ['Fabric (Top)', 'Premium Cotton Blend'],
      ['Fabric (Bottom)', 'Matching Bottom Fabric'],
      ['Dupatta Fabric', 'Soft Chiffon / Cotton Blend'],
      ['Work Type', 'Printed / Embroidered'],
      ['Length', 'Unstitched Material'],
      ['Occasion', 'Daily Wear, Festive Wear'],
      ['Wash Care', 'Gentle hand wash recommended'],
      ['Package Contents', 'Top Fabric + Bottom Fabric + Dupatta'],
    ],
  },
  'kurthi-set': {
    showSize: true,
    highlights: [
      ['Fabric', 'Silk Blend'],
      ['Neck Type', 'V-Neck'],
      ['Sleeve Type', '3/4 Sleeve'],
      ['Length', 'Knee Length'],
      ['Fit', 'Regular Fit'],
      ['Occasion', 'Daily / Festive Wear'],
    ],
    specTitle: 'Kurthi Set Details',
    specs: [
      ['Fabric', 'Silk Blend'],
      ['Neck Type', 'V-Neck'],
      ['Sleeve Type', '3/4 Sleeve'],
      ['Length', 'Knee Length'],
      ['Fit', 'Regular Fit'],
      ['Pattern', 'Printed / Embroidered'],
      ['Occasion', 'Daily Wear, Festive Wear'],
      ['Wash Care', 'Gentle hand wash recommended'],
    ],
  },
  'organza-saree': {
    showSize: false,
    highlights: [
      ['Saree Fabric', 'Organza'],
      ['Blouse', 'Included'],
      ['Saree Length', '5.5 meters'],
      ['Blouse Length', '0.8 meters'],
      ['Work Type', 'Embroidered / Printed'],
      ['Occasion', 'Party / Festive Wear'],
    ],
    specTitle: 'Saree Details',
    specs: [
      ['Saree Fabric', 'Organza'],
      ['Blouse Piece Included', 'Yes'],
      ['Saree Length', '5.5 meters'],
      ['Blouse Length', '0.8 meters'],
      ['Border Type', 'Designer Border'],
      ['Work Type', 'Embroidered / Printed'],
      ['Occasion', 'Party Wear, Festive Wear'],
      ['Care Instructions', 'Dry clean recommended'],
    ],
  },
  'tussar-saree': {
    showSize: false,
    highlights: [
      ['Saree Fabric', 'Tussar Silk'],
      ['Weave Type', 'Traditional Weave'],
      ['Blouse', 'Included'],
      ['Length', '5.5 meters'],
      ['Border', 'Zari / Printed Border'],
      ['Care', 'Dry Clean'],
    ],
    specTitle: 'Saree Details',
    specs: [
      ['Saree Fabric', 'Tussar Silk'],
      ['Weave Type', 'Traditional Weave'],
      ['Blouse Piece', 'Included'],
      ['Length', '5.5 meters'],
      ['Border', 'Zari / Printed Border'],
      ['Occasion', 'Festive Wear, Traditional Wear'],
      ['Care', 'Dry clean recommended'],
    ],
  },
  'soft-silk-saree': {
    showSize: false,
    highlights: [
      ['Silk Type', 'Soft Silk'],
      ['Saree Length', '5.5 meters'],
      ['Blouse', 'Included'],
      ['Zari Work', 'Yes'],
      ['Occasion', 'Wedding / Festive'],
      ['Care', 'Dry Clean'],
    ],
    specTitle: 'Saree Details',
    specs: [
      ['Silk Type', 'Soft Silk'],
      ['Saree Length', '5.5 meters'],
      ['Blouse Piece', 'Included'],
      ['Zari Work', 'Traditional Zari Work'],
      ['Occasion', 'Wedding Wear, Festive Wear'],
      ['Care', 'Dry clean recommended'],
    ],
  },
  'cotton-saree': {
    showSize: false,
    highlights: [
      ['Fabric', 'Cotton'],
      ['Saree Length', '5.5 meters'],
      ['Blouse', 'Included / As per product'],
      ['Weave Pattern', 'Handloom / Printed'],
      ['Occasion', 'Daily Wear'],
      ['Care', 'Gentle Wash'],
    ],
    specTitle: 'Saree Details',
    specs: [
      ['Fabric', 'Cotton'],
      ['Saree Length', '5.5 meters'],
      ['Blouse Piece', 'Included / As per product'],
      ['Weave Pattern', 'Handloom / Printed'],
      ['Occasion', 'Daily Wear, Office Wear'],
      ['Care', 'Gentle hand wash recommended'],
    ],
  },
  'lightweight-saree': {
    showSize: false,
    highlights: [
      ['Fabric', 'Chiffon / Georgette'],
      ['Embellishment', 'Sequins / Stone Work'],
      ['Blouse', 'Included'],
      ['Saree Length', '5.5 meters'],
      ['Occasion', 'Party Wear'],
      ['Care', 'Dry Clean'],
    ],
    specTitle: 'Party Wear Saree Details',
    specs: [
      ['Fabric', 'Chiffon / Georgette'],
      ['Embellishment', 'Sequins / Stone Work'],
      ['Blouse Piece', 'Included'],
      ['Saree Length', '5.5 meters'],
      ['Occasion', 'Party Wear, Reception Wear'],
      ['Care', 'Dry clean recommended'],
    ],
  },
  'coord-sets': {
    showSize: true,
    highlights: [
      ['Fabric', 'Premium Blend'],
      ['Top Length', 'Regular Length'],
      ['Bottom Length', 'Ankle Length'],
      ['Fit Type', 'Relaxed Fit'],
      ['Sleeve Type', 'Short / 3/4 Sleeve'],
      ['Occasion', 'Casual / Party Wear'],
    ],
    specTitle: 'Co-ord Set Details',
    specs: [
      ['Fabric', 'Premium Blend'],
      ['Top Length', 'Regular Length'],
      ['Bottom Length', 'Ankle Length'],
      ['Fit Type', 'Relaxed Fit'],
      ['Sleeve Type', 'Short / 3/4 Sleeve'],
      ['Occasion', 'Casual Wear, Party Wear'],
      ['Care', 'Gentle hand wash recommended'],
    ],
  },
}

const SIZE_GUIDE = {
  headers: ['Size', 'Chest (in)', 'Waist (in)', 'Hip (in)', 'Length (in)'],
  rows: [
    ['XS',  '34', '28', '36', '44'],
    ['S',   '36', '30', '38', '45'],
    ['M',   '38', '32', '40', '46'],
    ['L',   '40', '34', '42', '47'],
    ['XL',  '42', '36', '44', '48'],
    ['2XL', '44', '38', '46', '49'],
  ],
}


function ProductDetail() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const product      = getProductById(id)

  const [activeImg, setActiveImg]         = useState(0)
  const [selectedSize, setSelectedSize]   = useState('')
  const [qty, setQty]                     = useState(1)
  const [activeTab, setActiveTab]         = useState('details')
  const [showSizeGuide, setShowSizeGuide] = useState(false)

  const { addToCart }                    = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { isLoggedIn }                   = useAuth()

  if (!product) {
    return (
      <main className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h1>Product not found</h1>
        <p>The product you're looking for doesn't exist or may have been removed.</p>
        <Link to="/products" className="btn btn--primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
          Back to Products
        </Link>
      </main>
    )
  }

  const related    = getRelatedProducts(product, 4)
  const discount   = calcDiscount(product.price, product.originalPrice)
  const wishlisted = isWishlisted(product.id)
  const catLabel   = CATEGORY_LABELS[product.category] ?? product.category
  const catDetail  = CATEGORY_DETAILS[product.category] ?? null
  const showSize   = catDetail?.showSize ?? true
  const sizeBtns   = ['XS', 'S', 'M', 'L', 'XL', '2XL']

  const handleAddToCart = () => {
    const size = showSize ? selectedSize : 'Free Size'
    if (showSize && !size) { alert('Please select a size'); return }
    addToCart(product, size, qty)
  }

  const handleBuyNow = () => {
    const size = showSize ? selectedSize : 'Free Size'
    if (showSize && !size) { alert('Please select a size'); return }
    addToCart(product, size, qty)
    navigate('/checkout')
  }

  const handleWishlist = async () => {
    if (!requireLogin(isLoggedIn, navigate)) return
    await toggleWishlist(product.id)
  }

  const images = product.images?.length ? product.images : [null]
  const savings = product.originalPrice > product.price
    ? product.originalPrice - product.price
    : null
const productUrl = `https://resildas.com/product/${product.id}`
  const productImage = images[0] ?? ''
  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description ?? `${product.name} - ${catLabel} at Resilda's Boutique`,
    "image": productImage,
    "brand": {
      "@type": "Brand",
      "name": "Resilda's Boutique"
    },
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "INR",
      "price": product.price,
      "priceValidUntil": "2026-12-31",
      "availability": product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Resilda's Boutique"
      }
    }
  }
  return (
    <main className="pd-page">
      <Helmet>
        <title>{product.name} — {catLabel} | Resilda's Boutique</title>
        <meta
          name="description"
          content={`Buy ${product.name} online at Resilda's Boutique. ${catLabel} starting at ${formatPrice(product.price)}. Free delivery on every order.`}
        />
        <link rel="canonical" href={productUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={`${product.name} | Resilda's Boutique`} />
        <meta property="og:description" content={`${catLabel} — ${formatPrice(product.price)}. Free delivery on every order.`} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={productUrl} />
        {productImage && <meta property="og:image" content={productImage} />}

        {/* Product structured data */}
        <script type="application/ld+json">
          {JSON.stringify(productStructuredData)}
        </script>
      </Helmet>
      {/* ── Breadcrumb ───────────────────────────────────── */}
      <div className="pd-breadcrumb-bar">
        <div className="pd-container">
          <Link to="/">Home</Link>
          <span className="pd-bc-sep">›</span>
          <Link to="/products">Shop</Link>
          <span className="pd-bc-sep">›</span>
          <Link to={`/products/${product.category}`}>{catLabel}</Link>
          <span className="pd-bc-sep">›</span>
          <span>{product.name}</span>
        </div>
      </div>

      <div className="pd-container">

        {/* ── Main Grid ─────────────────────────────────── */}
        <div className="pd-main-grid">

          {/* LEFT — Gallery */}
          <div className="pd-gallery">
            <div className="pd-thumbs">
              {images.map((src, i) => (
                <button
                  key={i}
                  className={`pd-thumb${i === activeImg ? ' pd-thumb--active' : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  {src
                    ? <img src={src} alt={`${product.name} view ${i + 1}`} />
                    : <span className="pd-thumb-placeholder">🖼</span>
                  }
                </button>
              ))}
            </div>

            <div className="pd-main-img-wrap">
              <button className="pd-img-arrow pd-img-arrow--prev" onClick={() => setActiveImg((activeImg - 1 + images.length) % images.length)}>‹</button>

              <div className="pd-main-img">
                {images[activeImg]
                  ? <img src={images[activeImg]} alt={product.name} />
                  : (
                    <div className="pd-img-placeholder">
                      <span style={{ fontSize: '4rem' }}>🖼</span>
                      <span style={{ fontSize: '0.9rem', color: '#aaa' }}>No Image Available</span>
                    </div>
                  )
                }
              </div>

              <button className="pd-img-arrow pd-img-arrow--next" onClick={() => setActiveImg((activeImg + 1) % images.length)}>›</button>

              <div className="pd-img-dots">
                {images.map((_, i) => (
                  <button key={i} className={`pd-dot${i === activeImg ? ' pd-dot--active' : ''}`} onClick={() => setActiveImg(i)} />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Product Info */}
          <div className="pd-info">

            <p className="pd-info__category">{catLabel}</p>
            <h1 className="pd-info__name">{product.name}</h1>

            <div className="pd-info__stock">
              <span className="pd-in-stock">✔ In Stock</span>
            </div>

            {/* Price */}
            <div className="pd-price-box">
              <span className="pd-price">{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="pd-mrp">{formatPrice(product.originalPrice)}</span>
                  <span className="pd-discount">{discount}% off</span>
                </>
              )}
              {savings && (
                <span className="pd-savings">You save {formatPrice(savings)}!</span>
              )}
            </div>

            {/* Size Selector */}
            {showSize && (
              <div className="pd-option-group">
                <div className="pd-option-label">
                  <span>Select Size</span>
                  <button className="pd-size-guide-btn" onClick={() => setShowSizeGuide(true)}>📏 Size Guide</button>
                </div>
                <div className="pd-size-btns">
                  {sizeBtns.map((s) => (
                    <button
                      key={s}
                      className={`pd-size-btn${selectedSize === s ? ' pd-size-btn--active' : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="pd-option-group">
              <div className="pd-option-label"><span>Quantity</span></div>
              <div className="pd-qty">
                <button className="pd-qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span className="pd-qty-val">{qty}</span>
                <button className="pd-qty-btn" onClick={() => setQty(Math.min(10, qty + 1))}>+</button>
              </div>
            </div>

            {/* CTA */}
            <div className="pd-cta">
              <button className="pd-btn-cart" onClick={handleAddToCart} disabled={!product.inStock}>
                🛍 Add to Cart
              </button>
              <button className="pd-btn-buy" onClick={handleBuyNow} disabled={!product.inStock}>
                ⚡ Buy Now
              </button>
            </div>

            {/* Wishlist — WhatsApp button removed */}
            <button
              className={`pd-wishlist-btn${wishlisted ? ' pd-wishlist-btn--active' : ''}`}
              onClick={handleWishlist}
            >
              {wishlisted ? '♥' : '♡'} {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
            </button>

            {/* Delivery info — hidden on mobile via CSS */}
            <div className="pd-delivery">
              <div className="pd-delivery-item">
                <span className="pd-delivery-icon">🚚</span>
                <div>
                  <strong>Free Delivery</strong>
                  <p>On every order</p>
                </div>
              </div>
              <div className="pd-delivery-item">
                <span className="pd-delivery-icon">↩</span>
                <div>
                  <strong>Damage Protection</strong>
                  <p>Exchange only for damaged products</p>
                </div>
              </div>
              <div className="pd-delivery-item">
                <span className="pd-delivery-icon">🔒</span>
                <div>
                  <strong>Secure Payment</strong>
                  <p>100% safe &amp; encrypted</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Tabs ──────────────────────────────────────── */}
        <div className="pd-tabs-section">
          <div className="pd-tabs">
            <button className={`pd-tab${activeTab === 'details' ? ' pd-tab--active' : ''}`} onClick={() => setActiveTab('details')}>
              Product Details
            </button>
            <button className={`pd-tab${activeTab === 'shipping' ? ' pd-tab--active' : ''}`} onClick={() => setActiveTab('shipping')}>
              Shipping &amp; Returns
            </button>
          </div>

          {/* Details tab */}
          {activeTab === 'details' && (
            <div className="pd-tab-content">
              {catDetail && (
                <>
                  <h3 className="pd-tab-heading">Top Highlights</h3>
                  <div className="pd-highlights-grid">
                    {catDetail.highlights.map(([key, val]) => (
                      <div key={key} className="pd-highlight-item">
                        <span className="pd-highlight-check">✓</span>
                        <div>
                          <strong>{key}</strong>
                          <span>{val}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h3 className="pd-tab-heading">{catDetail.specTitle}</h3>
                  <table className="pd-spec-table">
                    <tbody>
                      {catDetail.specs.map(([key, val]) => (
                        <tr key={key}>
                          <td className="pd-spec-key">{key}</td>
                          <td className="pd-spec-val">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
              {!catDetail && (
                <p style={{ color: 'var(--color-grey-700)', lineHeight: 1.8 }}>{product.description}</p>
              )}
            </div>
          )}

          {/* Shipping tab — Easy Returns removed */}
          {activeTab === 'shipping' && (
            <div className="pd-tab-content">
              <div className="pd-shipping-list">
                {[
                  { icon: '🚚', title: 'Free Shipping', body: 'Free delivery on all orders across India. Standard delivery in 5–7 business days.' },
                  { icon: '🔄', title: 'Exchange Policy', body: 'Size exchanges available within 7 days of delivery. Contact us on WhatsApp for quick exchange.' },
                  { icon: '📍', title: 'Track Your Order', body: "You'll receive a tracking link via SMS and email once your order is shipped." },
                ].map((item) => (
                  <div key={item.title} className="pd-shipping-item">
                    <span className="pd-shipping-icon">{item.icon}</span>
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Related Products ───────────────────────────── */}
        {related.length > 0 && (
          <section className="pd-related section">
            <h2 className="section-title">You May Also Like</h2>
            <div className="product-grid product-grid--4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* ── Size Guide Modal ───────────────────────────── */}
      {showSizeGuide && (
        <>
          <div className="pd-modal-overlay" onClick={() => setShowSizeGuide(false)} />
          <div className="pd-size-guide-modal">
            <button className="pd-modal-close" onClick={() => setShowSizeGuide(false)}>✕</button>
            <h3>Size Guide</h3>
            <table className="pd-spec-table">
              <thead>
                <tr>{SIZE_GUIDE.headers.map((h) => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {SIZE_GUIDE.rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) => <td key={i}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.75rem', fontStyle: 'italic' }}>
              * All measurements are in inches. Model (5'8") wears size S.
            </p>
          </div>
        </>
      )}
    </main>
  )
}

export default ProductDetail