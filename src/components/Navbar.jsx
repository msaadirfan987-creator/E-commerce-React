import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // Imported Link component
import logo from '../assets/logo.png';
import CartComponent from './CartComponent'; // Import the CartComponent

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // 🔥 Profile box ke liye new states aur ref add kiye hain
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Brand Palette Configuration
  const theme = {
    deepTwilight: '#03045e',
    brightTealBlue: '#0077b6',
    turquoiseSurf: '#00b4d8',
    frostedBlue: '#90e0ef',
    lightCyan: '#caf0f8',
    surface: '#ffffff',
  };

  // 🔥 Outside Click Handler: Box ke bahar click karne par dropdown khud band ho jaye
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full sticky top-0 z-50 shadow-sm bg-white select-none">
      
      {/* --- 1. TOP UTILITY BAR --- */}
      <div 
        style={{ backgroundColor: theme.lightCyan }} 
        className="w-full px-4 sm:px-6 py-2 flex items-center justify-between text-xs font-semibold"
      >
        <div className="flex items-center gap-2" style={{ color: theme.deepTwilight }}>
          <span className="flex h-2 w-2 rounded-full bg-[#0077b6]" />
          Free & 100% Secure Checkout Panel Provided
        </div>
        <div className="flex items-center gap-4">
          <button className="hover:underline transition-all" style={{ color: theme.brightTealBlue }}>Follow orders</button>
          <span className="text-slate-300">|</span>
          <Link to="/auth" className="hover:underline transition-all" style={{ color: theme.deepTwilight }}>
            Sign In
          </Link>
        </div>
      </div>

      {/* --- 2. SINGLE CONSOLIDATED NAVIGATION LAYER --- */}
      <div 
        style={{ borderBottom: `1px solid ${theme.lightCyan}` }} 
        className="w-full px-4 sm:px-6 py-4 flex items-center justify-between gap-6"
      >
        {/* LEFT: Brand Logo */}
        <div className="shrink-0 flex items-center">
          <img 
            src={logo} 
            alt="Cartify Logo" 
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </div>

        {/* CENTER LEFT: Direct Navlinks with React Router Link */}
        <div className="hidden lg:flex items-center gap-6 shrink-0">
          <Link to="/" style={{ color: theme.deepTwilight }} className="font-bold text-sm tracking-wide">
            Home
          </Link>
          
          <Link to="/shop" style={{ color: theme.brightTealBlue }} className="font-semibold text-sm tracking-wide hover:text-[var(--bright-teal-blue)] transition-colors duration-200">
            Products
          </Link>

          <Link to="/about" style={{ color: theme.brightTealBlue }} className="font-semibold text-sm tracking-wide hover:text-[var(--bright-teal-blue)] transition-colors duration-200">
            Our Story / About Us
          </Link>
          
          <Link to="/contact" style={{ color: theme.brightTealBlue }} className="font-semibold text-sm tracking-wide hover:text-[var(--bright-teal-blue)] transition-colors duration-200">
            Contact
          </Link>
        </div>

        {/* CENTER RIGHT: Scaled Down Search Bar System */}
        <div className="hidden md:flex flex-1 max-w-md relative mx-2">
          <div className="w-full flex items-center rounded-xl border-2 overflow-hidden transition-all focus-within:shadow-md" style={{ borderColor: theme.frostedBlue }}>
            <span className="pl-3.5 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="Search ecommerce products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs font-medium text-slate-800 bg-transparent focus:outline-none placeholder-slate-400"
            />
            <button 
              className="px-4 py-1.5 text-xs font-bold tracking-wide text-white transition-colors h-full"
              style={{ backgroundColor: theme.brightTealBlue }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.deepTwilight}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.brightTealBlue}
            >
              Search
            </button>
          </div>
        </div>

        {/* RIGHT: Functional Shortcuts & Toggle */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Wishlist */}
          <button className="relative p-2 rounded-xl transition-colors group hover:bg-slate-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={theme.deepTwilight} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-red-500 transition-colors">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          </button>

          {/* Shopping Cart */}
          <button 
            onClick={() => setIsCartOpen(true)} 
            className="relative p-2 rounded-xl transition-colors hover:bg-slate-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={theme.deepTwilight} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            <span 
              style={{ backgroundColor: theme.brightTealBlue }} 
              className="absolute top-0.5 right-0.5 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm"
            >
              3
            </span>
          </button>
          {isCartOpen && (
            <CartComponent isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          )}

          {/* --- PROFILE SECTION WITH DROPDOWN --- */}
          {/* Kuch bhi purana delete nahi kiya, absolute position wrapper lagaya hai bas */}
          <div className="relative hidden sm:block" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="p-2 rounded-xl transition-colors hover:bg-slate-50 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={theme.deepTwilight} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </button>

            {/* English Information Promoted Dropdown Box */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-[60] text-left">
                <div className="space-y-1 mb-4">
                  <h4 className="text-xs font-black text-slate-800">Account Access</h4>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                    Please login to access your account dashboard, track orders, and explore full features.
                  </p>
                </div>
                
                <Link
                  to="/auth"
                  onClick={() => setIsProfileOpen(false)}
                  style={{ backgroundColor: theme.brightTealBlue }}
                  className="w-full text-white text-xs font-bold py-2.5 rounded-xl text-center shadow-sm hover:opacity-95 active:scale-[0.98] transition-all block"
                >
                  Login / Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Trigger */}
          <button 
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/xl" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={theme.deepTwilight} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={theme.deepTwilight} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* --- MOBILE DRAW_DOWN OVERLAY TRAY --- */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full bg-white shadow-xl border-t border-slate-100 p-6 flex flex-col gap-4 lg:hidden max-h-[80vh] overflow-y-auto z-50">
          <div className="w-full flex items-center rounded-xl border border-slate-200 overflow-hidden px-3 bg-slate-50 md:hidden">
            <span className="text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="Search collections..." 
              className="w-full px-2 py-2 text-xs bg-transparent focus:outline-none text-slate-800"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Link to="/" style={{ color: theme.deepTwilight }} className="font-bold text-base py-3 border-b border-slate-50 flex items-center justify-between" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/shop" style={{ color: theme.deepTwilight }} className="font-bold text-base py-3 border-b border-slate-50 flex items-center justify-between" onClick={() => setIsOpen(false)}>Products</Link>
            <Link to="/about" style={{ color: theme.deepTwilight }} className="font-bold text-base py-3 border-b border-slate-50 flex items-center justify-between" onClick={() => setIsOpen(false)}>Our Story / About Us</Link>
            <Link to="/contact" style={{ color: theme.deepTwilight }} className="font-bold text-base py-3 border-b border-slate-50 flex items-center justify-between" onClick={() => setIsOpen(false)}>Contact</Link>
          </div>
        </div>
      )}

    </header>
  );
};

export default Navbar;