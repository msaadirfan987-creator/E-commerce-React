import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // 🔥 Smooth panel sliding state transitions

const CartComponent = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 1. BACKDROP OVERLAY: Background overlay jo smoothly fade-in hoga */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }} // Aapke existing overlay opacity ke mutabiq set ho jayega
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'linear' }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* 2. SLIDING CART PANEL: Right side se Apple-style fluid animation shadow slider */}
          <motion.div
            initial={{ x: '100%' }} // Starting position: completely hidden to the right
            animate={{ x: 0 }}      // Slide inside the viewport smoothly
            exit={{ x: '100%' }}    // Slide back out beautifully on close
            /* 🔥 Premium custom cubic-bezier timing curve (Shopify / iOS feel) */
            transition={{ type: 'spring', damping: 32, stiffness: 280 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* --- YAHA AAPKE CART KA PEHLE SE MAUJOOD SAARA DESIGN / INTERNALS AYENGA --- */}
            <div className="p-6 h-full flex flex-col justify-between">
              
              {/* Header Box */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-800">Your Shopping Cart</h3>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 active:scale-90 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/>
                  </svg>
                </button>
              </div>

              {/* Middle Section: Items Space */}
              <div className="flex-1 py-4 overflow-y-auto">
                <p className="text-xs text-slate-400 font-medium text-center py-10">
                  Your cart items list renders here...
                </p>
              </div>

              {/* Footer Checkout Buttons Area */}
              <div className="pt-4 border-t border-slate-100">
                <button 
                  className="w-full bg-[#0077b6] text-white text-xs font-bold py-3 rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  Proceed to Checkout
                </button>
              </div>

            </div>
            {/* --- END OF YOUR INTERNAL CART DESIGN --- */}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartComponent;