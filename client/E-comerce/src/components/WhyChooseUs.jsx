import React from 'react';

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      title: 'Free & Fast Shipping',
      desc: 'Enjoy complimentary express shipping and real-time package tracking on all orders with zero minimum spend required.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 18H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v10"/>
          <path d="M14 22a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
          <path d="M20 22a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
          <path d="M20 18H16"/>
          <path d="M14 14h6"/>
          <path d="m14 4 6 6"/>
        </svg>
      )
    },
    {
      id: 2,
      title: 'Secure Payments',
      desc: 'Your financial security is our absolute priority. Shop safely using industry-standard 256-bit encrypted checkout systems.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      )
    },
    {
      id: 3,
      title: 'Easy 30-Day Returns',
      desc: 'Not entirely satisfied with your premium purchase? Send it back stress-free with our automated return processing setup.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 19-7-7 7-7"/>
          <path d="M19 12H5"/>
        </svg>
      )
    },
    {
      id: 4,
      title: '24/7 Support',
      desc: 'Have a question or need order assistance? Our professional customer success care team is here to help you around the clock.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      )
    },
    {
      id: 5,
      title: '100% Authentic Products',
      desc: 'We source directly from official authorized global brands to guarantee maximum premium product quality and full warranty support.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      )
    },
    {
      id: 6,
      title: 'Exclusive Rewards',
      desc: 'Join the Cartify club to accumulate points on every purchase, unlock secret deals, and get early queue access to new product drops.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
          <path d="M4 22h16"/>
          <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"/>
          <path d="M12 2a4 4 0 0 1 4 4v8H8V6a4 4 0 0 1 4-4Z"/>
        </svg>
      )
    }
  ];

  return (
    <section className="w-full py-12 bg-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="mb-8 border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Why Choose Cartify
          </h2>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-lg border border-slate-200/60 bg-slate-50/30 flex items-start gap-4 transition-all hover:border-slate-300"
            >
              {/* Icon Container */}
              <div className="p-2 rounded-md bg-white border border-slate-150 text-slate-600 flex items-center justify-center shrink-0">
                {item.icon}
              </div>

              {/* Description Content */}
              <div className="space-y-1.5">
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
    </section>
  );
};

export default WhyChooseUs;