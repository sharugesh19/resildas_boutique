import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart }  from '../context/CartContext'
import { useAuth }  from '../context/AuthContext'
import { formatPrice } from '../utils/formatPrice'

const EMPTY_ADDR = {
  firstName: '', lastName: '', email: '', phone: '',
  address: '', city: '', state: '', pincode: '',
}

function Checkout() {
  const { cart, cartTotal, clearCart } = useCart()
  const { user, isLoggedIn }           = useAuth()
  const navigate                       = useNavigate()

  const [addr, setAddr]         = useState({
    ...EMPTY_ADDR,
    email: user?.email ?? '',
    firstName: user?.displayName?.split(' ')[0] ?? '',
    lastName:  user?.displayName?.split(' ').slice(1).join(' ') ?? '',
  })
  const [payment, setPayment]   = useState('cod')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]       = useState('')

  const handleChange = (e) => {
    setAddr((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const shippingCost = cartTotal > 0 && cartTotal < 999 ? 99 : 0
  const orderTotal   = cartTotal + shippingCost

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      // TODO: Integrate Razorpay / payment gateway
      // For now simulate order placement
      await new Promise((r) => setTimeout(r, 1000))
      clearCart()
      navigate('/?order=success')
    } catch (err) {
      setError('Order could not be placed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (cart.length === 0) {
    return (
      <main className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h1>Your cart is empty</h1>
        <p>Add items to your cart before checking out.</p>
        <Link to="/products" className="btn btn--primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
          Continue Shopping
        </Link>
      </main>
    )
  }

  return (
    <main className="checkout-page">
      <div className="container">
        <h1 className="checkout-page__title">Checkout</h1>

        <div className="checkout-layout">
          {/* Form */}
          <form className="checkout-form" onSubmit={handleSubmit} noValidate>
            <section className="checkout-section">
              <h2 className="checkout-section__title">Delivery Details</h2>
              <div className="checkout-form__row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input id="firstName" name="firstName" type="text" value={addr.firstName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input id="lastName" name="lastName" type="text" value={addr.lastName} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input id="email" name="email" type="email" value={addr.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone *</label>
                <input id="phone" name="phone" type="tel" value={addr.phone} onChange={handleChange} required placeholder="10-digit mobile number" />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <input id="address" name="address" type="text" value={addr.address} onChange={handleChange} required placeholder="House / flat / street" />
              </div>
              <div className="checkout-form__row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input id="city" name="city" type="text" value={addr.city} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <input id="state" name="state" type="text" value={addr.state} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="pincode">Pincode *</label>
                  <input id="pincode" name="pincode" type="text" value={addr.pincode} onChange={handleChange} required placeholder="6 digits" maxLength={6} />
                </div>
              </div>
            </section>

            <section className="checkout-section">
              <h2 className="checkout-section__title">Payment Method</h2>
              <div className="payment-options">
                {[
                  { val: 'cod',      label: 'Cash on Delivery' },
                  { val: 'razorpay', label: 'Pay Online (UPI / Card / NetBanking)' },
                ].map((opt) => (
                  <label key={opt.val} className={`payment-option${payment === opt.val ? ' payment-option--active' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value={opt.val}
                      checked={payment === opt.val}
                      onChange={() => setPayment(opt.val)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </section>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="btn btn--primary checkout-submit" disabled={submitting}>
              {submitting ? 'Placing Order…' : `Place Order — ${formatPrice(orderTotal)}`}
            </button>
          </form>

          {/* Order Summary */}
          <aside className="checkout-summary">
            <h2 className="checkout-section__title">Order Summary</h2>
            <ul className="checkout-summary__items">
              {cart.map((item) => (
                <li key={item.key} className="checkout-summary__item">
                  <img src={item.product.images[0]} alt={item.product.name} className="checkout-summary__img" />
                  <div className="checkout-summary__detail">
                    <p className="checkout-summary__name">{item.product.name}</p>
                    <p className="checkout-summary__meta">Size: {item.size} · Qty: {item.quantity}</p>
                  </div>
                  <span className="checkout-summary__price">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="checkout-summary__totals">
              <div className="checkout-summary__row">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="checkout-summary__row">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
              </div>
              {shippingCost === 0 && (
                <p className="checkout-summary__free-note">🎉 Free shipping on orders above ₹999</p>
              )}
              <div className="checkout-summary__row checkout-summary__row--total">
                <span>Total</span>
                <span>{formatPrice(orderTotal)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default Checkout