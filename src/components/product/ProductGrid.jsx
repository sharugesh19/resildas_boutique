import ProductCard from './ProductCard'

function ProductGrid({ products = [] }) {
  if (products.length === 0) {
    return (
      <div className="product-grid__empty">
        <p>No products found. Try adjusting your filters.</p>
      </div>
    )
  }

  return (
    <div className="product-grid product-grid--3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid