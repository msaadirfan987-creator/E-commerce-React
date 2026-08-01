import React from 'react';

const ValuesSection = () => {
  const chooseUsItems = [
    {
      title: 'Secure Shopping',
      desc: 'All communication and checkout endpoints are protected using robust security protocols.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      )
    },
    {
      title: 'Trusted Sellers',
      desc: 'Every seller profile is reviewed manually by an administrator before they are approved.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="m16 11 2 2 4-4"/>
        </svg>
      )
    },
    {
      title: 'Fast Delivery',
      desc: 'Sellers handle orders with local tracking services to deliver packages within 2-5 business days.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="2" y1="20" x2="22" y2="20"/>
          <line x1="12" y1="17" x2="12" y2="20"/>
        </svg>
      )
    },
    {
      title: 'Easy Returns',
      desc: 'Send items back within 30 days if you are not fully satisfied with your catalog purchase.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
        </svg>
      )
    },
    {
      title: 'Secure Payments (Coming Soon)',
      desc: 'We are integrating Stripe tokenization to accept local credit cards and wire services safely.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" ry="2"/>
          <line x1="2" y1="10" x2="22" y2="10"/>
        </svg>
      )
    },
    {
      title: '24/7 Customer Support',
      desc: 'Chat with us directly via the support inbox or email queries anytime for fast assistance.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      )
    }
  ];

  const valuesItems = [
    { title: 'Trust', desc: 'Acting with absolute integrity and verifying platform operations.' },
    { title: 'Innovation', desc: 'Enhancing catalog browsing and checkouts with software optimizations.' },
    { title: 'Quality', desc: 'Partnering with certified brands to ensure premium collections.' },
    { title: 'Customer Satisfaction', desc: 'Putting customer success care at the core of all systems.' },
    { title: 'Transparency', desc: 'Presenting honest seller ratings, reviews, and transaction details.' }
  ];

  return (
    <section className="w-full py-12 bg-white select-none space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Why Choose Cartify */}
        <div className="space-y-6">
          <div className="mb-6 border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              Why Choose Cartify
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chooseUsItems.map((item, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-lg border border-slate-200/60 bg-slate-50/30 flex items-start gap-4 transition-all hover:border-slate-350 hover:bg-slate-50/50"
              >
                <div className="p-2 rounded-md bg-white border border-slate-150 text-slate-650 flex items-center justify-center shrink-0 shadow-2xs">
                  {item.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-slate-850">
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

        {/* Our Values */}
        <div className="space-y-6">
          <div className="mb-6 border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              Our Values
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {valuesItems.map((item, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-lg border border-slate-150 bg-slate-50/10 flex flex-col justify-between space-y-2 transition-all hover:border-slate-300 hover:bg-white"
              >
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1">
                  {item.title}
                </h3>
                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ValuesSection;
