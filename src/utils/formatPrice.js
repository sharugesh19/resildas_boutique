/**
 * FORMAT PRICE
 * Formats a number as Indian Rupees.
 * Usage: formatPrice(8500) → "₹8,500"
 */
export function formatPrice(amount) {
  return new Intl.NumberFormat('en-IN', {
    style:    'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Returns the discount percentage between originalPrice and price.
 * Returns 0 if there's no discount.
 */
export function calcDiscount(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return 0
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}