import React, { useState } from 'react';

const FeaturedProducts = () => {
  // Color palette synchronized with your Cartify design scheme
  const theme = {
    deepTwilight: '#03045e',
    brightTealBlue: '#0077b6',
    turquoiseSurf: '#00b4d8',
    frostedBlue: '#90e0ef',
    lightCyan: '#caf0f8',
    surface: '#ffffff',
    cardBg: '#f8fafc'
  };

  // State to track favorited product IDs dynamically
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // 6 Curated products directly matching your active storefront categories
  const products = [
    {
      id: 1,
      name: 'Wireless Noise-Canceling Headphones',
      desc: 'Premium sound engineering with high-fidelity acoustics, active audio cancellation, and dual mic integration.',
      price: '$299',
      category: 'Electronics',
      img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 2,
      name: 'Classic Urban Trench Coat',
      desc: 'Tailored weather-resistant seasonal coat combining luxury comfort lining with an elegant minimalist fit.',
      price: '$149',
      category: 'Fashion & Apparel',
      img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 3,
      name: 'Complete Skin Renewal Set',
      desc: 'Organic moisturizing skincare serums and facial treatments enriched with nourishing restorative natural vitamins.',
      price: '$79',
      category: 'Beauty & Cosmetics',
      img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 4,
      name: 'Minimalist Contemporary Sofa Set',
      desc: 'High-density memory cushion couch featuring solid ash wood legs and premium anti-stain velvet upholstery fabrics.',
      price: '$899',
      category: 'Home & Living',
      img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 5,
      name: 'Next-Gen Wireless Gaming Console',
      desc: 'Ultra-fast custom solid-state drive loading architectural pipeline delivering immersive 4K high frame-rate rendering.',
      price: '$499',
      category: 'Gaming Consoles',
      img: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 6,
      name: 'Amoled Active Fitness Smart Watch',
      desc: 'Real-time biometric vital tracking sensor hub complete with built-in location positioning metrics and always-on display panel.',
      price: '$249',
      category: 'Smart Watches',
      img: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=60'
    }
  ];

  return (
    <section className="w-full py-16 bg-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* --- SECTION TITLE --- */}
        <div className="mb-12 border-b pb-4" style={{ borderColor: theme.frostedBlue }}>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: theme.deepTwilight }}>
            Featured Products
          </h2>
        </div>

        {/* --- PRODUCTS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const isFavorited = favorites.includes(product.id);
            
            return (
              <div 
                key={product.id}
                className="flex flex-col rounded-2xl overflow-hidden bg-white border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative"
                style={{ borderColor: theme.frostedBlue }}
              >
                
                {/* 1. TOP SIDE: Product Image & Favorite Button Overlay */}
                <div className="w-full h-56 overflow-hidden bg-slate-50 relative group">
                  
                  {/* Floating Favorite (Heart) Button on Left Side */}
                  <button 
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-4 left-4 z-20 p-2 rounded-xl bg-white/70 backdrop-blur-md shadow-sm border border-white/20 transition-all duration-200 hover:bg-white hover:scale-110 group/fav"
                    title={isFavorited ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill={isFavorited ? "#ef4444" : "none"} 
                      stroke={isFavorited ? "#ef4444" : theme.deepTwilight} 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="group-hover/fav:stroke-red-500 transition-colors duration-200"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                    </svg>
                  </button>

                  <img 
                    src={product.img} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Card Body Container */}
                <div className="p-5 flex flex-col flex-grow justify-between">
                  
                  {/* 2. MIDDLE SIDE: Category, Title, and Description */}
                  <div className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: theme.turquoiseSurf }}>
                      {product.category}
                    </span>
                    <h3 className="text-lg font-bold tracking-wide mt-1" style={{ color: theme.deepTwilight }}>
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">
                      {product.desc}
                    </p>
                  </div>

                  {/* 3. LOWER ROW: Price and Shop Now Button Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    {/* Price Left Side */}
                    <span className="text-xl font-black tracking-tight" style={{ color: theme.deepTwilight }}>
                      {product.price}
                    </span>
                    
                    {/* Shop Now Button Right Side */}
                    <button 
                      className="px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-sm"
                      style={{ backgroundColor: theme.brightTealBlue, color: theme.surface }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.deepTwilight;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = theme.brightTealBlue;
                      }}
                      onClick={() => alert(`Redirecting to checkout for ${product.name}`)}
                    >
                      Shop Now
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;