import '../styles/policy.css'

export default function ShippingPolicy() {
  return (
    <div className="policy-page">

      <div className="policy-hero">
        <p className="policy-hero__tag">✦ Legal &amp; Support</p>
        <h1 className="policy-hero__title">Shipping <span>Policy</span></h1>
        <div className="policy-gold-line"></div>
        <p className="policy-hero__meta">Last updated: July 2025</p>
      </div>

      <div className="policy-body">

        <div className="policy-notice">
          Thank you for shopping with <strong>Resilda's Boutique</strong>. We are
          committed to getting your order to you as quickly and safely as possible.
          Please read our shipping policy carefully before placing your order.
        </div>

        <div className="policy-section">
          <span className="policy-section__number">Section 01</span>
          <h2 className="policy-section__title">Order Processing</h2>
          <p>
            All orders are processed and dispatched on the <strong style={{color:'#d4a017'}}>same working day</strong>,
            provided the order is placed before our daily dispatch cut-off time. Orders
            placed on public holidays or Sundays will be dispatched on the next available
            working day.
          </p>
        </div>

        <div className="policy-section">
          <span className="policy-section__number">Section 02</span>
          <h2 className="policy-section__title">Delivery Timeline</h2>
          <p>
            Once your order has been dispatched, delivery typically takes
            <strong style={{color:'#d4a017'}}> 1 to 3 business days</strong>, depending
            on your location within India.
          </p>
          <div className="policy-highlight">
            <p>
              <strong style={{color:'#d4a017'}}>Please note:</strong> Delivery timelines
              are estimates and may vary slightly due to courier delays, weather conditions,
              peak shopping seasons, or other unforeseen circumstances beyond our control.
              We appreciate your patience in such situations.
            </p>
          </div>
        </div>

        <div className="policy-section">
          <span className="policy-section__number">Section 03</span>
          <h2 className="policy-section__title">Shipping Coverage</h2>
          <p>
            We currently ship across India. At this time, we do not offer international
            shipping.
          </p>
        </div>

        <div className="policy-section">
          <span className="policy-section__number">Section 04</span>
          <h2 className="policy-section__title">Order Tracking</h2>
          <p>
            Once your order is dispatched, you will receive a tracking number via SMS or
            WhatsApp to monitor your delivery status. If you do not receive tracking details
            within one business day of placing your order, please contact us.
          </p>
        </div>

        <div className="policy-section">
          <span className="policy-section__number">Section 05</span>
          <h2 className="policy-section__title">Delivery Attempts</h2>
          <p>
            Our courier partners will attempt delivery at the address provided during
            checkout. Please ensure someone is available to receive the parcel. In case of a
            failed delivery attempt, the courier may try again or leave a delivery notice.
          </p>
          <p>
            Resilda's Boutique is not responsible for non-delivery due to an incorrect or
            incomplete address provided by the customer.
          </p>
        </div>

        <div className="policy-section">
          <span className="policy-section__number">Section 06</span>
          <h2 className="policy-section__title">No Express or Same-Day Delivery</h2>
          <p>
            At this time, we do not offer express delivery or same-day delivery services.
            All orders are fulfilled through our standard dispatch process.
          </p>
        </div>

        <div className="policy-section">
          <span className="policy-section__number">Section 07</span>
          <h2 className="policy-section__title">Contact Us</h2>
          <p>If you have any questions about your shipment, feel free to reach out:</p>
          <div className="policy-contact-card">
            <div className="policy-contact-card__item">
              <div className="policy-contact-card__icon">✉</div>
              <span>
                Email: <a href="mailto:support@resildasboutique.com">
                  support@resildasboutique.com
                </a>
              </span>
            </div>
            <div className="policy-contact-card__item">
              <div className="policy-contact-card__icon">💬</div>
              <span>
                WhatsApp: <a href="https://wa.me/918300527985" target="_blank" rel="noreferrer">
                  +91 83005 27985
                </a>
              </span>
            </div>
          </div>
        </div>

        <div className="policy-footer-note">
          Resilda's Boutique · Udumalaipettai, Tamil Nadu, India
        </div>

      </div>
    </div>
  )
}