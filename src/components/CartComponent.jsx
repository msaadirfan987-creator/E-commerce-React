import React from 'react';

// Props mein isOpen aur onClose lazmi lena hai jo Navbar se aa rahe hain
const CartComponent = ({ isOpen, onClose }) => {
  const theme = {
    deepTwilight: '#03045e',
    brightTealBlue: '#0077b6',
  };

  // Mock Data (Items jo cart mein nazar aayenge)
  const cartItems = [
    { id: 1, name: 'Pro Wireless Headphones', price: 129, qty: 1, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&q=80' },
    { id: 2, name: 'Minimalist Leather Watch', price: 199, qty: 2, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&q=80' },
  ];

  return (
    // 🔥 Humne z-50 ko badal kar z-[9999] kar diya hai taake navbar iske peeche chup jaye aur cart sabsay upar aaye
    <div className="fixed inset-0 z-[9999] overflow-hidden select-none">
      
      {/* 1. Black Transparent Backdrop (Peeche ka kaala parda) */}
      {/* Is par click karne se onClose() chalega aur cart band ho jayega */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose} 
      />

      {/* 2. Main Sliding Sidebar Box */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white h-full flex flex-col shadow-2xl animate-fade-in-right">
          
          {/* Cart Header (Title and Close Button) */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
            <h2 style={{ color: theme.deepTwilight }} className="text-base font-black">Shopping Cart</h2>
            {/* Cross (×) Button jis par click karne se cart close ho jata hai */}
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-slate-600 text-2xl font-bold p-2 transition-colors"
            >
              ×
            </button>
          </div>

          {/* Cart Items List Container (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 border-b border-slate-50 pb-4 items-center">
                <img src={item.img} alt={item.name} className="w-16 h-16 object-cover rounded-xl bg-slate-50 border" />
                <div className="flex-1">
                  <h4 style={{ color: theme.deepTwilight }} className="text-xs font-bold line-clamp-1">{item.name}</h4>
                  <p style={{ color: theme.brightTealBlue }} className="text-xs font-black mt-1">${item.price}</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Qty: {item.qty}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Footer Block (Total Bill and Checkout) */}
          <div className="p-5 border-t border-slate-100 bg-slate-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-slate-500">Subtotal:</span>
              <span style={{ color: theme.deepTwilight }} className="text-base font-black">
                {/* Cart ka total auto calculate karne ke liye loop logic */}
                ${cartItems.reduce((total, item) => total + (item.price * item.qty), 0)}
              </span>
            </div>
            
            <p className="text-[10px] text-slate-400 font-medium mb-4">Shipping and taxes calculated at checkout.</p>
            
            <div className="space-y-2">
              <button 
                style={{ backgroundColor: theme.brightTealBlue }}
                className="w-full text-white text-xs font-bold py-3.5 rounded-xl hover:opacity-95 transition-all shadow-sm active:scale-[0.99]"
              >
                Proceed to Checkout
              </button>
              <button 
                onClick={onClose}
                className="w-full bg-white border border-slate-200 text-slate-600 text-xs font-bold py-3.5 rounded-xl hover:bg-slate-100 transition-all active:scale-[0.99]"
              >
                Continue Shopping
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CartComponent;