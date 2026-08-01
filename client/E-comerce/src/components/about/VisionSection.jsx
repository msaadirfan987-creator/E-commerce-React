import React from 'react';

const VisionSection = () => {
  return (
    <section className="w-full py-12 bg-slate-50 border-y border-slate-100 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-[9px] font-extrabold tracking-[0.25em] text-blue-600 uppercase">
            OUR VISION
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
            Shaping the Future of Multi-Vendor Commerce
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
            Our vision is to build a decentralized network of authentic global merchants, supported by smart automated fulfillment pipelines and secure, friction-free transactions. We strive to be the platform where quality meets convenience, promoting sustainable commerce and seller transparency on a global scale.
          </p>
          <div className="pt-2 flex justify-center gap-6 text-[10px] font-bold text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Global Reach
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Frictionless Experience
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Sustainable Operations
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
