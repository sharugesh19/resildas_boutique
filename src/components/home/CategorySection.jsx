import { Link } from 'react-router-dom'

// 8 Premium Categories
const categoryCards = [
  {
    key:    'unstitched-salwar',
    label:  'Unstitched Salwar Set',
    sub:    'Customize your style',
    image:  '/assets/category/unstitched-salwar-material.webp',
    path:   '/products/unstitched-salwar',
  },
  {
    key:    'kurthi-set',
    label:  'Kurthi Set',
    sub:    'Elegant everyday wear',
    image:  '/assets/category/kurthi-set.webp',
    path:   '/products/kurthi-set',
  },
  {
    key:    'organza-saree',
    label:  'Organza Saree',
    sub:    'Sheer luxury drapes',
    image:  '/assets/category/organza-saree.webp',
    path:   '/products/organza-saree',
  },
  {
    key:    'tussar-saree',
    label:  'Tussar Saree',
    sub:    'Natural texture, pure grace',
    image:  '/images/categories/sarees.jpg',
    path:   '/products/tussar-saree',
  },
  {
    key:    'soft-silk-saree',
    label:  'Soft Silk Saree',
    sub:    'Timeless silk elegance',
    image:  '/images/categories/sarees.jpg',
    path:   '/products/soft-silk-saree',
  },
  {
    key:    'cotton-saree',
    label:  'Cotton Saree',
    sub:    'Comfort meets tradition',
    image:  '/assets/category/cotton-saree.webp',
    path:   '/products/cotton-saree',
  },
  {
    key:    'fancy-saree',
    label:  'Fancy Saree',
    sub:    'Breezy all-day drapes',
    image:  '/images/categories/sarees.jpg',
    path:   '/products/fancy-saree',
  },
  {
    key:    'coord-sets',
    label:  'Co-ord Sets',
    sub:    'Perfectly matched sets',
    image:  '/images/categories/coord-sets.jpg',
    path:   '/products/coord-sets',
  },
]

function CategorySection() {
  return (
    <section className="category-section" id="categories">
      <div className="category-section__head">
        <span className="eyebrow">Explore</span>
        <h2 className="section-title">Shop by Category</h2>
        <p className="section-sub">Eight curated collections for every occasion</p>
      </div>

      <div className="category-grid-8">
        {categoryCards.map((cat, i) => (
          <Link key={cat.key} to={cat.path} className="cat-card" style={{ '--delay': `${i * 40}ms` }}>
            <div className="cat-card__img-wrap">
              <img src={cat.image} alt={cat.label} loading="lazy" className="cat-card__img" />
              <div className="cat-card__gradient" />
            </div>
            <div className="cat-card__body">
              <h3 className="cat-card__label">{cat.label}</h3>
              <p className="cat-card__sub">{cat.sub}</p>
            </div>
          </Link>
        ))}
      </div>
       <div className="category-section__note">
        <span className="eyebrow">Our Philosophy</span>
        <p className="category-section__intro-text">
          Eight handpicked collections — from breathable cotton and organza sarees to kurthi
          sets and co-ord sets — curated for women who love traditional and contemporary
          Indian fashion.
        </p>
      </div>
    </section>
  )
}

export default CategorySection