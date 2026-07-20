import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Hero                from '../components/home/Hero'
import CategorySection     from '../components/home/CategorySection'
import NewArrivals         from '../components/home/NewArrivals'
import BestSellingCarousel from '../components/home/BestSellingCarousel'
import Testimonials        from '../components/home/Testimonials'
import ContactSection      from '../components/home/ContactSection'
import FindUs              from '../components/home/FindUs'
import WhyShopWithUs       from '../components/home/WhyShopWithUs'
import FAQ                 from '../components/home/FAQ'
import FadeInUp            from '../components/common/FadeInUp'

function Home() {
  return (
    <main className="page-content">
      <Helmet>
        <title>Resilda's Boutique — Best Cotton Sarees & Kurthi Sets Online</title>
        <meta name="description" content="Shop cotton sarees, organza sarees, kurthi sets & co-ord sets online at Resilda's Boutique, Udumalaipettai. Premium ethnic wear, free delivery." />
        <meta name="keywords" content="cotton sarees online, kurthi sets, ethnic wear, boutique Udumalaipettai, organza saree, tussar saree, co-ord sets women" />
        <link rel="canonical" href="https://resildas.com/" />

        {/* Open Graph */}
        <meta property="og:title" content="Resilda's Boutique — Cotton Sarees, Kurthi Sets & Ethnic Wear" />
        <meta property="og:description" content="Shop cotton sarees, organza sarees, kurthi sets, and co-ord sets online. Free delivery on every order." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://resildas.com/" />

        {/* Local Business JSON-LD */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "ClothingStore",
            "name": "Resilda's Boutique",
            "description": "Premium ethnic wear for the modern Indian woman. Sarees, kurthi sets, co-ord sets and more.",
            "url": "https://resildas.com",
            "logo": "https://resildas.com/assets/logo.webp",
            "image": "https://resildas.com/assets/og-cover.jpg",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "1st Floor, 11, 2nd Street, near UK hospital, Aishwarya Nagar",
              "addressLocality": "Udumalaipettai",
              "addressRegion": "Tamil Nadu",
              "postalCode": "642154",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "10.5833",
              "longitude": "77.2500"
            },
            "telephone": "+918300527985",
            "openingHours": ["Mo-Sa 10:00-19:00", "Su 11:00-17:00"],
            "priceRange": "₹₹"
          }
        `}</script>

        {/* FAQ Schema */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What fabrics do you use for your sarees?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We work with a range of fabrics including pure cotton, tissue organza, tussar silk, and soft silk — each chosen for comfort, drape, and durability."
                }
              },
              {
                "@type": "Question",
                "name": "Do you offer free shipping?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, we offer free delivery on every order. We currently ship across India, with delivery typically taking 1 to 3 business days after dispatch."
                }
              },
              {
                "@type": "Question",
                "name": "Can I cancel my order after placing it?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Orders cannot be cancelled once placed, as we begin processing immediately to ensure same-day dispatch."
                }
              },
              {
                "@type": "Question",
                "name": "What is your return and replacement policy?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We accept replacement requests only in the case of a damaged product, reported within 24 hours of delivery with a valid unboxing video as proof."
                }
              },
              {
                "@type": "Question",
                "name": "How do I know which size to choose for kurthi sets?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Each kurthi set listing includes a size chart with measurements. You can also contact us directly for sizing help."
                }
              },
              {
                "@type": "Question",
                "name": "How should I care for cotton and silk sarees?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Cotton sarees are best hand-washed or gently machine-washed in cold water and air-dried in shade. Silk and organza sarees should be dry-cleaned."
                }
              }
            ]
          }
        `}</script>
      </Helmet>
      <Hero />



      {/* Each section fades in as it scrolls into view.
          Delays are staggered so they don't all fire at once. */}
      <FadeInUp delay={0}>
        <NewArrivals />
      </FadeInUp>

      <FadeInUp delay={0}>
        <CategorySection />
      </FadeInUp>

      <FadeInUp delay={0}>
        <WhyShopWithUs />
      </FadeInUp>

      <FadeInUp delay={0}>
        <BestSellingCarousel />
      </FadeInUp>

      <FadeInUp delay={0}>
        <Testimonials />
      </FadeInUp>

      <FadeInUp delay={0}>
        <ContactSection />
      </FadeInUp>

      <FadeInUp delay={0}>
        <FindUs />
      </FadeInUp>

      <FadeInUp delay={0}>
        <FAQ />
      </FadeInUp>
    </main>
  )
}

export default Home