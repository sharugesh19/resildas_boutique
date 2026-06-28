import React, { useMemo, useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import products, { CATEGORY_LABELS, searchProducts } from '../data/productsData'
import ProductGrid    from '../components/product/ProductGrid'
import ProductFilters from '../components/product/ProductFilters'

const CATEGORY_TABS = [
  { key: 'all',               label: 'All' },
  { key: 'new-arrival',       label: 'New Arrivals' },
  { key: 'unstitched-salwar', label: 'Salwar Set' },
  { key: 'kurthi-set',        label: 'Kurthi Set' },
  { key: 'organza-saree',     label: 'Organza' },
  { key: 'tussar-saree',      label: 'Tussar' },
  { key: 'soft-silk-saree',   label: 'Soft Silk' },
  { key: 'cotton-saree',      label: 'Cotton' },
  { key: 'lightweight-saree', label: 'Light Weight' },
  { key: 'coord-sets',        label: 'Co-ord Sets' },
]

const DEFAULT_FILTERS = {
  category:   '',
  sort:       'default',
  maxPrice:   10000,
  collection: '', // 'bestseller' | 'new' | 'sale'
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

function Products() {
  const { category }     = useParams()
  const [searchParams]   = useSearchParams()
  const q                = searchParams.get('q') || ''

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
    if (q) return searchProducts(q)
    return products
  }, [q])

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

  return (
    <main className="products-page">

      {/* ── Page Header ── */}
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

      <div className="products-page__body">

        {/* ── Sidebar ── */}
        <ProductFilters
          filters={filters}
          onChange={handleFilterChange}
        />

        {/* ── Main Area ── */}
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
          <ProductGrid products={displayed} />
        </div>

      </div>
    </main>
  )
}

export default Products