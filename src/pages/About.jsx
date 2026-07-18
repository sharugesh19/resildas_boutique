import { Helmet } from 'react-helmet-async'
import FadeInUp from '../components/common/FadeInUp'

function About() {
  return (
    <main className="page-content">
      <Helmet>
        <title>About Us — Resilda's Boutique</title>
        <meta name="description" content="Learn about Resilda's Boutique, a women's ethnic wear store in Udumalaipettai offering sarees, kurthi sets, and co-ord sets crafted for the modern Indian woman." />
        <link rel="canonical" href="https://resildas.com/about" />
      </Helmet>

      <FadeInUp delay={0}>
        <section className="home-intro">
          <div className="home-intro__inner">
            <span className="eyebrow">Our Story</span>
            <h1 className="home-intro__heading">About Resilda's Boutique</h1>
            <p className="home-intro__text">
              Resilda's Boutique is a women's ethnic wear store based in Udumalaipettai, Tamil Nadu.
              We started with a simple idea: bring premium, thoughtfully chosen ethnic wear to women
              who want quality without compromise. Every saree and set in our collection is picked
              with care, from organza and tussar silk sarees to soft silk, cotton, and fancy party
              wear sarees — along with unstitched kurtha materials, kurthi sets, and co-ord sets.
            </p>
            <p className="home-intro__text">
              We're exclusively focused on women's fashion, and every piece is curated for women who
              love both traditional and contemporary Indian styles. We also offer free delivery on
              every order, so premium ethnic wear is just a few clicks away, wherever you are.
            </p>
            <p className="home-intro__text">
              Visit us in person at our store in Aishwarya Nagar, Udumalaipettai — we're open
              Monday to Saturday, 9 AM to 8 PM. Whether you shop online or in-store, our goal is
              the same: help you find pieces that feel special.
            </p>
          </div>
        </section>
      </FadeInUp>
    </main>
  )
}

export default About