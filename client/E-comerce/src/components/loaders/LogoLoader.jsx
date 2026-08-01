import React from 'react';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png';

const LogoLoader = () => {
  return (
    <div className="relative flex items-center justify-center select-none pointer-events-none">
      {/* Background soft glowing aura */}
      <motion.div
        className="absolute w-32 h-32 bg-blue-500/20 rounded-full blur-2xl z-0"
        animate={{
          scale: [0.9, 1.15, 0.9],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Secondary sharper inner glow */}
      <motion.div
        className="absolute w-20 h-20 bg-blue-400/30 rounded-full blur-xl z-0"
        animate={{
          scale: [0.85, 1.08, 0.85],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* The main logo image */}
      <motion.img
        src={logo}
        alt="Cartify Logo"
        className="w-20 h-auto relative z-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]"
        animate={{
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default LogoLoader;

