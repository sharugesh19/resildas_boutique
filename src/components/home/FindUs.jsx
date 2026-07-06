

function FindUs() {
  return (
    <section className="find-us-section" id="find-us">
      <div className="find-us-section__inner container">
        {/* Left: Details */}
        <div className="find-us__details">
          <span className="eyebrow">Visit Us</span>
          <h2 className="section-title">Find Our Store</h2>

          <div className="find-us__info-items">
            <div className="find-us__info-item">
              <div className="find-us__info-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <p className="find-us__info-label">Address</p>
                <p className="find-us__info-val">
                  Resilda's Boutique<br />
                  1st Floor, 11, 2nd Street,
                  near UK Hospital,<br />
                  Aishwarya Nagar,
                  Udumalaipettai,<br/>
                  Tamil Nadu 642154
                </p>
              </div>
            </div>

            <div className="find-us__info-item">
              <div className="find-us__info-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <p className="find-us__info-label">Store Hours</p>
                <p className="find-us__info-val">
                  Mon – Sat: 10:00 am – 7:00 pm<br />
                  Sunday: 11:00 am – 5:00 pm
                </p>
              </div>
            </div>

            <div className="find-us__info-item">
              <div className="find-us__info-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.59 3.41 2 2 0 0 1 3.56 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.49a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div>
                <p className="find-us__info-label">Phone &amp; Email</p>
                <p className="find-us__info-val">
                  +91 98765 43210<br />
                  hello@resildasboutique.com
                </p>
              </div>
            </div>
          </div>

          <a
            href="https://maps.google.com/?q=Coimbatore+Textile+Market"
            target="_blank"
            rel="noopener noreferrer"
            className="directions-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11"/>
            </svg>
            Get Directions
          </a>
        </div>

        {/* Right: Map placeholder / embed */}
        <div className="find-us__map">
          <div className="find-us__map-embed">
            {/* Replace with your actual Google Maps embed */}
            <iframe
              title="Resilda's Boutique Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.265657!2d76.9558432!3d11.0168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859af0eb22bfb%3A0x0!2sCoimbatore%2C+Tamil+Nadu!5e0!3m2!1sen!2sin!4v1609459200000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default FindUs
