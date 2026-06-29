import React from 'react'
import { Link } from 'react-router-dom'
import { getNewArrivals } from '../../data/productsData'
import ProductCard from '../product/ProductCard'

function NewArrivals() {
  const products = getNewArrivals()
  if (products.length === 0) return null

  return (
    <section className="new-arrivals-section" id="new-arrivals">
      <div className="container">
        <div className="section-header-row">
          <div>
            <span className="eyebrow">Just In</span>
            <h2 className="section-title">New Arrivals</h2>
          </div>
          <Link to="/products/new-arrival" className="view-all-link">
            View All
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>

        <div className="arrivals-grid-premium">
          {products.slice(0, 4).map((product, i) => (
            <div key={product.id} className="arrival-card-wrap" style={{ '--delay': `${i * 80}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default NewArrivals