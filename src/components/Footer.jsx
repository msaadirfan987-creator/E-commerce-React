import React, { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');

  // Color palette synchronized perfectly with your Cartify design scheme
  const theme = {
    deepTwilight: '#03045e',
    brightTealBlue: '#0077b6',
    turquoiseSurf: '#00b4d8',
    frostedBlue: '#90e0ef',
    lightCyan: '#caf0f8',
    surface: '#ffffff',
    footerBg: '#02032e' // Custom extra-dark twilight variant for deep footer separation contrast
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing with: ${email}`);
      setEmail('');
    }
  };

  return (
    <footer className="w-full text-white pt-16 pb-8 select-none" style={{ backgroundColor: theme.footerBg }}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- MAIN LINKS & NEWSLETTER GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 border-b pb-12" style={{ borderColor: 'rgba(144, 224, 239, 0.15)' }}>
          
          {/* Column 1: Brand Identifier Statement */}
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-black tracking-wider uppercase" style={{ color: theme.lightCyan }}>
              Cartify
            </h3>
            <p className="text-sm text-slate-300 font-medium leading-relaxed max-w-xs">
              Transforming your digital shopping experience with ultra-fast deliveries, premium verified product collections, and unparalleled customer security layers.
            </p>
            
            {/* Social Icons Row */}
            <div className="flex items-center gap-4 mt-2">
              {['Facebook', 'Instagram', 'Twitter', 'LinkedIn'].map((platform, idx) => (
                <button 
                  key={idx} 
                  className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                  title={platform}
                >
                  <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                    {platform[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links (Matches your updated Navbar profile links) */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold tracking-widest uppercase border-l-2 pl-3" style={{ borderColor: theme.turquoiseSurf, color: theme.lightCyan }}>
              Navigation
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm font-medium text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Products</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Our Story / About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policy Framework */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold tracking-widest uppercase border-l-2 pl-3" style={{ borderColor: theme.turquoiseSurf, color: theme.lightCyan }}>
              Customer Support
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm font-medium text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">Help Center / FAQs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Track Your Order</a></li>
              <li><a href="#" className="hover:text-white transition-colors">30-Day Returns Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter Box Section (Fulfilling structure point 10) */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold tracking-widest uppercase border-l-2 pl-3" style={{ borderColor: theme.turquoiseSurf, color: theme.lightCyan }}>
              Stay Updated
            </h4>
            <p className="text-sm text-slate-300 font-medium leading-relaxed">
              Subscribe to the Cartify newsletter loop to unlock early item drops and secret flash sale discount event pipelines.
            </p>
            <form onSubmit={handleSubscribe} className="w-full flex flex-col sm:flex-row gap-2 mt-1">
              <input 
                type="email" 
                required
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 text-sm font-medium rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 bg-slate-50 transition-all"
                style={{ '--tw-ring-color': theme.turquoiseSurf }}
              />
              <button 
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase shrink-0 shadow-md transition-all duration-200 active:scale-95"
                style={{ backgroundColor: theme.brightTealBlue, color: theme.surface }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.turquoiseSurf}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.brightTealBlue}
              >
                Join
              </button>
            </form>
          </div>

        </div>

        {/* --- LOWER ROW: COPYRIGHT & TRUST FOOTNOTE --- */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs font-semibold text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Cartify Inc. All rights reserved globally.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Privacy Shield</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Accessibility Compliance</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Cookie Configurations</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;