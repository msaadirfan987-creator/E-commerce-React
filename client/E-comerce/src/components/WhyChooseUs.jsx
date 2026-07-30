import React from 'react';

const WhyChooseUs = () => {
  // Color palette synchronized with your Cartify design scheme
  const theme = {
    deepTwilight: '#03045e',
    brightTealBlue: '#0077b6',
    turquoiseSurf: '#00b4d8',
    frostedBlue: '#90e0ef',
    lightCyan: '#caf0f8',
    surface: '#ffffff',
    cardBg: '#f8fafc'
  };

  // 6 Core trust pillars for Cartify (3 original + 3 new cards)
  const features = [
    {
      id: 1,
      title: 'Free & Fast Shipping',
      desc: 'Enjoy complimentary express shipping and real-time package tracking on all orders with zero minimum spend required.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 19-7-7 7-7"/>
          <path d="M19 12H5"/>
        </svg>
      )
    },
    {
      id: 4,
      title: '24/7 Dedicated Support',
      desc: 'Have a question or need order assistance? Our professional customer success care team is here to help you around the clock.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      )
    },
    {
      id: 5,
      title: '100% Authentic Products',
      desc: 'We source directly from official authorized global brands to guarantee maximum premium product quality and full warranty support.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      )
    },
    {
      id: 6,
      title: 'Exclusive Member Rewards',
      desc: 'Join the Cartify club to accumulate points on every purchase, unlock secret deals, and get early queue access to new product drops.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
    <section className="w-full py-16 bg-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* --- SECTION HEADING --- */}
        <div className="mb-12 border-b pb-4" style={{ borderColor: theme.frostedBlue }}>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: theme.deepTwilight }}>
            Why Choose Cartify
          </h2>
        </div>

        {/* --- 6-CARD FEATURES GRID --- */}
        {/* Fully responsive layout: 1 column on mobile, 2 columns on tablets, 3 columns on desktops */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item) => (
            <div
              key={item.id}
              className="group p-6 sm:p-8 rounded-2xl border transition-all duration-300 flex flex-col items-start gap-4 hover:shadow-xl hover:-translate-y-1"
              style={{ 
                backgroundColor: theme.cardBg, 
                borderColor: theme.frostedBlue 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.surface;
                e.currentTarget.querySelector('.icon-box').style.backgroundColor = theme.brightTealBlue;
                e.currentTarget.querySelector('.icon-box').style.color = theme.surface;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.cardBg;
                e.currentTarget.querySelector('.icon-box').style.backgroundColor = theme.lightCyan;
                e.currentTarget.querySelector('.icon-box').style.color = theme.brightTealBlue;
              }}
            >
              {/* Icon Container Frame */}
              <div 
                className="icon-box p-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-inner shrink-0"
                style={{ 
                  backgroundColor: theme.lightCyan, 
                  color: theme.brightTealBlue 
                }}
              >
                {item.icon}
              </div>

              {/* Description Content Block */}
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold tracking-wide transition-colors duration-200 group-hover:text-[#0077b6]" style={{ color: theme.deepTwilight }}>
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
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