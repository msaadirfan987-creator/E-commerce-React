import React from 'react';

const ContactHero = () => {
  return (
    <section className="relative w-full bg-slate-50 select-none border-b border-slate-100 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            GET IN TOUCH
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Contact Us
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-md mx-auto leading-relaxed">
            We're always here to help. Reach out to our customer support or merchant teams anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
