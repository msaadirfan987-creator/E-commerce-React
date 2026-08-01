import React from 'react';
import ContactHero from '../components/contact/ContactHero';
import ContactInfo from '../components/contact/ContactInfo';
import ContactForm from '../components/contact/ContactForm';
import FAQSection from '../components/contact/FAQSection';
import SocialLinks from '../components/contact/SocialLinks';
import MapSection from '../components/contact/MapSection';
import Footer from '../components/Footer';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white select-none">
      <ContactHero />
      <ContactInfo />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-12">
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
        <div className="lg:col-span-5 space-y-6 pt-8 px-4 sm:px-6 lg:px-0">
          <MapSection />
          <SocialLinks />
        </div>
      </div>
      <FAQSection />
      <Footer />
    </div>
  );
};

export default ContactPage;
