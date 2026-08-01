import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Subscribed: ${email}`);
      setEmail('');
    }
  };

  return (
    <footer className="w-full text-slate-400 bg-slate-900 pt-12 pb-6 select-none border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border-b border-slate-800 pb-8 text-xs font-semibold">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white tracking-widest uppercase">
              CARTIFY
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs">
              Providing premium ecommerce catalog spaces and secure checkout flows globally.
            </p>
            
            {/* Socials */}
            <div className="flex items-center gap-2 pt-2">
              {['Facebook', 'Instagram', 'Twitter'].map((platform, idx) => (
                <button 
                  key={idx} 
                  className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 hover:bg-slate-700/60 transition-all"
                  title={platform}
                >
                  {platform[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-white tracking-widest uppercase">
              Navigation
            </h4>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Products</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-white tracking-widest uppercase">
              Customer Support
            </h4>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Track Your Order</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-white tracking-widest uppercase">
              Stay Updated
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Subscribe to unlock product announcements and seasonal collections.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 pt-1 max-w-xs">
              <input 
                type="email" 
                required
                placeholder="Your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded bg-slate-800 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 transition-all"
              />
              <button 
                type="submit"
                className="px-3 py-1.5 rounded bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold transition-all shrink-0"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        {/* Lower Row */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-[10px] font-medium text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Cartify Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Shield</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Accessibility</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Cookie Settings</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;