import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const CartComponent = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  
  // Total price calculate karne ka function
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      let priceNum = 0;
      if (typeof item.price === 'number') {
        priceNum = item.price;
      } else if (typeof item.price === 'string') {
        priceNum = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
      }
      return total + priceNum * (item.quantity || 1);
    }, 0).toFixed(2);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 1. BACKDROP OVERLAY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'linear' }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* 2. SLIDING CART PANEL */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 280 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-6 h-full flex flex-col justify-between">
              
              {/* Header Box */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-800">Your Shopping Cart</h3>
                  <span className="bg-[#0077b6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {cartItems.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 active:scale-90 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/>
                  </svg>
                </button>
              </div>

              {/* Middle Section: Dynamic Items Space */}
              <div className="flex-1 py-4 overflow-y-auto space-y-4">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-10">
                    <p className="text-sm text-slate-400 font-medium text-center">
                      Your cart is empty.
                    </p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {cartItems.map((item) => (
                      <motion.div 
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100"
                      >
                        {/* Item Image */}
                        <img 
                          src={item.img} 
                          alt={item.name} 
                          className="w-16 h-16 rounded-lg object-cover bg-white shrink-0" 
                        />
                        
                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 truncate">{item.name}</h4>
                          <p className="text-xs font-black text-[#0077b6] mt-1">${item.price}</p>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-5 h-5 rounded-md border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 hover:bg-slate-200 transition-colors"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold text-slate-700 w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-5 h-5 rounded-md border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 hover:bg-slate-200 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Delete Button */}
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                          </svg>
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer Checkout Buttons Area */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-500">Subtotal:</span>
                  <span className="text-lg font-black text-slate-800">${calculateTotal()}</span>
                </div>
                
                <button 
                  disabled={cartItems.length === 0}
                  className="w-full bg-[#0077b6] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold py-3 rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  Proceed to Checkout
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartComponent;