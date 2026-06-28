import React from 'react'
import Hero                from '../components/home/Hero'
import CategorySection     from '../components/home/CategorySection'
import NewArrivals         from '../components/home/NewArrivals'
import BestSellingCarousel from '../components/home/BestSellingCarousel'
import Testimonials        from '../components/home/Testimonials'
import ContactSection      from '../components/home/ContactSection'
import FindUs              from '../components/home/FindUs'

function Home() {
  return (
    <main className="page-content">
      <Hero />
      <CategorySection />
      <NewArrivals />
      <BestSellingCarousel />
      <Testimonials />
      <ContactSection />
      <FindUs />
    </main>
  )
}

export default Home
