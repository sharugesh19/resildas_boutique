import { useState } from 'react'


const SORT_OPTIONS = [
  { value: 'default',    label: 'Default' },
  { value: 'price-low',  label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest',     label: 'Newest First' },
  { value: 'popular',    label: 'Most Popular' },
]

const COLLECTION_OPTIONS = [
  { value: 'bestseller', label: 'Best Sellers' },
  { value: 'new',        label: 'New Arrivals' },
  { value: 'sale',       label: 'On Sale' },
]

function ProductFilters({ filters, onChange }) {
  const { category, sort, maxPrice, collection } = filters
  const [draft, setDraft] = useState({ category, sort, maxPrice: maxPrice || 10000, collection: collection || '' })
  const [open, setOpen] = useState(false)

  const handleApply = () => {
    onChange({ ...filters, ...draft })
    setOpen(false)
  }

  const handleClear = () => {
    const reset = { category: '', sort: 'default', maxPrice: 10000, collection: '' }
    setDraft(reset)
    onChange({ ...filters, ...reset })
  }

  const activeCount = [
    draft.category !== '',
    draft.sort !== 'default',
    draft.maxPrice < 10000,
    draft.collection !== '',
  ].filter(Boolean).length

  return (
    <>
      {/* Mobile toggle button */}
      <button className="filters-toggle" onClick={() => setOpen(true)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="6" x2="20" y2="6"/>
          <line x1="8" y1="12" x2="20" y2="12"/>
          <line x1="12" y1="18" x2="20" y2="18"/>
        </svg>
        Filters
        {activeCount > 0 && <span className="filters-toggle__badge">{activeCount}</span>}
      </button>

      {/* Overlay */}
      {open && <div className="filters-overlay" onClick={() => setOpen(false)} />}

      {/* Sidebar / Drawer */}
      <aside className={`filters-sidebar${open ? ' filters-sidebar--open' : ''}`}>

        <div className="filter-header">
          <h3>Filters</h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button className="clear-filters" onClick={handleClear}>Clear All</button>
            <button className="filters-close" onClick={() => setOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>


        {/* Price Range */}
        <div className="filter-group">
          <h4>Price Range</h4>
          <div className="price-range">
            <div className="price-inputs">
              <input type="number" placeholder="Min ₹" value={0} readOnly />
              <span>—</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={draft.maxPrice}
                onChange={(e) => setDraft((d) => ({ ...d, maxPrice: Number(e.target.value) || 10000 }))}
              />
            </div>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={draft.maxPrice}
              onChange={(e) => setDraft((d) => ({ ...d, maxPrice: Number(e.target.value) }))}
            />
            <div className="price-labels">
              <span>₹0</span>
              <span style={{ color: 'var(--color-gold)', fontWeight: 600 }}>
                ₹{draft.maxPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Sort By */}
        <div className="filter-group">
          <h4>Sort By</h4>
          <div className="filter-options">
            {SORT_OPTIONS.map((opt) => (
              <label key={opt.value} className="filter-option">
                <input
                  type="radio"
                  name="sort"
                  value={opt.value}
                  checked={draft.sort === opt.value}
                  onChange={() => setDraft((d) => ({ ...d, sort: opt.value }))}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Collection */}
        <div className="filter-group">
          <h4>Collection</h4>
          <div className="filter-options">
            {COLLECTION_OPTIONS.map((opt) => (
              <label key={opt.value} className="filter-check">
                <input
                  type="checkbox"
                  checked={draft.collection === opt.value}
                  onChange={() =>
                    setDraft((d) => ({
                      ...d,
                      collection: d.collection === opt.value ? '' : opt.value,
                    }))
                  }
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <button className="btn-apply-filters" onClick={handleApply}>
          Apply Filters
        </button>
      </aside>
    </>
  )
}

export default ProductFilters