import React from 'react';

const MissionSection = () => {
  const missionItems = [
    {
      title: 'Make Online Shopping Easy',
      desc: 'Streamlining discovery and checkouts so anyone can buy items in seconds.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
        </svg>
      )
    },
    {
      title: 'Help Small Businesses Grow',
      desc: 'Empowering local and independent merchants to set up storefronts and reach customers worldwide.',
      icon: (
        <svg xmlns="http://www.w3.org/255" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      )
    },
    {
      title: 'Provide Secure & Fast Shopping',
      desc: 'Protecting user data with 256-bit encryption and hosting fast server pipelines.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      )
    },
    {
      title: 'Deliver Quality Products',
      desc: 'Auditing sellers to guarantee authentic catalogs, honest descriptions, and warranty details.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      )
    }
  ];

  return (
    <section className="w-full py-12 bg-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Who We Are: Left Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold tracking-tight text-slate-900">
                Who We Are
              </h2>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
              Cartify is a modern multi-vendor e-commerce marketplace connecting buyers and sellers through a secure, transparent, and user-friendly platform. 
            </p>
            <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
              We eliminate technical barriers for small-to-medium businesses, allowing them to showcase their premium products while providing buyers with a fast and direct checkout flow.
            </p>
          </div>

          {/* Our Mission: Right Panel */}
          <div className="lg:col-span-7 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold tracking-tight text-slate-900">
                Our Mission
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {missionItems.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-lg border border-slate-200/50 bg-slate-50/20 flex flex-col gap-2.5 transition-all hover:border-slate-350"
                >
                  <div className="w-8 h-8 rounded bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-slate-800">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MissionSection;
