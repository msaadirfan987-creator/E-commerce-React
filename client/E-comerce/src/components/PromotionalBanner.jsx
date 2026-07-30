import React, { useState, useEffect } from 'react';

const PromotionalBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Synced with your Cartify brand palette
  const theme = {
    deepTwilight: '#03045e',
    brightTealBlue: '#0077b6',
    turquoiseSurf: '#00b4d8',
    surface: '#ffffff',
  };

  // Two sliding banners with high-quality retail/tech online background images
  const banners = [
    {
      id: 1,
      tag: 'SUMMER SUPER SALE',
      title: 'Upgrade Your Tech Lifestyle',
      subtitle: 'Get up to 50% OFF on premium electronics, gaming gear, and elite accessories.',
      btnText: 'Shop Tech Now',
      img: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1600&auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      tag: 'NEW ARRIVALS',
      title: 'Redefine Your Daily Style',
      subtitle: 'Explore our newly launched premium clothing and streetwear collections with free shipping tracking.',
      btnText: 'Explore Fashion',
      img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80'
    }
  ];

  // Auto-play interval: Switches slide every 5 seconds automatically
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="w-full py-8 bg-white select-none relative px-4 sm:px-6">
      <div className="max-w-7xl mx-auto h-[350px] sm:h-[400px] md:h-[450px] rounded-3xl overflow-hidden relative shadow-lg group">
        
        {/* --- BANNER SLIDES WRAPPER --- */}
        <div 
          className="w-full h-full flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner) => (
            <div 
              key={banner.id}
              className="w-full h-full flex-shrink-0 relative flex items-center"
            >
              {/* Online Background Image */}
              <img 
                src={banner.img} 
                alt={banner.title} 
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Premium Dark Glassmorphic/Gradient Overlay for Content Contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent md:bg-gradient-to-r md:from-black/70 md:via-black/40 md:to-transparent" />

              {/* --- UPPER SIDE CONTENT TEXT --- */}
              <div className="relative z-10 max-w-xl px-8 sm:px-16 text-white flex flex-col items-start gap-3 sm:gap-4">
                <span 
                  className="text-xs sm:text-sm font-black tracking-widest uppercase px-3 py-1 rounded-full text-white"
                  style={{ backgroundColor: theme.turquoiseSurf }}
                >
                  {banner.tag}
                </span>
                
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                  {banner.title}
                </h2>
                
                <p className="text-xs sm:text-base text-slate-200 font-medium line-clamp-2 sm:line-clamp-none max-w-md">
                  {banner.subtitle}
                </p>

                <button 
                  className="mt-2 px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold tracking-wider uppercase rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95"
                  style={{ backgroundColor: theme.brightTealBlue, color: theme.surface }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.deepTwilight}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.brightTealBlue}
                  onClick={() => alert(`Navigating to promotion collection: ${banner.tag}`)}
                >
                  {banner.btnText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- NAVIGATION ARROWS --- */}
        {/* Left Arrow */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/10 hover:bg-white hover:text-black transition-all duration-200 opacity-0 group-hover:opacity-100 z-20 hidden sm:block shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>

        {/* Right Arrow */}
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/10 hover:bg-white hover:text-black transition-all duration-200 opacity-0 group-hover:opacity-100 z-20 hidden sm:block shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>

        {/* --- BOTTOM DOT INDICATORS --- */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 transition-all duration-300 rounded-full ${
                currentSlide === index ? 'w-6 bg-white shadow-sm' : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default PromotionalBanner;