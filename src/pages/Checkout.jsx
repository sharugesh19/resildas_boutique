import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useCart }  from '../context/CartContext'
import { useAuth }  from '../context/AuthContext'
import { formatPrice } from '../utils/formatPrice'

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman and Nicobar Islands','Chandigarh','Delhi','Jammu and Kashmir',
  'Ladakh','Lakshadweep','Puducherry',
]

const EMPTY_ADDR = {
  fullName: '', phone: '', email: '',
  address1: '', address2: '', city: '', state: '', pincode: '',
}

function Checkout() {
  const { cart, cartTotal, clearCart } = useCart()
  const { user }                       = useAuth()
  const navigate                       = useNavigate()

  const [addr, setAddr]             = useState({
    ...EMPTY_ADDR,
    email:    user?.email ?? '',
    fullName: user?.displayName ?? '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState('')

  const handleChange = (e) =>
    setAddr((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const orderTotal = cartTotal  // shipping always free

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      // TODO: Integrate Razorpay
      await new Promise((r) => setTimeout(r, 1000))
      clearCart()
      navigate('/?order=success')
    } catch {
      setError('Order could not be placed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (cart.length === 0) {
    return (
      <main className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <Helmet>
          <title>Checkout | Resilda's Boutique</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
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
      <Helmet>
        <title>Checkout | Resilda's Boutique</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Step indicator */}
      <div className="checkout-steps">
        <div className="checkout-step checkout-step--done">
          <span className="checkout-step__num">1</span>
          <span className="checkout-step__label">Cart</span>
        </div>
        <div className="checkout-step__line checkout-step__line--done" />
        <div className="checkout-step checkout-step--active">
          <span className="checkout-step__num">2</span>
          <span className="checkout-step__label">Details</span>
        </div>
        <div className="checkout-step__line" />
        <div className="checkout-step">
          <span className="checkout-step__num">3</span>
          <span className="checkout-step__label">Payment</span>
        </div>
      </div>

      <div className="checkout-container">
        <div className="checkout-layout">

          {/* Left — Form */}
          <form className="checkout-form" onSubmit={handleSubmit} noValidate>
            <div className="checkout-card">

              <h2 className="checkout-card__title">
                <span className="checkout-card__icon">📍</span> Delivery Details
              </h2>

              {/* Full Name + Phone */}
              <div className="checkout-form__row">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    id="fullName" name="fullName" type="text"
                    placeholder="Your full name"
                    value={addr.fullName} onChange={handleChange} required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    id="phone" name="phone" type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={addr.phone} onChange={handleChange} required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email" name="email" type="email"
                  placeholder="your@email.com"
                  value={addr.email} onChange={handleChange}
                />
              </div>

              {/* Address Line 1 */}
              <div className="form-group">
                <label htmlFor="address1">Address Line 1 *</label>
                <input
                  id="address1" name="address1" type="text"
                  placeholder="House no., Street name"
                  value={addr.address1} onChange={handleChange} required
                />
              </div>

              {/* Address Line 2 */}
              <div className="form-group">
                <label htmlFor="address2">Address Line 2</label>
                <input
                  id="address2" name="address2" type="text"
                  placeholder="Landmark, Area (optional)"
                  value={addr.address2} onChange={handleChange}
                />
              </div>

              {/* City + State */}
              <div className="checkout-form__row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    id="city" name="city" type="text"
                    placeholder="City"
                    value={addr.city} onChange={handleChange} required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <select id="state" name="state" value={addr.state} onChange={handleChange} required>
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pincode */}
              <div className="form-group form-group--half">
                <label htmlFor="pincode">Pincode *</label>
                <input
                  id="pincode" name="pincode" type="text"
                  placeholder="6-digit pincode"
                  value={addr.pincode} onChange={handleChange}
                  required maxLength={6}
                />
              </div>

              {/* Payment — online only */}
              <h2 className="checkout-card__title" style={{ marginTop: '2rem' }}>
                <span className="checkout-card__icon">💳</span> Payment Method
              </h2>

              <div className="payment-option payment-option--active">
                <span className="payment-option__icon">💳</span>
                <div>
                  <strong>Pay Online</strong>
                  <p>UPI, Cards, Net Banking via Razorpay</p>
                </div>
                <span className="payment-option__check">✔</span>
              </div>

            </div>

            {error && <p className="auth-error">{error}</p>}

            <button
              type="submit"
              className="checkout-submit"
              disabled={submitting}
            >
              💳 {submitting ? 'Processing…' : 'Pay Now'}
            </button>
          </form>

          {/* Right — Order Summary */}
          <aside className="checkout-summary">
            <div className="checkout-card">
              <h2 className="checkout-card__title">
                <span className="checkout-card__icon">🛍</span> Order Summary
              </h2>

              <ul className="checkout-summary__items">
                {cart.map((item) => (
                  <li key={item.key} className="checkout-summary__item">
                    <div className="checkout-summary__img-wrap">
                      {item.product.images?.[0]
                        ? <img src={item.product.images[0]} alt={item.product.name} />
                        : <span className="checkout-summary__img-placeholder">🖼</span>
                      }
                    </div>
                    <div className="checkout-summary__detail">
                      <p className="checkout-summary__name">
                        {item.product.name}
                        {item.size !== 'Free Size' && ` (${item.size})`}
                      </p>
                      <p className="checkout-summary__meta">Qty: {item.quantity}</p>
                      <p className="checkout-summary__price">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
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
                  <span className="checkout-summary__free">FREE</span>
                </div>
                <div className="checkout-summary__row checkout-summary__row--total">
                  <span>Total</span>
                  <span>{formatPrice(orderTotal)}</span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="checkout-trust">
                <div className="checkout-trust__item">
                  <span>🛡</span>
                  <p>Secure Payment</p>
                </div>
                <div className="checkout-trust__item">
                  <span>🔄</span>
                  <p>Damage Exchange</p>
                </div>
                <div className="checkout-trust__item">
                  <span>🚚</span>
                  <p>Fast Delivery</p>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </main>
  )
}

export default Checkout