import React from 'react';
import { Link } from 'react-router-dom'; 
import { useCart } from '../context/CartContext';

const ProductGrid = () => {
  const { addToCart } = useCart();
  const theme = {
    deepTwilight: '#03045e', 
    brightTealBlue: '#0077b6', 
  };

  const mockProducts = [
    { id: 1, name: 'Pro Wireless Headphones', price: 129, category: 'Headphones & Audio', rating: 4.8, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
    { id: 2, name: 'Minimalist Leather Watch', price: 199, category: 'Jewelry & Watches', rating: 4.6, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80' },
    { id: 3, name: 'Ergonomic Mechanical Keyboard', price: 89, category: 'Laptops & PCs', rating: 4.7, img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80' },
    { id: 4, name: 'Ultra HD Action Camera', price: 249, category: 'Cameras', rating: 4.5, img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80' },
    { id: 5, name: 'Premium Hydro Skincare Serum', price: 45, category: 'Skincare & Makeup', rating: 4.9, img: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?w=500&q=80' },
    { id: 6, name: 'Smart Fitness Tracker v4', price: 79, category: 'Smart Watches', rating: 4.4, img: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
      {mockProducts.map((product) => (
        <Link 
          to={`/product/${product.id}`} 
          key={product.id} 
          className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full cursor-pointer block"
        >
          {/* Product Image Wrapper */}
          <div className="w-full aspect-square bg-slate-50 overflow-hidden relative">
            <img 
              src={product.img} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Product Info */}
          <div className="p-5 flex flex-col flex-grow bg-white">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
              {product.category} 
            </span>
            
            <h4 
              style={{ color: theme.deepTwilight }} 
              className="font-bold text-sm line-clamp-2 mb-3 min-h-[40px] group-hover:text-[#0077b6] transition-colors"
            >
              {product.name} 
            </h4>

            {/* Price and Rating */}
            <div className="flex items-center justify-between mt-auto mb-4">
              <span style={{ color: theme.deepTwilight }} className="text-base font-black">
                ${product.price} 
              </span>
              
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg text-amber-500 text-xs font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {product.rating} 
              </div>
            </div>

            {/* Action Call Button */}
            <button 
              className="w-full text-white text-xs font-bold py-3 px-4 rounded-xl transition-all duration-200 active:scale-[0.98] mt-auto block shadow-sm"
              style={{ backgroundColor: theme.brightTealBlue }}
              onClick={(e) => {
                e.preventDefault(); // Prevents navigating to single product page when clicking directly on button
                addToCart(product, 1);
              }}
            >
              Add to Cart
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;