import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom'; // 🔥 useLocation for active routing underline
import { motion, AnimatePresence } from 'framer-motion'; // 🔥 Framer motion premium effects
import logo from '../assets/logo.png';
import CartComponent from './CartComponent'; // Import the CartComponent

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // 🔥 Profile states and click outside tracking
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  
  const location = useLocation(); // 🔥 Active route tracking

  // Brand Palette Configuration (100% Unchanged)
  const theme = {
    deepTwilight: '#03045e',
    brightTealBlue: '#0077b6',
    turquoiseSurf: '#00b4d8',
    frostedBlue: '#90e0ef',
    lightCyan: '#caf0f8',
    surface: '#ffffff',
  };

  // 🔥 Outside Click Logic: Box closes immediately when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper check for active state matching
  const isActive = (path) => location.pathname === path;

  return (
    <header className="w-full sticky top-0 z-50 shadow-sm bg-white select-none">
      
      {/* --- 1. TOP UTILITY BAR --- */}
      <div 
        style={{ backgroundColor: theme.lightCyan }} 
        className="w-full px-4 sm:px-6 py-2 flex items-center justify-between text-xs font-semibold"
      >
        <div className="flex items-center gap-2" style={{ color: theme.deepTwilight }}>
          {/* Subtle responsive pulsing dot */}
          <span className="flex h-2 w-2 rounded-full bg-[#0077b6] animate-pulse" />
          Free & 100% Secure Checkout Panel Provided
        </div>
        <div className="flex items-center gap-4">
          <button className="hover:underline transition-all duration-300 active:scale-95" style={{ color: theme.brightTealBlue }}>Follow orders</button>
          <span className="text-slate-300">|</span>
          <Link to="/auth" className="hover:underline transition-all duration-300 active:scale-95" style={{ color: theme.deepTwilight }}>
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
        <Link to="/" className="shrink-0 flex items-center transition-transform duration-300 hover:scale-102 active:scale-98">
          <img 
            src={logo} 
            alt="Cartify Logo" 
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </Link>

        {/* CENTER LEFT: Direct Navlinks with Apple Style Sliding Underline */}
        <div className="hidden lg:flex items-center gap-6 shrink-0">
          {[
            { name: 'Home', path: '/' },
            { name: 'Products', path: '/shop' },
            { name: 'Our Story / About Us', path: '/about' },
            { name: 'Contact', path: '/contact' }
          ].map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              style={{ color: isActive(link.path) ? theme.deepTwilight : theme.brightTealBlue }} 
              className={`font-semibold text-sm tracking-wide relative py-1 transition-colors duration-300 ${
                isActive(link.path) ? 'font-bold' : 'hover:text-[var(--bright-teal-blue)]'
              }`}
            >
              {link.name}
              {/* Dynamic physical underline indicator matching Shopify aesthetics */}
              {isActive(link.path) && (
                <motion.div 
                  layoutId="activeUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ backgroundColor: theme.deepTwilight }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* CENTER RIGHT: Scaled Down Search Bar System with Active Border Feedback */}
        <div className="hidden md:flex flex-1 max-w-md relative mx-2">
          <div 
            className="w-full flex items-center rounded-xl border-2 overflow-hidden transition-all duration-300 focus-within:shadow-md focus-within:border-[var(--bright-teal-blue)]" 
            style={{ borderColor: theme.frostedBlue }}
          >
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
              className="px-4 py-1.5 text-xs font-bold tracking-wide text-white transition-all duration-300 active:scale-95 shadow-sm hover:shadow-md"
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
          {/* Wishlist Icon Animation */}
          <button className="relative p-2 rounded-xl transition-all duration-300 hover:bg-slate-50 hover:scale-110 active:scale-95 group">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={theme.deepTwilight} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-red-500 transition-colors duration-300 group-hover:scale-105">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          </button>

          {/* Shopping Cart Icon Animation */}
          <button 
            onClick={() => setIsCartOpen(true)} 
            className="relative p-2 rounded-xl transition-all duration-300 hover:bg-slate-50 hover:scale-110 active:scale-95 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={theme.deepTwilight} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[var(--bright-teal-blue)] transition-colors duration-300">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            <span 
              style={{ backgroundColor: theme.brightTealBlue }} 
              className="absolute top-0.5 right-0.5 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm animate-bounce"
            >
              3
            </span>
          </button>
          {isCartOpen && (
            <CartComponent isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          )}

          {/* --- PROFILE SECTION FIXED FOR DESKTOP & MOBILE RESPONSIVENESS --- */}
          {/* 🔥 'hidden sm:block' has been removed so it stays visible on mobile as well */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="p-2 rounded-xl transition-all duration-300 hover:bg-slate-50 hover:scale-110 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={theme.deepTwilight} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </button>

            {/* Micro-interaction Spring Box Dropdown */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  /* 🔥 Smart responsive alignments: right-[-40px] protects from clipping on mobile screen edges */
                  className="absolute right-[-40px] sm:right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-[60] text-left"
                >
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
                    className="w-full text-white text-xs font-bold py-2.5 rounded-xl text-center shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 block"
                  >
                    Login / Register
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Hamburger Menu Trigger */}
          <button 
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-all duration-200 active:scale-90"
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

      {/* --- MOBILE DRAW_DOWN OVERLAY TRAY WITH ANIMATION --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute left-0 right-0 top-full bg-white shadow-xl border-t border-slate-100 p-6 flex flex-col gap-4 lg:hidden max-h-[80vh] overflow-y-auto z-50"
          >
            <div className="w-full flex items-center rounded-xl border border-slate-200 overflow-hidden px-3 bg-slate-50 md:hidden focus-within:border-[var(--bright-teal-blue)] transition-all">
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
              {[
                { name: 'Home', path: '/' },
                { name: 'Products', path: '/shop' },
                { name: 'Our Story / About Us', path: '/about' },
                { name: 'Contact', path: '/contact' }
              ].map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  style={{ color: theme.deepTwilight }} 
                  className={`font-bold text-base py-3 border-b border-slate-50 flex items-center justify-between transition-transform active:translate-x-1 ${
                    isActive(link.path) ? 'text-[#0077b6]' : ''
                  }`} 
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                  {isActive(link.path) && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.brightTealBlue }} />}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
};

export default Navbar;