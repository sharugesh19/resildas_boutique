import { useState } from 'react'

const faqs = [
  {
    q: 'What fabrics do you use for your sarees?',
    a: 'We work with a range of fabrics including pure cotton, tissue organza, tussar silk, and soft silk — each chosen for comfort, drape, and durability. Our cotton sarees are ideal for daily wear, while organza and silk sarees suit festive and special occasions.',
  },
  {
    q: 'Do you offer free shipping?',
    a: 'Yes, we offer free delivery on every order. We currently ship across India, with delivery typically taking 1 to 3 business days after dispatch.',
  },
  {
    q: 'Can I cancel my order after placing it?',
    a: 'Orders cannot be cancelled once placed, as we begin processing immediately to ensure same-day dispatch. Please review your order carefully before completing your purchase.',
  },
  {
    q: 'What is your return and replacement policy?',
    a: 'We accept replacement requests only in the case of a damaged product. Damage must be reported within 24 hours of delivery, along with a valid unboxing video as proof. Approved replacements are dispatched within 7 business days. We do not offer refunds after delivery.',
  },
  {
    q: 'How do I know which size to choose for kurthi sets?',
    a: 'Each kurthi set listing includes a size chart with measurements. If you\'re unsure, you can reach out to us directly and we\'ll help you pick the right fit before you order.',
  },
  {
    q: 'How should I care for cotton and silk sarees?',
    a: 'Cotton sarees are best hand-washed or gently machine-washed in cold water and air-dried in shade. Silk and organza sarees should be dry-cleaned to preserve their texture, color, and zari work.',
  },
]

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
    <section className="faq-section" id="faq">
      <div className="faq-section__head">
        <span className="eyebrow">Questions</span>
        <h2 className="section-title">Frequently Asked Questions</h2>
      </div>

      <div className="faq-list container">
        {faqs.map((item, i) => (
          <div key={i} className="faq-item">
            <button
              className="faq-item__question"
              onClick={() => toggle(i)}
              aria-expanded={openIndex === i}
            >
              {item.q}
              <span className="faq-item__icon">{openIndex === i ? '−' : '+'}</span>
            </button>
            {openIndex === i && (
              <p className="faq-item__answer">{item.a}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default FAQ