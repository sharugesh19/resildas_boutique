import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { CATEGORY_LABELS } from '../data/productsData'
import { useProducts } from '../hooks/useProducts'
import { useCart }      from '../context/CartContext'
import { useWishlist }  from '../context/WishlistContext'
import { useAuth } from '../hooks/useAuth'
import { formatPrice, calcDiscount } from '../utils/formatPrice'
import { requireLogin } from '../utils/requireLogin'
import ProductCard from '../components/product/ProductCard'
import {
  ImagePlaceholderIcon, CheckIcon, XCircleIcon, RulerIcon,
  BagIcon, BoltIcon, HeartIcon, TruckIcon, ExchangeIcon,
  LockIcon, MapPinIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon
} from '../components/common/Icons'

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
  'fancy-saree': {
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
function normalizeSizes(sizesRaw) {
  if (!Array.isArray(sizesRaw)) return []
  return sizesRaw.map((s) =>
    typeof s === 'string' ? { size: s, stock: null } : s
  )
}

function ProductDetail() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { products, loading, error } = useProducts()
  const product = products.find((p) => p.id === id) ?? null

  const hasColors = product?.colors?.length > 0

  const [selectedColor, setSelectedColor] = useState(() =>
    hasColors ? product.colors[0] : null
  )
  const [activeImg, setActiveImg]         = useState(0)
  const [selectedSize, setSelectedSize]   = useState('')
  const [qty, setQty]                     = useState(1)
  const [activeTab, setActiveTab]         = useState('details')
  const [showSizeGuide, setShowSizeGuide] = useState(false)

  const { addToCart }                    = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { isLoggedIn }                   = useAuth()

  // Reset image index when color changes
  useEffect(() => {
    setActiveImg(0)
    setSelectedSize('')
  }, [selectedColor])

  useEffect(() => {
    setSelectedSize('')
  }, [product?.id])

  if (loading) {
    return (
      <main className="container" style={{ padding: '8rem 1rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-grey-500)' }}>Loading product...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-grey-500)', marginBottom: 16 }}>
          We couldn't load this product right now. Please check your connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn--primary"
          style={{ padding: '0.75rem 2rem', border: 'none', borderRadius: 8, cursor: 'pointer' }}
        >
          Retry
        </button>
      </main>
    )
  }

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

  // ── Derive active price / images / stock from selected color ──
  const activeColorData = product.colors?.find(c => c.name === selectedColor?.name) ?? null
  const activePrice         = activeColorData?.price         ?? product.price
  const activeOriginalPrice = activeColorData?.originalPrice ?? product.originalPrice
  const activeInStock       = activeColorData?.inStock       ?? product.inStock
  const activeImages        = (activeColorData?.images?.length ? activeColorData.images : product.images) ?? []
  const images              = activeImages.length ? activeImages : [null]

  const related = product
    ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
    : []
  const discount   = calcDiscount(activePrice, activeOriginalPrice)
  const wishlisted = isWishlisted(product.id)
  const catLabel   = CATEGORY_LABELS[product.category] ?? product.category
  const catDetail  = CATEGORY_DETAILS[product.category] ?? null
  const showSize   = catDetail?.showSize ?? true
  const rawSizes    = hasColors ? (selectedColor?.sizes ?? []) : (product.sizes ?? [])
  const sizeOptions = normalizeSizes(rawSizes)
  const selectedSizeData = sizeOptions.find((s) => s.size === selectedSize)
  const savings    = activeOriginalPrice > activePrice ? activeOriginalPrice - activePrice : null
  const maxQty = selectedSizeData?.stock != null
    ? selectedSizeData.stock
    : (typeof product.stock === 'number' && product.stock > 0 ? product.stock : 10)

  const handleAddToCart = () => {
    const size = showSize ? selectedSize : 'Free Size'
    if (showSize && !size) { alert('Please select a size'); return }
    addToCart(
      { ...product, price: activePrice, images: activeImages },
      size,
      Math.min(qty, maxQty),
      selectedColor?.name ?? null
    )
  }

  const handleBuyNow = () => {
    const size = showSize ? selectedSize : 'Free Size'
    if (showSize && !size) { alert('Please select a size'); return }
    addToCart(
      { ...product, price: activePrice, images: activeImages },
      size,
      Math.min(qty, maxQty),
      selectedColor?.name ?? null
    )
    navigate('/checkout')
  }

  const handleWishlist = async () => {
    if (!requireLogin(isLoggedIn, navigate)) return
    await toggleWishlist(product.id)
  }

  const productUrl   = `https://resildas.com/product/${product.id}`
  const productImage = images[0] ?? ''

  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description ?? `${product.name} - ${catLabel} at Resilda's Boutique`,
    "image": productImage,
    "brand": { "@type": "Brand", "name": "Resilda's Boutique" },
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "INR",
      "price": activePrice,
      "priceValidUntil": "2026-12-31",
      "availability": activeInStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "seller": { "@type": "Organization", "name": "Resilda's Boutique" }
    }
  }

  return (
    <main className="pd-page">
      <Helmet>
        <title>{product.name} — {catLabel} | Resilda's Boutique</title>
        <meta
          name="description"
          content={`Buy ${product.name} online at Resilda's Boutique. ${catLabel} starting at ${formatPrice(activePrice)}. Free delivery on every order.`}
        />
        <link rel="canonical" href={productUrl} />
        <meta property="og:title" content={`${product.name} | Resilda's Boutique`} />
        <meta property="og:description" content={`${catLabel} — ${formatPrice(activePrice)}. Free delivery on every order.`} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={productUrl} />
        {productImage && <meta property="og:image" content={productImage} />}
        <script type="application/ld+json">{JSON.stringify(productStructuredData)}</script>
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
                    : <span className="pd-thumb-placeholder"><ImagePlaceholderIcon size={20} /></span>
                  }
                </button>
              ))}
            </div>

            <div className="pd-main-img-wrap">
              <button
                className="pd-img-arrow pd-img-arrow--prev"
                onClick={() => setActiveImg((activeImg - 1 + images.length) % images.length)}
              >
                <ChevronLeftIcon size={20} />
              </button>

              <div className="pd-main-img">
                {images[activeImg]
                  ? <img src={images[activeImg]} alt={product.name} />
                  : (
                    <div className="pd-img-placeholder">
                      <ImagePlaceholderIcon size={64} />
                      <span style={{ fontSize: '0.9rem', color: '#aaa' }}>No Image Available</span>
                    </div>
                  )
                }
              </div>

              <button
                className="pd-img-arrow pd-img-arrow--next"
                onClick={() => setActiveImg((activeImg + 1) % images.length)}
              >
                <ChevronRightIcon size={20} />
              </button>

              <div className="pd-img-dots">
                {images.map((_, i) => (
                  <button
                    key={i}
                    className={`pd-dot${i === activeImg ? ' pd-dot--active' : ''}`}
                    onClick={() => setActiveImg(i)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Product Info */}
          <div className="pd-info">

            <p className="pd-info__category">{catLabel}</p>
            <h1 className="pd-info__name">{product.name}</h1>

            <div className="pd-info__stock">
              {activeInStock
                ? <span className="pd-in-stock" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><CheckIcon size={14} /> In Stock</span>
                : <span className="pd-out-stock" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><XCircleIcon size={14} /> Out of Stock</span>
              }
            </div>

            {/* Price */}
            <div className="pd-price-box">
              <span className="pd-price">{formatPrice(activePrice)}</span>
              {activeOriginalPrice > activePrice && (
                <>
                  <span className="pd-mrp">{formatPrice(activeOriginalPrice)}</span>
                  <span className="pd-discount">{discount}% off</span>
                </>
              )}
              {savings && (
                <span className="pd-savings">You save {formatPrice(savings)}!</span>
              )}
            </div>

            {/* ── Color Variant Selector ─────────────────── */}
            {hasColors && (
              <div className="pd-option-group">
                <div className="pd-option-label">
                  <span>Colour: <strong>{selectedColor?.name}</strong></span>
                </div>

                {/* Amazon-style image variant selector */}
                <div className="pd-color-variants">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      className={`pd-color-variant-btn
                        ${selectedColor?.name === color.name ? ' pd-color-variant-btn--active' : ''}
                        ${!color.inStock ? ' pd-color-variant-btn--oos' : ''}
                      `}
                      onClick={() => setSelectedColor(color)}
                      disabled={!color.inStock}
                      title={color.name}
                    >
                      <div className="pd-color-variant-img">
                        <img
                          src={color.images?.[0] ?? product.images?.[0]}
                          alt={color.name}
                        />
                        {!color.inStock && (
                          <div className="pd-color-variant-oos-overlay">OOS</div>
                        )}
                      </div>
                      <div className="pd-color-variant-info">
                        <span className="pd-color-variant-name">{color.name}</span>
                        <span className="pd-color-variant-price">
                          ₹{(color.price ?? product.price).toLocaleString('en-IN')}
                        </span>
                        {color.originalPrice > color.price && (
                          <span className="pd-color-variant-mrp">
                            ₹{color.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {showSize && (
              <div className="pd-option-group">
                <div className="pd-option-label">
                  <span>Select Size</span>
                  <button className="pd-size-guide-btn" onClick={() => setShowSizeGuide(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <RulerIcon size={14} /> Size Guide
                  </button>
                </div>
                <div className="pd-size-btns">
                  {sizeOptions.map(({ size, stock }) => {
                    const oos = stock === 0
                    return (
                      <button
                        key={size}
                        className={`pd-size-btn${selectedSize === size ? ' pd-size-btn--active' : ''}${oos ? ' pd-size-btn--oos' : ''}`}
                        onClick={() => !oos && setSelectedSize(size)}
                        disabled={oos}
                        title={oos ? 'Out of stock' : (stock != null ? `${stock} left` : '')}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="pd-option-group">
              <div className="pd-option-label"><span>Quantity</span></div>
              <div className="pd-qty">
                <button className="pd-qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span className="pd-qty-val">{qty}</span>
                <button
                  className="pd-qty-btn"
                  onClick={() => setQty(Math.min(maxQty, qty + 1))}
                  disabled={qty >= maxQty}
                >
                  +
                </button>
              </div>
              {selectedSizeData?.stock != null && selectedSizeData.stock > 0 && selectedSizeData.stock <= 5 && (
                <p style={{ fontSize: '0.75rem', color: '#cc0000', marginTop: '4px' }}>
                  Only {selectedSizeData.stock} left in stock!
                </p>
              )}
            </div>

            {/* CTA */}
            <div className="pd-cta">
              <button className="pd-btn-cart" onClick={handleAddToCart} disabled={!activeInStock} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <BagIcon size={16} /> Add to Cart
              </button>
              <button className="pd-btn-buy" onClick={handleBuyNow} disabled={!activeInStock} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <BoltIcon size={16} /> Buy Now
              </button>
            </div>

            {/* Wishlist */}
            <button
              className={`pd-wishlist-btn${wishlisted ? ' pd-wishlist-btn--active' : ''}`}
              onClick={handleWishlist}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <HeartIcon size={16} filled={wishlisted} /> {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
            </button>

            {/* Delivery info */}
            <div className="pd-delivery">
              <div className="pd-delivery-item">
                <span className="pd-delivery-icon"><TruckIcon size={22} /></span>
                <div>
                  <strong>Free Delivery</strong>
                  <p>On every order</p>
                </div>
              </div>
              <div className="pd-delivery-item">
                <span className="pd-delivery-icon"><ExchangeIcon size={22} /></span>
                <div>
                  <strong>Damage Protection</strong>
                  <p>Exchange only for damaged products</p>
                </div>
              </div>
              <div className="pd-delivery-item">
                <span className="pd-delivery-icon"><LockIcon size={22} /></span>
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

          {activeTab === 'details' && (
            <div className="pd-tab-content">
              {catDetail && (
                <>
                  <h3 className="pd-tab-heading">Top Highlights</h3>
                  <div className="pd-highlights-grid">
                    {catDetail.highlights.map(([key, val]) => (
                      <div key={key} className="pd-highlight-item">
                        <span className="pd-highlight-check"><CheckIcon size={14} /></span>
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

          {activeTab === 'shipping' && (
            <div className="pd-tab-content">
              <div className="pd-shipping-list">
                {[
                  { icon: <TruckIcon size={22} />, title: 'Free Shipping', body: 'Free delivery on all orders across India. Standard delivery in 5–7 business days.' },
                  { icon: <ExchangeIcon size={22} />, title: 'Exchange Policy', body: 'Size exchanges available within 7 days of delivery. Contact us on WhatsApp for quick exchange.' },
                  { icon: <MapPinIcon size={22} />, title: 'Track Your Order', body: "You'll receive a tracking link via SMS and email once your order is shipped." },
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
            <button className="pd-modal-close" onClick={() => setShowSizeGuide(false)}>
              <CloseIcon size={16} />
            </button>
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