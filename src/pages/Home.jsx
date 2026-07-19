import { Link } from 'react-router-dom'
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
        <title>Resilda's Boutique — Cotton Sarees & Ethnic Wear</title>
        <meta name="description" content="Shop cotton sarees, organza sarees, kurthi sets, and co-ord sets online at Resilda's Boutique, Udumalaipettai. Premium ethnic wear with free delivery on every order." />
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