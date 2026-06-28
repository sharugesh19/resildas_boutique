import React, { useState } from 'react'

function ProductGallery({ images = [], name = '' }) {
  const [active, setActive] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  if (images.length === 0) {
    return (
      <div className="product-gallery product-gallery--empty">
        <div className="product-gallery__main">
          <span>No image available</span>
        </div>
      </div>
    )
  }

  return (
    <div className="product-gallery">
      {/* Main image */}
      <div
        className={`product-gallery__main${zoomed ? ' product-gallery__main--zoomed' : ''}`}
        onClick={() => setZoomed((z) => !z)}
        title={zoomed ? 'Click to zoom out' : 'Click to zoom in'}
      >
        <img
          src={images[active]}
          alt={`${name} — image ${active + 1}`}
          className="product-gallery__img"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="product-gallery__thumbs">
          {images.map((src, i) => (
            <button
              key={i}
              className={`product-gallery__thumb${i === active ? ' product-gallery__thumb--active' : ''}`}
              onClick={() => { setActive(i); setZoomed(false) }}
              aria-label={`View image ${i + 1}`}
            >
              <img src={src} alt={`${name} thumbnail ${i + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductGallery