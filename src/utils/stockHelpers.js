// Single source of truth for "how many of this product/color/size can be added".
// Used identically by ProductDetail's quantity selector and CartDrawer,
// so admin stock edits are respected consistently everywhere — no more
// divergent logic between the two.

export function getMaxQty(product, size, color) {
  if (!product) return 0

  if (color && Array.isArray(product.colors)) {
    const colorData = product.colors.find((c) => c.name === color)
    if (colorData && Array.isArray(colorData.sizes)) {
      const sizeData = colorData.sizes.find((s) => s.size === size)
      if (sizeData && typeof sizeData.stock === 'number') {
        return sizeData.stock
      }
    }
  } else if (Array.isArray(product.sizes)) {
    const sizeData = product.sizes.find((s) => s.size === size)
    if (sizeData && typeof sizeData.stock === 'number') {
      return sizeData.stock
    }
  }

  if (typeof product.stock === 'number') {
    return product.stock
  }

  // No stock data at all for this product — conservative fallback,
  // never the dangerous 999 ProductDetail used before.
  return 10
}