import React, { useState, useEffect, useRef } from 'react'

const testimonials = [
  {
    id: 1,
    name: 'Priya Ramachandran',
    city: 'Chennai',
    text: 'Absolutely love the Kanjivaram saree I ordered! The quality is exceptional and it arrived beautifully packaged. Will treasure it forever.',
    rating: 5,
    initials: 'PR',
  },
  {
    id: 2,
    name: 'Meena Subramaniam',
    city: 'Coimbatore',
    text: 'The Anarkali set fits perfectly. The fabric is so soft and the colours are exactly as shown. Ordered twice now — never disappointed!',
    rating: 5,
    initials: 'MS',
  },
  {
    id: 3,
    name: 'Divya Krishnamurthy',
    city: 'Bangalore',
    text: "Great customer service and fast delivery. The co-ord set I bought received so many compliments at the wedding. Resilda's is my go-to boutique.",
    rating: 5,
    initials: 'DK',
  },
  {
    id: 4,
    name: 'Anitha Venkatesh',
    city: 'Madurai',
    text: 'Beautiful silk saree with amazing craftsmanship. The packaging was luxurious and delivery was prompt. Highly recommended!',
    rating: 5,
    initials: 'AV',
  },
  {
    id: 5,
    name: 'Kavitha Nair',
    city: 'Kochi',
    text: "Stunning collection! Found the perfect outfit for my sister's wedding. The team was very helpful with size selection too.",
    rating: 5,
    initials: 'KN',
  },
]

function Stars({ count }) {
  return (
    <div className="testimonial__stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24"
          fill={i < count ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  )
}

function Testimonials() {
  const [active, setActive] = useState(0)
  const gridRef = useRef(null)
  const isMobile = () => window.innerWidth <= 768

  // Auto-advance
  useEffect(() => {
    const t = setInterval(() => {
      setActive((a) => {
        const next = (a + 1) % testimonials.length
        scrollToCard(next)
        return next
      })
    }, 5000)
    return () => clearInterval(t)
  }, [])

  const scrollToCard = (index) => {
    if (!gridRef.current || !isMobile()) return
    const cards = gridRef.current.querySelectorAll('.testimonial-card')
    if (cards[index]) {
      const card = cards[index]
      const grid = gridRef.current
      const scrollLeft = card.offsetLeft - (grid.offsetWidth / 2) + (card.offsetWidth / 2)
      grid.scrollTo({ left: scrollLeft, behavior: 'smooth' })
    }
  }

  const handleDotClick = (i) => {
    setActive(i)
    scrollToCard(i)
  }

  // Sync dot with scroll position
  const handleScroll = () => {
    if (!gridRef.current) return
    const grid = gridRef.current
    const cards = grid.querySelectorAll('.testimonial-card')
    const gridCenter = grid.scrollLeft + grid.offsetWidth / 2
    let closest = 0
    let minDist = Infinity
    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      const dist = Math.abs(cardCenter - gridCenter)
      if (dist < minDist) { minDist = dist; closest = i }
    })
    setActive(closest)
  }

  return (
    <section className="testimonials-section" id="reviews">
      <div className="testimonials-section__bg" aria-hidden="true" />
      <div className="container">
        <div className="testimonials-section__head">
          <span className="eyebrow eyebrow--light">Our Customers</span>
          <h2 className="section-title section-title--light">Love Stories</h2>
          <p className="section-sub section-sub--light">4.8★ average across 4,000+ happy customers</p>
        </div>

        <div className="testimonials-grid" ref={gridRef} onScroll={handleScroll}>
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className={`testimonial-card${i === active ? ' testimonial-card--active' : ''}`}
              onClick={() => { setActive(i); scrollToCard(i) }}
            >
              <div className="testimonial-card__top">
                <div className="testimonial-card__avatar">{t.initials}</div>
                <div>
                  <p className="testimonial-card__name">{t.name}</p>
                  <p className="testimonial-card__city">{t.city}</p>
                </div>
              </div>
              <Stars count={t.rating} />
              <p className="testimonial-card__text">"{t.text}"</p>
            </div>
          ))}
        </div>

        <div className="testimonials-dots">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`testimonials-dot${i === active ? ' testimonials-dot--active' : ''}`}
              onClick={() => handleDotClick(i)}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials