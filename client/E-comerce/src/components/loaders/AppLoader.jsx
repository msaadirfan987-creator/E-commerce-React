import React from 'react';
import { motion } from 'framer-motion';
import LogoLoader from './LogoLoader';
import ProgressLoader from './ProgressLoader';

const AppLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        y: -10,
        transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
      }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center px-4 bg-[#0F172A] select-none pointer-events-auto"
    >
      {/* Background Radial Glow Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12)_0%,transparent_65%)] pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-sm w-full text-center space-y-8 z-10 flex flex-col items-center">
        {/* Animated Pulsing Logo */}
        <LogoLoader />

        {/* Double-Ring Premium Spinner */}
        <div className="relative w-12 h-12 flex items-center justify-center my-2">
          {/* Outer Ring */}
          <motion.div
            className="absolute w-full h-full border-2 border-transparent border-t-blue-500 border-r-blue-500/70 rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          {/* Inner Ring */}
          <motion.div
            className="absolute w-8 h-8 border-2 border-transparent border-b-sky-400 border-l-sky-400/70 rounded-full"
            animate={{ rotate: -360 }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        {/* Brand Text and Slogan */}
        <div className="space-y-3 flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-base uppercase tracking-[0.45em] font-black text-slate-100 drop-shadow-[0_2px_12px_rgba(59,130,246,0.25)] font-sans"
          >
            Loading Cartify...
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-[11px] font-semibold text-sky-400/90 tracking-[0.15em] uppercase"
          >
            Your Smart Shopping Destination
          </motion.p>
        </div>
      </div>

      {/* Progress Bar at the Bottom */}
      <ProgressLoader duration={2500} />
    </motion.div>
  );
};

export default AppLoader;

