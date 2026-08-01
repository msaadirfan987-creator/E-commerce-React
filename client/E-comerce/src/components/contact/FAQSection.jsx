import React, { useState } from 'react';

const FAQSection = () => {
  const faqs = [
    {
      q: 'How can I contact customer support?',
      a: 'You can reach us through this Contact form, email us directly at support@cartify.com, or use the real-time chat service from your account dashboard for priority assistance.'
    },
    {
      q: 'How long does delivery take for order packages?',
      a: 'Standard shipping takes between 2 to 5 business days depending on your location. Once a merchant posts your package, a shipping track link will be registered on your order dashboard.'
    },
    {
      q: 'How do I become a seller on the Cartify platform?',
      a: 'Register an account as a Seller under the Sign In page. Fill in your storefront description and catalog details. Once your application is reviewed and Approved by our administrator, you can list products.'
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleIndex = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-slate-50 select-none py-12 border-t border-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Frequently Asked Questions
          </h2>
          <p className="text-[11px] text-slate-400 font-bold">
            Quick answers to help you navigate registration, shopping, and merchant guidelines.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div 
                key={idx} 
                className="bg-white border border-slate-200/85 rounded-lg overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-xs text-slate-800 hover:text-slate-950 focus:outline-none cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-slate-400 font-medium text-sm">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                
                {isOpen && (
                  <div className="px-5 pb-4 text-[11px] text-slate-500 font-semibold leading-relaxed border-t border-slate-100/50 pt-3 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
