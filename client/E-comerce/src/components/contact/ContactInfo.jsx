import React from 'react';

const ContactInfo = () => {
  const contactDetails = [
    {
      title: 'Email Us',
      value: 'support@cartify.com',
      sub: 'Replies within 24 hours',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2"/>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
        </svg>
      )
    },
    {
      title: 'Call Support',
      value: '+1 (555) 890-4321',
      sub: 'Toll-free customer line',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      )
    },
    {
      title: 'Office Headquarters',
      value: '100 Vercel Way, Suite 400',
      sub: 'San Francisco, CA 94107',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      )
    },
    {
      title: 'Working Hours',
      value: 'Mon - Fri: 9am - 6pm',
      sub: 'Sat: 10am - 4pm (PST)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      )
    }
  ];

  return (
    <section className="w-full bg-white select-none pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactDetails.map((item, idx) => (
            <div 
              key={idx} 
              className="p-5 rounded-lg border border-slate-200/60 bg-slate-50/20 flex items-start gap-4 transition-all hover:border-slate-350"
            >
              <div className="p-2 rounded-md bg-white border border-slate-150 text-slate-650 flex items-center justify-center shrink-0 shadow-2xs">
                {item.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wider">
                  {item.title}
                </h3>
                <p className="text-xs font-bold text-slate-900 leading-snug">
                  {item.value}
                </p>
                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                  {item.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
