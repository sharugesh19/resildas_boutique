import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../product/ProductCard'

function BestSellingCarousel() {
  const { products: all, loading } = useProducts()
  const [activeIndex, setActiveIndex] = useState(1)
  const trackRef = useRef(null)

  const products = all.filter(p => p.isFeatured)

  if (loading || products.length === 0) return null

  const prev = () => setActiveIndex((i) => Math.max(0, i - 1))
  const next = () => setActiveIndex((i) => Math.min(products.length - 1, i + 1))

  return (
    <section className="bestsellers-section" id="best-sellers">
      <div className="container">
        <div className="section-header-row">
          <div>
            <span className="eyebrow">Most Loved</span>
            <h2 className="section-title">Best Sellers</h2>
          </div>
          <Link to="/products" className="view-all-link">
            View All
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
      </div>

      <div className="bs-carousel" ref={trackRef}>
        <button
          className="bs-carousel__btn bs-carousel__btn--prev"
          onClick={prev}
          disabled={activeIndex === 0}
          aria-label="Previous"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <div className="bs-carousel__track">
          {products.map((product, i) => {
            const diff = i - activeIndex
            const isActive = diff === 0
            const isAdjacent = Math.abs(diff) === 1
            const isVisible = Math.abs(diff) <= 2

            return (
              <div
                key={product.id}
                className={[
                  'bs-carousel__item',
                  isActive ? 'bs-carousel__item--active' : '',
                  isAdjacent ? 'bs-carousel__item--adjacent' : '',
                  isVisible ? 'bs-carousel__item--visible' : '',
                ].filter(Boolean).join(' ')}
                style={{
                  '--offset': diff,
                  transform: `translateX(calc(${diff} * var(--bs-card-step))) scale(${isActive ? 1.05 : isAdjacent ? 0.92 : 0.82})`,
                  opacity: isActive ? 1 : isAdjacent ? 0.65 : 0.35,
                  zIndex: 10 - Math.abs(diff),
                  pointerEvents: isActive ? 'auto' : 'none',
                  transition: 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.5s ease',
                }}
                onClick={() => !isActive && setActiveIndex(i)}
              >
                <ProductCard product={product} />
              </div>
            )
          })}
        </div>

        <button
          className="bs-carousel__btn bs-carousel__btn--next"
          onClick={next}
          disabled={activeIndex === products.length - 1}
          aria-label="Next"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

      <div className="bs-carousel__dots">
        {products.map((_, i) => (
          <button
            key={i}
            className={`bs-carousel__dot${i === activeIndex ? ' bs-carousel__dot--active' : ''}`}
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to product ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default BestSellingCarousel