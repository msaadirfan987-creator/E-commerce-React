import React, { useState, useEffect } from 'react';

const PromotionalBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

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
      subtitle: 'Explore our newly launched premium clothing and streetwear collections.',
      btnText: 'Explore Fashion',
      img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80'
    }
  ];

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
      <div className="max-w-7xl mx-auto h-[300px] sm:h-[350px] rounded-xl overflow-hidden relative group">
        
        {/* Banner runway */}
        <div 
          className="w-full h-full flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner) => (
            <div 
              key={banner.id}
              className="w-full h-full flex-shrink-0 relative flex items-center"
            >
              <img 
                src={banner.img} 
                alt={banner.title} 
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              <div className="absolute inset-0 bg-slate-950/70" />

              {/* Content overlay */}
              <div className="relative z-10 max-w-xl px-8 sm:px-16 text-white flex flex-col items-start gap-3">
                <span className="text-[9px] font-bold tracking-widest text-slate-300 uppercase">
                  {banner.tag}
                </span>
                
                <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                  {banner.title}
                </h2>
                
                <p className="text-[11px] sm:text-xs text-slate-300 font-medium max-w-md leading-relaxed">
                  {banner.subtitle}
                </p>

                <button 
                  className="mt-2 px-5 py-2 bg-white hover:bg-slate-100 text-slate-900 font-bold text-[10px] rounded-lg transition-all"
                  onClick={() => alert(`Exploring campaign: ${banner.tag}`)}
                >
                  {banner.btnText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>

        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6 6-6"/>
          </svg>
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 transition-all rounded-full ${
                currentSlide === index ? 'w-4 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default PromotionalBanner;