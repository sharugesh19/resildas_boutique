import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import heroSlides from '../../data/heroSlides'

const WHATSAPP_NUMBER = '919876543210'
const WHATSAPP_MSG = encodeURIComponent('Hi! I found you on your website and would like to know more about your products.')

function Hero() {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const navigate = useNavigate()

  const goTo = useCallback((index) => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrent(index)
    setTimeout(() => setIsAnimating(false), 700)
  }, [isAnimating])

  const next = useCallback(() => {
    goTo((current + 1) % heroSlides.length)
  }, [current, goTo])

  const prev = useCallback(() => {
    goTo((current - 1 + heroSlides.length) % heroSlides.length)
  }, [current, goTo])

  useEffect(() => {
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="hero" aria-label="Hero carousel">
      {heroSlides.map((slide, i) => {
        const isActive = i === current
        const isEven = i % 2 === 0

        return (
          <div
            key={slide.id}
            className={`hero__slide${isActive ? ' hero__slide--active' : ''}${isEven ? ' hero__slide--text-left' : ' hero__slide--text-right'}`}
            aria-hidden={!isActive}
          >
            <div className={`hero__split${isEven ? '' : ' hero__split--reverse'}`}>
              {/* Text panel */}
              <div className="hero__text-panel">
                <div className="hero__text-inner">
                  <span className="eyebrow">Resilda's Boutique</span>
                  <h1 className="hero__headline">{slide.headline}</h1>
                  <p className="hero__tagline">{slide.tagline}</p>

                  {/* Desktop CTAs — inside text panel */}
                  <div className="hero__cta-group hero__cta-group--desktop">
                    <button
                      className="hero__cta hero__cta--primary"
                      onClick={() => navigate('/products')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                      </svg>
                      SHOP NOW
                    </button>
                    <a
                      className="hero__cta hero__cta--whatsapp"
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.554 4.112 1.523 5.838L.057 23.25a.75.75 0 0 0 .92.92l5.413-1.466A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.716 9.716 0 0 1-4.96-1.358l-.356-.211-3.683.998.975-3.564-.232-.366A9.715 9.715 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
                      </svg>
                      ORDER ON WHATSAPP
                    </a>
                  </div>
                </div>
              </div>

              {/* Image panel */}
              <div className="hero__img-panel">
                <div className="hero__img-frame">
                  <img src={slide.image} alt={slide.headline} loading={i === 0 ? 'eager' : 'lazy'} />
                </div>
              </div>
            </div>

            {/* Mobile CTAs — full width, outside split, side by side */}
            <div className="hero__cta-group hero__cta-group--mobile">
              <button
                className="hero__cta hero__cta--primary"
                onClick={() => navigate('/products')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                SHOP NOW
              </button>
              <a
                className="hero__cta hero__cta--whatsapp"
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.554 4.112 1.523 5.838L.057 23.25a.75.75 0 0 0 .92.92l5.413-1.466A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.716 9.716 0 0 1-4.96-1.358l-.356-.211-3.683.998.975-3.564-.232-.366A9.715 9.715 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
                </svg>
                ORDER ON WHATSAPP
              </a>
            </div>
          </div>
        )
      })}

      {/* Controls */}
      <button className="hero__arrow hero__arrow--prev" onClick={prev} aria-label="Previous slide">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <button className="hero__arrow hero__arrow--next" onClick={next} aria-label="Next slide">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>

      {/* Dots */}
      <div className="hero__dots">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            className={`hero__dot${i === current ? ' hero__dot--active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="hero__counter">
        <span className="hero__counter-current">{String(current + 1).padStart(2, '0')}</span>
        <span className="hero__counter-sep">/</span>
        <span className="hero__counter-total">{String(heroSlides.length).padStart(2, '0')}</span>
      </div>
    </section>
  )
}

export default Hero