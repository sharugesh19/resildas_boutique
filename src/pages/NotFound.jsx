import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

function NotFound() {
  return (
    <main className="not-found-page">
      <Helmet>
        <title>404 – Page Not Found | Resilda's Boutique</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="container not-found-page__inner">
        <h1 className="not-found-page__code">404</h1>
        <h2 className="not-found-page__title">Page not found</h2>
        <p className="not-found-page__text">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div className="not-found-page__actions">
          <Link to="/" className="btn btn--primary">Go Home</Link>
          <Link to="/products" className="btn btn--secondary">Shop All</Link>
        </div>
      </div>
    </main>
  )
}

export default NotFound