import React, { useState, useEffect } from 'react';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      tagline: 'LIFESTYLE & TRENDS',
      title: (
        <>
          Shop Curated <br /> Seasonal Essentials
        </>
      ),
      desc: 'Discover minimal designs, high-end apparel, and quality items crafted to match your everyday lifestyle.',
      btnText: 'Shop the Collection',
      img: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1600&auto=format&fit=crop'
    },
    {
      id: 2,
      tagline: 'PREMIUM ELECTRONICS',
      title: (
        <>
          Next-Generation <br /> Audio & Accessories
        </>
      ),
      desc: 'High-fidelity acoustics, smart wearables, and ergonomic workspaces designed for optimal performance.',
      btnText: 'Explore Tech',
      img: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?q=80&w=1600&auto=format&fit=crop'
    },
    {
      id: 3,
      tagline: 'HOME ARCHITECTURE',
      title: (
        <>
          Elevate Spaces <br /> With Modern Decor
        </>
      ),
      desc: 'Contemporary ceramics, high-density comfort lounge seating, and geometric home upgrades.',
      btnText: 'Browse Living',
      img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1600&auto=format&fit=crop'
    }
  ];

  useEffect(() => {
    const autoTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(autoTimer);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative w-full min-h-[60vh] sm:min-h-[70vh] overflow-hidden bg-slate-50 select-none">
      
      {/* Slider Runway */}
      <div 
        className="w-full h-full flex transition-transform duration-700 ease-in-out min-h-[60vh] sm:min-h-[70vh]"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full h-full flex-shrink-0 flex flex-col md:flex-row items-stretch min-h-[60vh] sm:min-h-[70vh]">
            
            {/* Content Column */}
            <div className="w-full md:w-1/2 flex items-center bg-white py-12 md:py-0">
              <div className="container mx-auto px-6 sm:px-12 lg:px-20 flex flex-col justify-center items-start space-y-4 max-w-xl md:max-w-none">
                
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  {slide.tagline}
                </span>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                  {slide.title}
                </h1>
                
                <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed max-w-md">
                  {slide.desc}
                </p>
                
                <div className="pt-2">
                  <button 
                    className="px-6 py-2.5 text-white font-bold text-xs bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all"
                    onClick={() => alert(`Redirecting to collection ${slide.id}`)}
                  >
                    {slide.btnText}
                  </button>
                </div>
              </div>
            </div>

            {/* Graphics Panel */}
            <div 
              className="w-full md:w-1/2 h-[30vh] md:h-auto bg-cover bg-center relative" 
              style={{ backgroundImage: `url('${slide.img}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-white via-transparent to-transparent z-10" />
            </div>

          </div>
        ))}
      </div>

      {/* Manual Arrow Buttons */}
      <button 
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-slate-700 border border-slate-100 hover:bg-white transition-all z-20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      <button 
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-slate-700 border border-slate-100 hover:bg-white transition-all z-20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6 6-6"/>
        </svg>
      </button>

      {/* Bottom pagination track */}
      <div className="absolute bottom-4 left-1/2 md:left-[25%] -translate-x-1/2 flex items-center gap-1.5 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1 transition-all rounded-full ${
              currentSlide === idx ? 'w-4 bg-slate-800' : 'w-1 bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>

    </section>
  );
};

export default HeroSection;