import '../styles/policy.css'

export default function ReturnPolicy() {
  return (
    <div className="policy-page">

      <div className="policy-hero">
        <p className="policy-hero__tag">✦ Legal &amp; Support</p>
        <h1 className="policy-hero__title">Return &amp; <span>Refund Policy</span></h1>
        <div className="policy-gold-line"></div>
        <p className="policy-hero__meta">Last updated: July 2025</p>
      </div>

      <div className="policy-body">

        <div className="policy-notice">
          At <strong>Resilda's Boutique</strong>, we take great care in packaging and
          dispatching every order. Please read this policy carefully to understand what
          is covered and what is not before placing your order.
        </div>

        <div className="policy-section">
          <span className="policy-section__number">Section 01</span>
          <h2 className="policy-section__title">Order Cancellation</h2>
          <p>
            <strong style={{color:'#d4a017'}}>Orders cannot be cancelled once they have
            been placed.</strong> We begin processing your order immediately after it is
            confirmed in order to ensure same-day dispatch. Please review your order
            carefully before completing your purchase.
          </p>
        </div>

        <div className="policy-section">
          <span className="policy-section__number">Section 02</span>
          <h2 className="policy-section__title">Refund Policy</h2>
          <p>
            We do not offer refunds after delivery under any circumstances, including
            but not limited to:
          </p>
          <ul className="policy-list">
            <li>Change of mind after purchase</li>
            <li>Incorrect size ordered by the customer</li>
            <li>Colour appearing slightly different due to screen or monitor settings</li>
            <li>Delay in delivery caused by courier or external factors</li>
          </ul>
          <p>
            We encourage you to review product descriptions, size charts, and images
            carefully before placing your order. If you have any questions about a
            product, please contact us before purchasing.
          </p>
        </div>

        <div className="policy-section">
          <span className="policy-section__number">Section 03</span>
          <h2 className="policy-section__title">When Can You Request a Replacement?</h2>
          <p>
            We accept replacement requests <strong style={{color:'#d4a017'}}>only in
            the case of a damaged product</strong> received by the customer. If your
            order arrives in a damaged condition, you may be eligible for a replacement
            subject to the conditions below.
          </p>
        </div>

        <div className="policy-section">
          <span className="policy-section__number">Section 04</span>
          <h2 className="policy-section__title">How to Report a Damaged Product</h2>
          <p>To be eligible for a replacement, you must:</p>
          <ol className="policy-steps">
            <li>
              <strong style={{color:'#fafafa'}}>Report the damage within 24 hours of
              delivery.</strong> Requests raised after 24 hours will not be accepted
              under any circumstances.
            </li>
            <li>
              <strong style={{color:'#fafafa'}}>Provide a clear, unedited unboxing or
              opening video</strong> as proof of the damage. This video must show the
              package being opened and the damaged product in its received condition.
              Without this video, we will be unable to process your request.
            </li>
          </ol>
          <div className="policy-highlight">
            <p>
              <strong style={{color:'#d4a017'}}>Important:</strong> The unboxing video
              is mandatory and non-negotiable. Replacement requests submitted without
              video proof will not be considered regardless of the circumstances.
            </p>
          </div>
        </div>

        <div className="policy-section">
          <span className="policy-section__number">Section 05</span>
          <h2 className="policy-section__title">Replacement Process</h2>
          <p>Once your replacement request is reviewed and approved by our team:</p>
          <ul className="policy-list">
            <li>You will be notified of the approval via email or WhatsApp.</li>
            <li>
              The replacement product will be dispatched within{' '}
              <strong style={{color:'#d4a017'}}>one week (7 business days)</strong> of
              approval.
            </li>
            <li>
              The damaged product may need to be returned to us before the replacement
              is processed. Our team will guide you through this step if required.
            </li>
          </ul>
        </div>

        <div className="policy-section">
          <span className="policy-section__number">Section 06</span>
          <h2 className="policy-section__title">Condition of Returned Products</h2>
          <p>
            If a product return is required as part of the replacement process, the
            item must be returned in its <strong style={{color:'#d4a017'}}>original
            condition</strong> — unworn, unwashed, with all original tags and packaging
            intact.
          </p>
          <p>
            Resilda's Boutique reserves the right to <strong style={{color:'#d4a017'}}>
            reject a replacement request</strong> if the returned product is not
            received in its original condition.
          </p>
        </div>

        <div className="policy-section">
          <span className="policy-section__number">Section 07</span>
          <h2 className="policy-section__title">Items Not Eligible for Replacement</h2>
          <ul className="policy-list">
            <li>Products returned without prior approval from our team</li>
            <li>Damage reported after the 24-hour window</li>
            <li>Requests submitted without a valid unboxing or opening video</li>
            <li>Products that appear to have been used, altered, or washed</li>
          </ul>
        </div>

        <div className="policy-section">
          <span className="policy-section__number">Section 08</span>
          <h2 className="policy-section__title">Contact Us</h2>
          <p>
            For any return or replacement queries, please reach out to us promptly
            within the 24-hour window:
          </p>
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