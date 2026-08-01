import React from 'react';
import { motion } from 'framer-motion';

const ProgressLoader = ({ duration = 2500 }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full h-[4px] bg-slate-950/80 overflow-hidden select-none pointer-events-none z-[10000]">
      <motion.div 
        className="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-blue-500 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: duration / 1000,
          ease: "easeInOut",
        }}
        style={{
          boxShadow: '0 0 12px rgba(59, 130, 246, 0.8), 0 0 4px rgba(96, 165, 250, 0.6)',
        }}
      />
    </div>
  );
};

export default ProgressLoader;

