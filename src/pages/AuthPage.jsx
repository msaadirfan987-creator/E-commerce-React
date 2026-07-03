import React, { useState } from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png'; // Aapka PressMart Logo

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState('shop'); // 'shop' ya 'sell'

  const theme = {
    deepTwilight: '#03045e',
    brightTealBlue: '#0077b6',
    lightCyan: '#caf0f8',
  };

  // Premium High-Quality E-commerce Images
  const loginBgImage = "https://images.unsplash.com/photo-1563013544-824ae1d704d3?q=80&w=600&auto=format&fit=crop"; 
  const signupBgImage = "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=600&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-0 sm:p-4 overflow-x-hidden font-sans select-none">
      
      {/* 1. MAIN CARD CONTAINER */}
      {/* Mobile par h-auto aur full rounded-none ho jayega taake screen par fix aaye */}
      <div className="bg-white w-full max-w-4xl h-screen sm:h-[620px] sm:rounded-3xl shadow-xl overflow-y-auto sm:overflow-hidden flex flex-col md:flex-row relative border border-slate-100">
        
        {/* ======================================================= */}
        {/* --- DESKTOP SLIDING BRANDING CONTAINER (WITH IMAGES) --- */}
        {/* ======================================================= */}
        <motion.div 
          animate={{ x: isSignUp ? '0%' : '100%' }}
          transition={{ type: 'spring', stiffness: 90, damping: 16 }}
          // hidden md:flex lagaya hai, yaani mobile par ye sliding box chup jayega
          className="absolute top-0 bottom-0 left-0 w-1/2 hidden md:flex flex-col justify-center items-center p-12 text-center z-20 shadow-2xl overflow-hidden text-white"
        >
          {/* Background Image Layer Layer with Dark Overlay overlay effect */}
          <motion.div 
            key={isSignUp ? 'signup-img' : 'login-img'}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${isSignUp ? signupBgImage : loginBgImage})` }}
          />
          <div className="absolute inset-0 bg-[#03045e]/85 backdrop-blur-[2px] z-10" />

          {/* Core Content Layer */}
          <div className="relative z-30 flex flex-col items-center">
            {/* Aapka Website Logo Logo */}
            <img src={logo} alt="PressMart Logo" className="h-12 w-auto mb-6 object-contain filter brightness-0 invert" />
            
            <h2 className="text-xl font-black mb-2 tracking-wide">
              {isSignUp ? "Create Your Account" : "Welcome Back 👋"}
            </h2>
            <p className="text-[11px] font-medium leading-relaxed max-w-[280px]" style={{ color: theme.lightCyan }}>
              {isSignUp 
                ? "Discover premium custom prints or open your own customized digital store instantly." 
                : "Login to continue shopping high-quality assets or manage your dashboard."}
            </p>
            <div className="w-16 h-1 rounded-full mt-6" style={{ backgroundColor: theme.brightTealBlue }} />
          </div>
        </motion.div>

        {/* ======================================================= */}
        {/* --- PANEL 1: LOGIN FORM BLOCK (LEFT SIDE) --- */}
        {/* ======================================================= */}
        <div className={`w-full md:w-1/2 min-h-full p-8 sm:p-12 flex flex-col justify-center bg-white transition-all ${isSignUp ? 'hidden md:flex' : 'flex'}`}>
          <div className="max-w-sm w-full mx-auto space-y-5 py-6">
            
            {/* Mobile Header: Logo elements showing only on mobile screens */}
            <div className="flex flex-col items-center md:hidden mb-2">
              <img src={logo} alt="PressMart Logo" className="h-10 w-auto mb-3 object-contain" />
              <h2 className="text-base font-black text-slate-800">Welcome Back 👋</h2>
            </div>

            <div className="hidden md:block">
              <h3 className="text-lg font-black" style={{ color: theme.deepTwilight }}>Login Account</h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Please fill your details to proceed.</p>
            </div>
            
            <div className="space-y-3.5">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Email Address</label>
                <input type="email" placeholder="name@example.com" className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0077b6] bg-slate-50/50 font-medium" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0077b6] bg-slate-50/50 font-medium" />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold">
              <label className="flex items-center gap-2 cursor-pointer text-slate-500">
                <input type="checkbox" className="rounded text-[#0077b6] focus:ring-0" /> Remember Me
              </label>
              <button style={{ color: theme.brightTealBlue }} className="hover:underline">Forgot Password?</button>
            </div>

            <button style={{ backgroundColor: theme.brightTealBlue }} className="w-full text-white text-xs font-bold py-3 rounded-xl shadow-sm hover:opacity-95 active:scale-[0.99] transition-all">
              Login
            </button>

            <button className="w-full bg-white border border-slate-200 text-slate-600 text-xs font-bold py-2.5 rounded-xl shadow-sm hover:bg-slate-50 flex items-center justify-center gap-2 transition-all">
              Google Account
            </button>

            <p className="text-center text-[11px] font-medium text-slate-400 pt-2">
              Don't have an account?{' '}
              <button onClick={() => setIsSignUp(true)} style={{ color: theme.brightTealBlue }} className="font-bold hover:underline">Create Account</button>
            </p>
          </div>
        </div>

        {/* ======================================================= */}
        {/* --- PANEL 2: SIGN UP FORM BLOCK (RIGHT SIDE) --- */}
        {/* ======================================================= */}
        <div className={`w-full md:w-1/2 min-h-full p-8 sm:p-10 flex flex-col justify-center bg-white transition-all ${!isSignUp ? 'hidden md:flex' : 'flex'}`}>
          <div className="max-w-sm w-full mx-auto space-y-4 py-6">
            
            {/* Mobile Header for SignUp screen */}
            <div className="flex flex-col items-center md:hidden mb-2">
              <img src={logo} alt="PressMart Logo" className="h-10 w-auto mb-3 object-contain" />
              <h2 className="text-base font-black text-slate-800">Create Account</h2>
            </div>

            <div className="hidden md:block">
              <h3 className="text-lg font-black" style={{ color: theme.deepTwilight }}>Sign Up</h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Setup your consumer or merchant profile.</p>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0077b6] bg-slate-50/50 font-medium" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Email Address</label>
                <input type="email" placeholder="name@example.com" className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0077b6] bg-slate-50/50 font-medium" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Phone Number</label>
                <input type="tel" placeholder="+92 300 1234567" className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0077b6] bg-slate-50/50 font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0077b6] bg-slate-50/50 font-medium" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Confirm</label>
                  <input type="password" placeholder="••••••••" className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0077b6] bg-slate-50/50 font-medium" />
                </div>
              </div>
            </div>

            {/* Account Role Selector Selector Component */}
            <div className="bg-slate-50 p-2 rounded-xl flex items-center justify-around border border-slate-100">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                <input type="radio" checked={role === 'shop'} onChange={() => setRole('shop')} className="text-[#0077b6] focus:ring-0" /> Shop Products
              </label>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                <input type="radio" checked={role === 'sell'} onChange={() => setRole('sell')} className="text-[#0077b6] focus:ring-0" /> Sell Products
              </label>
            </div>

            <button style={{ backgroundColor: theme.deepTwilight }} className="w-full text-white text-xs font-bold py-3 rounded-xl shadow-sm hover:opacity-95 active:scale-[0.99] transition-all">
              Create Account
            </button>

            <p className="text-center text-[11px] font-medium text-slate-400 pt-1">
              Already have an account?{' '}
              <button onClick={() => setIsSignUp(false)} style={{ color: theme.brightTealBlue }} className="font-bold hover:underline">Login</button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;