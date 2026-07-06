import { useMemo, useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { CATEGORY_LABELS } from '../data/productsData'
import { useProducts } from '../hooks/useProducts'
import ProductGrid    from '../components/product/ProductGrid'
import ProductFilters from '../components/product/ProductFilters'
import FadeInUp       from '../components/common/FadeInUp'

const CATEGORY_TABS = [
  { key: 'all',               label: 'All' },
  { key: 'new-arrival',       label: 'New Arrivals' },
  { key: 'unstitched-salwar', label: 'Salwar Set' },
  { key: 'kurthi-set',        label: 'Kurthi Set' },
  { key: 'organza-saree',     label: 'Organza' },
  { key: 'tussar-saree',      label: 'Tussar' },
  { key: 'soft-silk-saree',   label: 'Soft Silk' },
  { key: 'cotton-saree',      label: 'Cotton' },
  { key: 'fancy-saree',       label: 'Fancy Saree' },
  { key: 'coord-sets',        label: 'Co-ord Sets' },
]

const DEFAULT_FILTERS = {
  category:   '',
  sort:       'default',
  maxPrice:   10000,
  collection: '',
}

function applyFilters(base, filters) {
  let result = [...base]

  if (filters.category === 'new-arrival') {
    result = result.filter((p) => p.isNewArrival)
  } else if (filters.category) {
    result = result.filter((p) => p.category === filters.category)
  }

  result = result.filter((p) => p.price <= filters.maxPrice)

  if (filters.collection === 'bestseller') result = result.filter((p) => p.isFeatured)
  if (filters.collection === 'new')        result = result.filter((p) => p.isNewArrival)
  if (filters.collection === 'sale')       result = result.filter((p) => p.originalPrice > p.price)

  switch (filters.sort) {
    case 'price-low':  result.sort((a, b) => a.price - b.price);  break
    case 'price-high': result.sort((a, b) => b.price - a.price);  break
    case 'newest':     result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0)); break
    case 'popular':    result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)); break
    default: break
  }

  return result
}

const CATEGORY_DESCRIPTIONS = {
  'unstitched-salwar': 'Shop premium unstitched salwar sets online. Beautiful prints and embroidery for daily and festive wear.',
  'kurthi-set':        'Explore elegant kurthi sets in silk blend, cotton and more. Perfect for daily wear and festive occasions.',
  'organza-saree':     'Buy designer organza sarees online with blouse. Embroidered and printed organza for party and festive wear.',
  'tussar-saree':      'Shop traditional tussar silk sarees with zari border. Perfect for festivals and traditional occasions.',
  'soft-silk-saree':   'Premium soft silk sarees with zari work for weddings and festive wear. Shop online at Resilda\'s Boutique.',
  'cotton-saree':      'Handloom and printed cotton sarees for daily wear. Comfortable, stylish and affordable.',
  'fancy-saree':       'Designer party wear sarees in chiffon and georgette with sequin work. Perfect for receptions and events.',
  'coord-sets':        'Trendy co-ord sets for women in premium fabric. Casual and party wear co-ord sets online.',
  'new-arrival':       'Shop the latest new arrivals at Resilda\'s Boutique. Fresh ethnic wear styles added regularly.',
}

function Products() {
  const { category }          = useParams()
  const [searchParams]        = useSearchParams()
  const q                     = searchParams.get('q') || ''
 const { products, loading, error } = useProducts()

  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    category: category || '',
  })

  const [activeTab, setActiveTab] = useState(category || 'all')

  useEffect(() => {
    const cat = category || ''
    setFilters((prev) => ({ ...prev, category: cat }))
    setActiveTab(cat || 'all')
  }, [category])

  const base = useMemo(() => {
    if (q) {
      const query = q.toLowerCase()
      return products.filter((p) =>
        p.name?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query) ||
        (p.fabric ?? '').toLowerCase().includes(query) ||
        (p.occasion ?? []).some((o) => o.toLowerCase().includes(query))
      )
    }
    return products
  }, [q, products])

  const displayed = useMemo(() => applyFilters(base, filters), [base, filters])

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey)
    setFilters((prev) => ({
      ...prev,
      category: tabKey === 'all' ? '' : tabKey,
    }))
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setActiveTab(newFilters.category || 'all')
  }

  const pageTitle = q
    ? `Search results for "${q}"`
    : filters.category && filters.category !== 'new-arrival'
      ? CATEGORY_LABELS[filters.category] ?? 'All Products'
      : filters.category === 'new-arrival'
        ? 'New Arrivals'
        : 'All Products'

  const metaTitle = q
    ? `Search: "${q}" | Resilda's Boutique`
    : filters.category
      ? `${pageTitle} | Resilda's Boutique`
      : `Shop All Ethnic Wear | Resilda's Boutique`

  const metaDescription = q
    ? `Search results for "${q}" at Resilda's Boutique. Premium ethnic wear with free delivery on every order.`
    : filters.category
      ? CATEGORY_DESCRIPTIONS[filters.category] ?? `Shop ${pageTitle} online at Resilda's Boutique. Free delivery on every order.`
      : `Shop premium sarees, kurthi sets, co-ord sets and ethnic wear at Resilda's Boutique, Udumalaipettai. Free delivery on every order.`

  const canonicalUrl = filters.category
    ? `https://resildas.com/products/${filters.category}`
    : `https://resildas.com/products`

  if (loading) {
    return (
      <main className="products-page">
        <div style={{ textAlign: 'center', padding: '8rem 1rem', color: 'var(--color-grey-500)' }}>
          Loading products...
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="products-page">
        <div style={{ textAlign: 'center', padding: '8rem 1rem' }}>
          <p style={{ color: 'var(--color-grey-500)', marginBottom: 16 }}>
            We couldn't load products right now. Please check your connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn"
            style={{
              padding: '0.75rem 2rem',
              background: 'var(--color-gold)',
              color: '#000',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="products-page">

      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home",    "item": "https://resildas.com" },
            { "@type": "ListItem", "position": 2, "name": pageTitle, "item": canonicalUrl }
          ]
        })}</script>
      </Helmet>

      {/* Page Header */}
      <FadeInUp duration={0.4}>
        <div className="products-page__header">
          <div className="products-page__header-inner">
            <nav className="products-page__breadcrumb">
              <Link to="/">Home</Link>
              <span className="products-page__breadcrumb-sep">›</span>
              <span>{pageTitle}</span>
            </nav>
            <h1 className="products-page__title">{pageTitle}</h1>
            <p className="products-page__subtitle">
              Discover our complete collection of premium ethnic wear
            </p>
          </div>
        </div>
      </FadeInUp>

      <div className="products-page__body">

        {/* Sidebar */}
        <ProductFilters
          filters={filters}
          onChange={handleFilterChange}
        />

        {/* Main Area */}
        <div className="products-area">

          {/* Top bar */}
          <div className="products-topbar">
            <p className="results-count">
              <span>{displayed.length}</span> products found
            </p>
          </div>

          {/* Category Tabs */}
          <div className="category-tabs">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.key}
                className={`tab-btn${activeTab === tab.key ? ' active' : ''}`}
                onClick={() => handleTabClick(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <FadeInUp key={filters.category} duration={0.35}>
            <ProductGrid products={displayed} />
          </FadeInUp>

        </div>
      </div>
    </main>
  )
}

export default Products