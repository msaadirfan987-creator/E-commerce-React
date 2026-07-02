import React, { useState, useEffect } from 'react';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const theme = {
    deepTwilight: '#03045e',
    brightTealBlue: '#0077b6',
    turquoiseSurf: '#00b4d8',
    surface: '#ffffff',
  };

  // Multiple sliding data objects for the Hero carousel loop
  const slides = [
    {
      id: 1,
      breadcrumb: { main: 'Home', center: 'Centers', local: 'Sociality' },
      title: (
        <>
          Shop The Best <br /> Trends With <span className="text-[#0077b6]">Cartify</span>
        </>
      ),
      desc: 'Expiry this Best fyor yons, wh he way biir for while your Cesure your Cartify!',
      btnText: 'Shop Collection Now',
      img: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1600&auto=format&fit=crop'
    },
    {
      id: 2,
      breadcrumb: { main: 'Home', center: 'Gadgets', local: 'Premium' },
      title: (
        <>
          Next-Gen Tech <br /> Curated For <span className="text-[#0077b6]">You</span>
        </>
      ),
      desc: 'Discover cutting-edge electronics, smart accessories, and high-performance setups with premium warranties.',
      btnText: 'Explore Tech',
      img: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?q=80&w=1600&auto=format&fit=crop'
    },
    {
      id: 3,
      breadcrumb: { main: 'Home', center: 'Lifestyle', local: 'Minimalist' },
      title: (
        <>
          Elevate Spaces <br /> With Modern <span className="text-[#0077b6]">Decor</span>
        </>
      ),
      desc: 'Explore minimal lighting layouts, comfortable upholstery furniture choices, and architectural home pieces.',
      btnText: 'Browse Living',
      img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1600&auto=format&fit=crop'
    }
  ];

  // Auto-slide effect to cycle every 6 seconds automatically
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
    <section className="relative w-full min-h-[75vh] sm:min-h-[80vh] overflow-hidden bg-white select-none">
      
      {/* --- SLIDER MAIN RUNWAY TRACK --- */}
      <div 
        className="w-full h-full flex transition-transform duration-700 ease-in-out min-h-[75vh] sm:min-h-[80vh]"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full h-full flex-shrink-0 flex flex-col md:flex-row items-stretch min-h-[75vh] sm:min-h-[80vh]">
            
            {/* Left Content Column */}
            <div className="w-full md:w-1/2 flex items-center bg-gradient-to-r from-sky-50/60 to-white relative z-10 py-12 md:py-0">
              <div className="container mx-auto px-6 sm:px-12 lg:px-20 flex flex-col justify-center items-start space-y-5 max-w-xl md:max-w-none">
                
                {/* Breadcrumb Navigation Line */}
                <div className="flex items-center gap-1 text-xs font-bold tracking-wide text-slate-400">
                  <span className="text-[#0077b6] hover:underline cursor-pointer">{slide.breadcrumb.main}</span>
                  <span>•</span>
                  <span className="text-slate-500">{slide.breadcrumb.center}</span>
                  <span>•</span>
                  <span className="text-slate-400 font-medium">{slide.breadcrumb.local}</span>
                </div>
                
                {/* Dynamic Sliding Title Block */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#03045e] leading-[1.1]">
                  {slide.title}
                </h1>
                
                {/* Slider Description Text */}
                <p className="text-slate-600 text-sm sm:text-base font-semibold leading-relaxed max-w-md">
                  {slide.desc}
                </p>
                
                {/* Primary Button Trigger */}
                <div className="pt-3">
                  <button 
                    className="px-8 py-3.5 text-white font-extrabold text-sm tracking-wide rounded-xl shadow-md shadow-blue-100 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 bg-[#0077b6] hover:bg-[#03045e]"
                    onClick={() => alert(`Exploring Collection: ${slide.id}`)}
                  >
                    {slide.btnText}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Graphics Panel Frame */}
            <div 
              className="w-full md:w-1/2 h-[35vh] md:h-auto bg-cover bg-center relative transition-all duration-500" 
              style={{ backgroundImage: `url('${slide.img}')` }}
            >
              {/* Overlay shading matching layout profiles exactly */}
              <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-white via-transparent to-transparent z-10" />
              <div className="absolute inset-0 bg-sky-900/5 mix-blend-multiply" />
            </div>

          </div>
        ))}
      </div>

      {/* =========================================================================
          SLIDER CONTROLS & PAGINATION TRIGGERS (Positioned exactly as in image_8e8cc6.jpg)
          ========================================================================= */}
      
      {/* Manual Left Toggle Button */}
      <button 
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-700 shadow-md border border-slate-100 hover:bg-white hover:text-black transition-all z-20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      {/* Manual Right Toggle Button */}
      <button 
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-700 shadow-md border border-slate-100 hover:bg-white hover:text-black transition-all z-20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6 6-6"/>
        </svg>
      </button>

      {/* Bottom Center Indicator Dots Track */}
      <div className="absolute bottom-6 left-1/2 md:left-[25%] -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 transition-all duration-300 rounded-full ${
              currentSlide === idx ? 'w-6 bg-[#0077b6]' : 'w-2 bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>

    </section>
  );
};

export default HeroSection;