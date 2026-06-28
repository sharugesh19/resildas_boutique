import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchProducts } from '../../data/productsData'
import { formatPrice }    from '../../utils/formatPrice'

function SearchBar({ onClose }) {
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState([])
  const inputRef              = useRef(null)
  const navigate              = useNavigate()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }
    setResults(searchProducts(query).slice(0, 6))
  }, [query])

  const handleSelect = (productId) => {
    onClose()
    navigate(`/product/${productId}`)
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1200,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'center', paddingTop: '15vh',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: 'var(--color-white)', width: '100%', maxWidth: 600,
        margin: '0 var(--space-4)', boxShadow: 'var(--shadow-lg)',
      }}>
        {/* Input */}
        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-4) var(--space-6)' }}>
          <span style={{ marginRight: 'var(--space-3)', fontSize: 'var(--text-xl)' }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search sarees, kurthi sets, co-ords…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: 'var(--text-lg)', fontFamily: 'var(--font-body)',
            }}
          />
          <button onClick={onClose} style={{ fontSize: 'var(--text-xl)', color: 'var(--color-grey-500)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul style={{ maxHeight: 360, overflowY: 'auto' }}>
            {results.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => handleSelect(p.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-6)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    borderBottom: '1px solid var(--color-border)', textAlign: 'left',
                    transition: 'background 150ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-off-white)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  {p.images[0] && (
                    <img src={p.images[0]} alt={p.name} style={{ width: 48, height: 64, objectFit: 'cover', flexShrink: 0, background: 'var(--color-grey-100)' }} />
                  )}
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 500 }}>{p.name}</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{p.category.replace('-', ' ')}</div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{formatPrice(p.price)}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}

        {query.trim().length >= 2 && results.length === 0 && (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No products found for "{query}"
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBar