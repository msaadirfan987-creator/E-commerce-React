import React from 'react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="w-full py-16 bg-white select-none border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-50 rounded-2xl p-8 sm:p-12 text-center space-y-6 max-w-4xl mx-auto border border-slate-100 shadow-3xs">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Start Shopping Today
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium max-w-md mx-auto leading-relaxed">
              Explore thousands of curated items from independent merchants worldwide. Enjoy free express shipping and a secure shopping experience.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-block px-7 py-3 text-white font-bold text-xs bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
