import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../../hooks/useProducts'
import { formatPrice }    from '../../utils/formatPrice'

function SearchBar({ onClose }) {
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState([])
  const { products } = useProducts()
  const inputRef              = useRef(null)
  const navigate              = useNavigate()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return }
    const q = query.toLowerCase()
    const found = products.filter((p) =>
      p.name?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      (p.fabric ?? '').toLowerCase().includes(q)
    ).slice(0, 6)
    setResults(found)
  }, [query, products])

  const handleSelect = (productId) => {
    onClose()
    navigate(`/product/${productId}`)
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1200,
        background: 'rgba(10,8,6,0.72)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'center', paddingTop: '14vh',
        animation: 'searchFadeIn 200ms ease',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <style>{`
        @keyframes searchFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes searchPanelIn {
          from { opacity: 0; transform: translateY(-12px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .search-result-item:hover {
          background: rgba(194,144,58,0.06) !important;
        }
        .search-close-btn:hover {
          color: var(--color-black) !important;
        }
      `}</style>

      <div style={{
        background: 'var(--color-white)',
        width: '100%', maxWidth: 600,
        margin: '0 var(--space-4)',
        borderRadius: 6,
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        border: '1px solid rgba(194,144,58,0.25)',
        animation: 'searchPanelIn 220ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {/* Input */}
        <div style={{
          display: 'flex', alignItems: 'center',
          borderBottom: '1px solid var(--color-grey-200, #eee)',
          padding: '18px var(--space-6)',
          gap: 'var(--space-3)',
        }}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search sarees, kurthi sets, co-ords…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: '1.05rem', fontFamily: 'var(--font-body)',
              color: 'var(--color-black)',
              background: 'transparent',
            }}
          />
          <button
            className="search-close-btn"
            onClick={onClose}
            aria-label="Close search"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 30, height: 30, borderRadius: '50%',
              color: 'var(--color-grey-500, #888)',
              background: 'none', border: 'none', cursor: 'pointer',
              flexShrink: 0, transition: 'color 150ms ease',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul style={{ maxHeight: 400, overflowY: 'auto', listStyle: 'none', margin: 0, padding: 0 }}>
            {results.map((p) => (
              <li key={p.id}>
                <button
                  className="search-result-item"
                  onClick={() => handleSelect(p.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    gap: 'var(--space-4)', padding: '14px var(--space-6)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    borderBottom: '1px solid var(--color-grey-100, #f3f3f3)',
                    textAlign: 'left', transition: 'background 150ms ease',
                  }}
                >
                  {p.images?.[0] ? (
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      style={{
                        width: 50, height: 66, objectFit: 'cover',
                        flexShrink: 0, borderRadius: 3,
                        background: 'var(--color-off-white)',
                        border: '1px solid rgba(0,0,0,0.06)',
                      }}
                    />
                  ) : (
                    <div style={{
                      width: 50, height: 66, flexShrink: 0, borderRadius: 3,
                      background: 'var(--color-off-white)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.2rem', color: 'var(--color-grey-300, #ccc)',
                    }}>🖼</div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'var(--font-display)', fontSize: '1.02rem',
                      fontWeight: 500, color: 'var(--color-black)',
                      marginBottom: 2, overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {p.name}
                    </div>
                    <div style={{
                      fontSize: '0.68rem', fontWeight: 700,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: 'var(--color-gold)', marginBottom: 4,
                    }}>
                      {p.category.replace('-', ' ')}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-black)' }}>
                      {formatPrice(p.price)}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}

        {query.trim().length >= 2 && results.length === 0 && (
          <div style={{
            padding: 'var(--space-10) var(--space-6)',
            textAlign: 'center', color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)', fontSize: '0.9rem',
          }}>
            No products found for "{query}"
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBar