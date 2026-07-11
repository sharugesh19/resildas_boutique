import '../styles/policy.css'

export default function PrivacyPolicy() {
  return (
    <div className="policy-page">

      <div className="policy-hero">
        <p className="policy-hero__tag">✦ Legal &amp; Support</p>
        <h1 className="policy-hero__title">Privacy <span>Policy</span></h1>
        <div className="policy-gold-line"></div>
        <p className="policy-hero__meta">Last updated: July 2025</p>
      </div>

      <div className="policy-body">

        <div className="policy-notice">
          At <strong>Resilda's Boutique</strong>, we respect your privacy and are
          committed to protecting the personal information you share with us. By using
          our website or placing an order with us, you agree to the practices described
          in this policy.
        </div>

        <div className="policy-section">
          <span className="policy-section__number">Section 01</span>
          <h2 className="policy-section__title">Information We Collect</h2>
          <p>
            When you browse our website or place an order, we may collect the
            following information:
          </p>
          <ul className="policy-list">
            <li><strong style={{color:'#fafafa'}}>Personal details:</strong> Your name, phone number, and email address</li>
            <li><strong style={{color:'#fafafa'}}>Delivery information:</strong> Your shipping address and pin code</li>
            <li><strong style={{color:'#fafafa'}}>Order details:</strong> Products purchased and transaction history</li>
            <li><strong style={{color:'#fafafa'}}>Usage data:</strong> How you interact with our website (pages visited, time spent, etc.)</li>
          </ul>
          <p>
            We collect only the information that is necessary to process and deliver
            your order.
          </p>
        </div>

        <div className="policy-section">
          <span className="policy-section__number">Section 02</span>
          <h2 className="policy-section__title">How We Use Your Information</h2>
          <p>The information we collect is used for the following purposes:</p>
          <ul className="policy-list">
            <li>Processing and confirming your orders</li>
            <li>Arranging delivery to your address</li>
            <li>Communicating order updates, dispatch notifications, and delivery status</li>
            <li>Responding to your queries and support requests</li>
            <li>Improving your experience on our website</li>
          </ul>
          <p>
            We do not use your personal information for unsolicited marketing without
            your consent.
          </p>
        </div>

        <div className="policy-section">
          <span className="policy-section__number">Section 03</span>
          <h2 className="policy-section__title">Sharing of Information</h2>
          <p>
            We value your trust. <strong style={{color:'#d4a017'}}>We do not sell,
            rent, or trade your personal information</strong> to any third parties.
          </p>
          <p>
            Your information may be shared with trusted partners only when strictly
            necessary:
          </p>
          <ul className="policy-list">
            <li>
              <strong style={{color:'#fafafa'}}>Courier and logistics partners</strong> — to arrange delivery of your order
            </li>
            <li>
              <strong style={{color:'#fafafa'}}>Payment processors</strong> — to securely complete your transaction
            </li>
          </ul>
          <p>
            These partners are required to handle your information securely and only
            for the stated purpose. They are not permitted to use your data for any
            other reason.
          </p>
        </div>

        <div className="policy-section">
          <span className="policy-section__number">Section 04</span>
          <h2 className="policy-section__title">Data Security</h2>
          <p>
            We take reasonable technical and organisational measures to protect your
            personal data from unauthorised access, misuse, or disclosure. Your data
            is stored securely and accessed only by authorised personnel.
          </p>
          <p>
            While we do our best to protect your information, please note that no
            method of online transmission is 100% secure. We encourage you to keep
            your account details confidential.
          </p>
        </div>

        <div className="policy-section">
          <span className="policy-section__number">Section 05</span>
          <h2 className="policy-section__title">Cookies</h2>
          <p>
            Our website may use cookies — small text files stored on your device — to:
          </p>
          <ul className="policy-list">
            <li>Remember your preferences and browsing session</li>
            <li>Understand how visitors use our website</li>
            <li>Improve the overall experience on our site</li>
          </ul>
          <p>
            You can choose to disable cookies through your browser settings. However,
            doing so may affect some features of the website.
          </p>
        </div>

        <div className="policy-section">
          <span className="policy-section__number">Section 06</span>
          <h2 className="policy-section__title">Retention of Data</h2>
          <p>
            We retain your personal information only for as long as necessary to
            fulfil your order and comply with applicable legal obligations. Once no
            longer required, your data is securely deleted.
          </p>
        </div>

        <div className="policy-section">
          <span className="policy-section__number">Section 07</span>
          <h2 className="policy-section__title">Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="policy-list">
            <li>Request access to the personal information we hold about you</li>
            <li>Request correction of any inaccurate information</li>
            <li>Request deletion of your data (subject to legal and business obligations)</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us using the details below.
          </p>
        </div>

        <div className="policy-section">
          <span className="policy-section__number">Section 08</span>
          <h2 className="policy-section__title">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be
            reflected on this page with a revised "Last updated" date. We encourage
            you to review this page periodically.
          </p>
        </div>

        <div className="policy-section">
          <span className="policy-section__number">Section 09</span>
          <h2 className="policy-section__title">Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or how
            your data is handled, please reach out:
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
                WhatsApp: <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noreferrer">
                  +91 XXXXXXXXXX
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