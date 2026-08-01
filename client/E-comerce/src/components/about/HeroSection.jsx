import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative w-full bg-slate-50 select-none overflow-hidden border-b border-slate-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch min-h-[40vh] sm:min-h-[45vh]">
        {/* Content Column */}
        <div className="w-full md:w-1/2 flex items-center bg-white py-12 md:py-0">
          <div className="px-6 sm:px-12 lg:px-20 flex flex-col justify-center items-start space-y-4 max-w-xl md:max-w-none">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              ABOUT US
            </span>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Our Story
            </h1>
            
            <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed max-w-md">
              Cartify began with a simple idea: to build a beautiful, secure, and user-friendly multi-vendor marketplace that connects buyers with passionate merchants. We believe online commerce should be transparent, fast, and accessible to everyone.
            </p>
          </div>
        </div>

        {/* Graphics Panel */}
        <div 
          className="w-full md:w-1/2 h-[25vh] md:h-auto bg-cover bg-center relative" 
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-white via-transparent to-transparent z-10" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
