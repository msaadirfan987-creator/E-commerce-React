import React from 'react';
import HeroSection from '../components/about/HeroSection';
import MissionSection from '../components/about/MissionSection';
import VisionSection from '../components/about/VisionSection';
import ValuesSection from '../components/about/ValuesSection';
import StatsSection from '../components/about/StatsSection';
import CTASection from '../components/about/CTASection';
import Footer from '../components/Footer';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white select-none">
      <HeroSection />
      <MissionSection />
      <VisionSection />
      <ValuesSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default AboutPage;
