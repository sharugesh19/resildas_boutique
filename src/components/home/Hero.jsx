import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import heroSlides from '../../data/heroSlides';
import './Hero.css';
import { StarIcon } from '../common/Icons';
export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const intervalRef = useRef(null);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const total = heroSlides.length;

  /* ── particles ─────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    particlesRef.current = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.55 + 0.15,
      dx: (Math.random() - 0.5) * 0.35,
      dy: -(Math.random() * 0.55 + 0.2),
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,160,23,${p.alpha})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width; }
        if (p.x < -4) p.x = canvas.width + 4;
        if (p.x > canvas.width + 4) p.x = -4;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  /* ── slide change ──────────────────── */
  const goTo = useCallback((idx) => {
    setFading(true);
    setTimeout(() => { setCurrent(idx); setFading(false); }, 320);
  }, []);

  const resetInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % total;
        setFading(true);
        setTimeout(() => setFading(false), 320);
        return next;
      });
    }, 5000);
  }, [total]);

  useEffect(() => { resetInterval(); return () => clearInterval(intervalRef.current); }, [resetInterval]);

  const handleDot = (idx) => { goTo(idx); resetInterval(); };
  const slide = heroSlides[current];
  const WA = "https://wa.me/91XXXXXXXXXX";

  /* icon helper — avoids self-closing stripping */
  const BagIcon = () => (
    <span className="rh-icon" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3.01 6H21M16 10a4 4 0 01-8 0"/>
      </svg>
    </span>
  );

  const WAIcon = () => (
    <span className="rh-icon rh-icon-wa" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </span>
  );

  return (
    <section className="rh-hero" id="home">
       <h1 className="rh-visually-hidden">
          Resilda's Boutique — Premium Ethnic Wear, Sarees &amp; Kurthi Sets Online
       </h1>
      {/* slider */}
      <div className="rh-slider">
        {heroSlides.map((s, i) => (
          <div key={s.id} className={`rh-slide${i === current ? ' active' : ''}`}>
            <div className="rh-slide-fallback"></div>
             <picture>
                <source media="(max-width: 768px)" srcSet={s.mobileImage} />
                <img src={s.image} alt={s.label} loading={i === 0 ? 'eager' : 'lazy'} />
              </picture>
          </div>
        ))}
      </div>

      {/* overlay */}
      <div className="rh-overlay"></div>

      {/* particles */}
      <canvas ref={canvasRef} className="rh-particles" aria-hidden="true"></canvas>

      {/* desktop text + CTAs */}
      <div className="rh-content">
        <div className={`rh-text${fading ? ' is-fading' : ''} rh-align-${slide.ctaAlign}`}>
          <div className="rh-ctas">
            <Link to="/products" className="rh-btn-primary">
              <BagIcon /> Shop Now
            </Link>
            <a href={WA} className="rh-btn-whatsapp" target="_blank" rel="noreferrer">
              <WAIcon /> Order on WhatsApp
            </a>
          </div>
        </div>
      </div>


      {/* slide label */}
      <div className="rh-label">{slide.label}</div>

      {/* dots */}
      <div className="rh-bottom-controls">
        <div className="rh-dots">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              className={`rh-dot${i === current ? ' active' : ''}`}
              onClick={() => handleDot(i)}
              aria-label={`Slide ${i + 1}`}
            ></button>
          ))}
        </div>
      </div>

      {/* stats bar */}
      <div className="rh-stats-bar">
        <div className="rh-stat"><span>500+</span><p>Products</p></div>
        <div className="rh-stat-divider"></div>
        <div className="rh-stat"><span>1.6K+</span><p>Happy Customers</p></div>
        <div className="rh-stat-divider"></div>
        <div className="rh-stat"><span>8</span><p>Categories</p></div>
        <div className="rh-stat-divider"></div>
        <div className="rh-stat"><span><span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>4.8<StarIcon size={14} /></span></span><p>Avg Rating</p></div>
      </div>

    </section>
  );
}