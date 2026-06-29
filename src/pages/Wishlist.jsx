import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useWishlist } from '../context/WishlistContext'
import { getProductById } from '../data/productsData'
import ProductCard from '../components/product/ProductCard'

function Wishlist() {
  const { wishlist, wishlistCount } = useWishlist()

  const products = wishlist
    .map((id) => getProductById(id))
    .filter(Boolean) // skip any stale ids not in data

  return (
    <main className="wishlist-page">
      <Helmet>
        <title>My Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ''} | Resilda's Boutique</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="container">
        <h1 className="wishlist-page__title">
          My Wishlist {wishlistCount > 0 && <span>({wishlistCount})</span>}
        </h1>

        {products.length === 0 ? (
          <div className="wishlist-page__empty">
            <span style={{ fontSize: '3rem' }}>♡</span>
            <p>Your wishlist is empty.</p>
            <Link to="/products" className="btn btn--primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="product-grid product-grid--3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Wishlist