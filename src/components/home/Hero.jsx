import "./Hero.css";

export default function Hero() {
  return (
    <section className="rb-hero">
      <div className="rb-hero__inner">
        {/* Text column */}
        <div className="rb-hero__copy">
          <span className="rb-hero__eyebrow">Curated &amp; handpicked</span>

          <h1 className="rb-hero__title">
            Style that feels
            <br />
            like <em>you</em>.
          </h1>

          <p className="rb-hero__subtitle">
            Resilda&rsquo;s Boutique brings together small-batch fashion finds
            and timeless staples — each piece chosen for the way it makes you
            move through your day.
          </p>

          <div className="rb-hero__actions">
            <a href="#shop" className="rb-btn rb-btn--primary">
              Shop New Arrivals
            </a>
            <a href="#story" className="rb-btn rb-btn--ghost">
              Our Story
            </a>
          </div>

          <div className="rb-hero__stats">
            <div>
              <strong>120+</strong>
              <span>Curated styles</span>
            </div>
            <div>
              <strong>4.9★</strong>
              <span>Customer rating</span>
            </div>
            <div>
              <strong>2–4 days</strong>
              <span>Doorstep delivery</span>
            </div>
          </div>
        </div>

        {/* Image column */}
        <div className="rb-hero__visual">
          <div className="rb-hero__frame">
            <img
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?fm=jpg&q=80&w=1200&auto=format&fit=crop"
              alt="Resilda's Boutique clothing rack interior"
              className="rb-hero__image"
              loading="eager"
            />

            {/* Signature element: a hanging boutique price tag */}
            <div className="rb-tag">
              <span className="rb-tag__hole" />
              <span className="rb-tag__text">New&nbsp;Season</span>
              <span className="rb-tag__sub">Handpicked for you</span>
            </div>
          </div>

          <div className="rb-hero__glow" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
