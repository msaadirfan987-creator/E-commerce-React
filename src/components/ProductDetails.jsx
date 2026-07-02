import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
  const { id } = useParams();

  // Central Mock Database for all single product profiles
  const productsDatabase = {
    "1": {
      name: "Pro Wireless Noise Cancelling Headphones",
      price: 129, originalPrice: 199, category: "Headphones & Audio", rating: 4.8, reviewCount: 124, stock: 15,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80"
      ]
    },
    "2": {
      name: "Minimalist Leather Watch",
      price: 199, originalPrice: 299, category: "Jewelry & Watches", rating: 4.6, reviewCount: 85, stock: 8,
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
        "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&q=80"
      ]
    },
    "3": {
      name: "Ergonomic Mechanical Keyboard",
      price: 89, originalPrice: 120, category: "Laptops & PCs", rating: 4.7, reviewCount: 94, stock: 22,
      images: [
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80",
        "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80"
      ]
    },
    "4": {
      name: "Ultra HD Action Camera",
      price: 249, originalPrice: 349, category: "Cameras", rating: 4.5, reviewCount: 43, stock: 4,
      images: [
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80"
      ]
    },
    "5": {
      name: "Premium Hydro Skincare Serum",
      price: 45, originalPrice: 60, category: "Skincare & Makeup", rating: 4.9, reviewCount: 210, stock: 50,
      images: [
        "https://images.unsplash.com/photo-1608248597481-496100c8c836?w=600&q=80"
      ]
    },
    "6": {
      name: "Smart Fitness Tracker v4",
      price: 79, originalPrice: 110, category: "Smart Watches", rating: 4.4, reviewCount: 67, stock: 0,
      images: [
        "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&q=80"
      ]
    }
  };

  const product = productsDatabase[id] || productsDatabase["1"];

  // States
  const [selectedImage, setSelectedImage] = useState(0); 
  const [quantity, setQuantity] = useState(1); 
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', transformOrigin: 'center' }); 

  // Reset image and quantity indices on product shift
  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
  }, [id]);

  // Zoom Effect Logic
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect(); 
    const x = ((e.pageX - left - window.scrollX) / width) * 100; 
    const y = ((e.pageY - top - window.scrollY) / height) * 100; 
    
    setZoomStyle({
      display: 'block',
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2)' 
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' }); 
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      
      {/* LEFT COLUMN: IMAGES */}
      <div className="flex flex-col gap-4">
        {/* Main Big Image Box */}
        <div 
          className="w-full aspect-square bg-slate-50 rounded-xl overflow-hidden relative cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <img 
            src={product.images[selectedImage]} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-100"
            style={zoomStyle}
          />
          {zoomStyle.display === 'none' && (
            <img src={product.images[selectedImage]} className="w-full h-full object-cover absolute inset-0" alt="normal" />
          )}
        </div>

        {/* Small Thumbnails Layer */}
        {product.images.length > 1 && (
          <div className="flex gap-3">
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 bg-slate-50 transition-all ${selectedImage === idx ? 'border-[#0077b6]' : 'border-transparent'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt="thumb" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: TEXT INFOS & BUTTONS */}
      <div className="flex flex-col justify-between">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1">{product.category}</span>
          <h1 className="text-2xl font-black text-[#03045e] mb-2">{product.name}</h1>
          
          {/* Rating Section */}
          <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-500">
            <span className="bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md text-amber-500 flex items-center gap-1">
              ★ {product.rating}
            </span>
            <span>({product.reviewCount} Reviews)</span>
          </div>

          {/* Pricing Box */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl font-black text-[#03045e]">${product.price}</span>
            <span className="text-sm font-semibold text-slate-400 line-through">${product.originalPrice}</span>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </span>
          </div>

          {/* Stock Alert */}
          <p className="text-xs font-bold mb-6 flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            {product.stock > 0 ? `In Stock (${product.stock} items left)` : 'Out of Stock'}
          </p>

          {/* Quantity Selector */}
          <div className="mb-6 flex items-center gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quantity:</span>
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={product.stock === 0}
                className="px-3 py-1.5 font-bold hover:bg-slate-100 transition-colors text-slate-600 disabled:opacity-40"
              >
                -
              </button>
              <span className="px-4 text-sm font-bold text-slate-800">{product.stock > 0 ? quantity : 0}</span>
              <button 
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                disabled={product.stock === 0}
                className="px-3 py-1.5 font-bold hover:bg-slate-100 transition-colors text-slate-600 disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons Stack */}
        <div className="flex flex-col gap-3 mt-4">
          <div className="flex gap-3">
            <button 
              disabled={product.stock === 0}
              className="flex-1 bg-[#0077b6] text-white font-bold text-sm py-3.5 rounded-xl hover:opacity-95 active:scale-[0.99] transition-all shadow-sm disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button className="px-4 border border-slate-200 rounded-xl hover:bg-slate-50 active:scale-[0.99] transition-all flex items-center justify-center">
              ♡ 
            </button>
          </div>
          {product.stock > 0 && (
            <button className="w-full bg-[#03045e] text-white font-bold text-sm py-3.5 rounded-xl hover:opacity-95 active:scale-[0.99] transition-all shadow-sm">
              Buy Now
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;