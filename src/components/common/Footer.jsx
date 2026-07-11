import { Link } from 'react-router-dom'

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/resildas_boutique',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/resildas',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/919876543210',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@resildas',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
      </svg>
    ),
  },
]

const quickLinks = [
  { label: 'Home',         path: '/' },
  { label: 'Categories',   path: '/products' },
  { label: 'Best Sellers', path: '/products?filter=featured' },
  { label: 'All Products', path: '/products' },
  { label: 'Contact Us',   path: '/#contact' },
]

const categoryLinks = [
  { label: 'Unstitched Salwar Set', path: '/products/unstitched-salwar' },
  { label: 'Kurthi Set',            path: '/products/kurthi-set' },
  { label: 'Organza Saree',         path: '/products/organza-saree' },
  { label: 'Tussar Saree',          path: '/products/tussar-saree' },
  { label: 'Soft Silk Saree',       path: '/products/soft-silk-saree' },
  { label: 'Cotton Saree',          path: '/products/cotton-saree' },
  { label: 'Fancy Saree',    path: '/products/fancy-saree' },
  { label: 'Co-ord Sets',           path: '/products/coord-sets' },
]

const customerCareLinks = [
  { label: 'My Account',          path: '/account' },
  { label: 'My Wishlist',         path: '/wishlist' },
  { label: 'Shipping Policy',     path: '/shipping-policy' },
  { label: 'Return & Refund',     path: '/return-policy' },
  { label: 'Privacy Policy',      path: '/privacy-policy' },
  { label: 'Terms & Conditions',  path: '/terms-and-conditions' },
]

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__main">

        {/* ── Brand ── */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo-link">
            <span className="footer__logo-text">Resilda's</span>
          </Link>
          <p className="footer__tagline">
            Premium ethnic wear for the modern Indian woman. Sarees, kurthi
            sets, co-ord sets and more — crafted with love.
          </p>
          <div className="footer__socials">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-btn"
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ── Quick Links ── */}
        <div className="footer__col">
          <h4 className="footer__col-title">Quick Links</h4>
          <ul className="footer__col-list">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.path} className="footer__col-link">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Categories ── */}
        <div className="footer__col">
          <h4 className="footer__col-title">Categories</h4>
          <ul className="footer__col-list">
            {categoryLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.path} className="footer__col-link">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Customer Care ── */}
        <div className="footer__col">
          <h4 className="footer__col-title">Customer Care</h4>
          <ul className="footer__col-list">
            {customerCareLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.path} className="footer__col-link">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div className="footer__bottom">
        <span>Resilda's Boutique</span>
      </div>
    </footer>
  )
}

export default Footer