import React from 'react'
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import PromotionalBanner from '../components/PromotionalBanner';
import WhyChooseUs from '../components/WhyChooseUs';
import Footer from '../components/Footer';
function home() {
  return (
    <div>
      <>
    
      <HeroSection />
     <Categories />
     <FeaturedProducts />
     <PromotionalBanner />
     <WhyChooseUs />
     <Footer />
    </>
    </div>
  )
}

export default home
