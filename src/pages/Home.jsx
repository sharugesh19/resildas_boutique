import { Helmet } from 'react-helmet-async'
import Hero                from '../components/home/Hero'
import CategorySection     from '../components/home/CategorySection'
import NewArrivals         from '../components/home/NewArrivals'
import BestSellingCarousel from '../components/home/BestSellingCarousel'
import Testimonials        from '../components/home/Testimonials'
import ContactSection      from '../components/home/ContactSection'
import FindUs              from '../components/home/FindUs'
import FadeInUp            from '../components/common/FadeInUp'

function Home() {
  return (
    <main className="page-content">
      <Helmet>
        <title>Resilda's Boutique — Premium Ethnic Wear in Udumalaipettai</title>
        <meta name="description" content="Shop premium sarees, kurthi sets, co-ord sets and ethnic wear online at Resilda's Boutique, Udumalaipettai. Free delivery on every order." />
        <meta name="keywords" content="sarees online, kurthi sets, ethnic wear, boutique Udumalaipettai, organza saree, tussar saree, co-ord sets women" />
        <link rel="canonical" href="https://resildas.com/" />

        {/* Open Graph */}
        <meta property="og:title" content="Resilda's Boutique — Premium Ethnic Wear" />
        <meta property="og:description" content="Shop premium sarees, kurthi sets, co-ord sets and ethnic wear online. Free delivery on every order." />
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
            "openingHours": "Mo-Sa 09:00-20:00",
            "priceRange": "₹₹"
          }
        `}</script>
      </Helmet>
      <section style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
    <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#555' }}>
      Resilda's Boutique is a women's ethnic wear store based in Udumalaipettai, offering a wide range of
      sarees and sets including organza sarees, tussar silk sarees, soft silk sarees, cotton sarees, and
      fancy party wear sarees. We also stock unstitched kurtha materials, kurthi sets, and co-ord sets —
      all exclusively curated for women who love traditional and contemporary Indian fashion. Every order
      comes with free delivery, making it easy to shop premium ethnic wear from the comfort of your home.
    </p>
  </section>
      {/* Hero has its own entrance — no FadeInUp wrapper needed */}
      <Hero />

      {/* Each section fades in as it scrolls into view.
          Delays are staggered so they don't all fire at once. */}
      <FadeInUp delay={0}>
        <NewArrivals />
      </FadeInUp>

      <FadeInUp delay={0.05}>
        <CategorySection />
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
    </main>
  )
}

export default Home