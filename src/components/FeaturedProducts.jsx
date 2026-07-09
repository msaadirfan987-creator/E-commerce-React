import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const FeaturedProducts = () => {
  const { addToCart } = useCart();
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

  // Wishlist state
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // --- 1. FLASH SALE PRODUCTS (4 Items) ---
  const flashSaleProducts = [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      desc: 'High-fidelity acoustics with active noise cancellation and sleek matte finish.',
      price: '$299',
      img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      name: 'Minimalist Leather Watch',
      desc: 'Luxury quartz movement watch with a pure genuine brown leather strap.',
      price: '$189',
      img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 3,
      name: 'Amoled Active Smart Watch',
      desc: 'Real-time biometric tracker with built-in location positioning metrics.',
      price: '$249',
      img: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 4,
      name: 'Next-Gen Wireless Console',
      desc: 'Ultra-fast solid-state loading pipeline delivering immersive 4K high frame-rates.',
      price: '$499',
      img: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&auto=format&fit=crop&q=80'
    }
  ];

  // --- 2. HOME APPLIANCES PRODUCTS (4 Items) ---
  const applianceProducts = [
    {
      id: 5,
      name: 'Nordic Ceramic Flower Vase',
      desc: 'Handcrafted contemporary clay vase optimized for sleek modern living rooms.',
      price: '$45',
      img: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 6,
      name: 'Premium Espresso Coffee Maker',
      desc: 'Compact high-pressure barista machine for perfect morning coffee extractions.',
      price: '$185',
      img: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 7,
      name: 'Minimalist Contemporary Sofa Set',
      desc: 'High-density memory cushion couch featuring solid ash wood legs and premium fabrics.',
      price: '$899',
      img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 8,
      name: 'Smart Ambient LED Bar',
      desc: 'RGB color sync automation tube for immersive workspace background setups.',
      price: '$59',
      img: 'https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=600&auto=format&fit=crop&q=80'
    }
  ];

  // --- 3. TRENDING FASHION PRODUCTS (4 Items) ---
  const fashionProducts = [
    {
      id: 9,
      name: 'Classic Urban Trench Coat',
      desc: 'Tailored weather-resistant apparel combining comfort with a modern fit.',
      price: '$149',
      img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 10,
      name: 'Organic Skin Renewal Serum',
      desc: 'Natural moisturizing facial oil enriched with vitamins and herbal essence.',
      price: '$79',
      img: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 11,
      name: 'Premium Leather Boots',
      desc: 'Handcrafted durable outdoor vintage leather shoes with memory soft inner sole.',
      price: '$199',
      img: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 12,
      name: 'Retro Canvas Backpack',
      desc: 'Waterproof high-capacity traveling pack with laptop compartment sleeves.',
      price: '$85',
      img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80'
    }
  ];

  // Reusable card grid renderer with 100% fixed alignments
  const renderProductGrid = (items) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((product) => {
        const isFavorited = favorites.includes(product.id);
        return (
          <div 
            key={product.id}
            className="flex flex-col rounded-2xl overflow-hidden bg-white border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative h-full"
            style={{ borderColor: theme.frostedBlue }}
          >
            {/* Image Box - Fixed aspect ratio to avoid layout shifts */}
            <div className="w-full h-52 bg-slate-50 relative group overflow-hidden">
              <button 
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-4 left-4 z-20 p-2 rounded-xl bg-white/80 backdrop-blur-md shadow-sm border border-white/20 transition-all duration-200 hover:bg-white hover:scale-110"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill={isFavorited ? "#ef4444" : "none"} 
                  stroke={isFavorited ? "#ef4444" : theme.deepTwilight} 
                  strokeWidth="2.5"
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

            {/* Content Details */}
            <div className="p-4 flex flex-col flex-grow justify-between bg-white">
              <div className="mb-4">
                <h3 className="text-sm font-bold tracking-wide line-clamp-1" style={{ color: theme.deepTwilight }}>
                  {product.name}
                </h3>
                <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {product.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                <span className="text-base font-black tracking-tight" style={{ color: theme.deepTwilight }}>
                  {product.price}
                </span>
                <button 
                  onClick={() => addToCart(product, 1)}
                  className="text-[11px] font-bold text-white px-3 py-1.5 rounded-xl active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
                  style={{ backgroundColor: theme.brightTealBlue }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <section className="w-full py-12 bg-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        
        {/* === SECTION 1: FLASH SALE === */}
        <div>
          <div className="mb-6 border-b pb-4" style={{ borderColor: theme.frostedBlue }}>
            <h2 className="text-xl font-black tracking-tight uppercase" style={{ color: theme.deepTwilight }}>
              Flash Sale
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Grab these hot deals before they are gone</p>
          </div>
          {renderProductGrid(flashSaleProducts)}
        </div>

        {/* === SECTION 2: HOME APPLIANCES === */}
        <div>
          <div className="mb-6 border-b pb-4" style={{ borderColor: theme.frostedBlue }}>
            <h2 className="text-xl font-black tracking-tight uppercase" style={{ color: theme.deepTwilight }}>
              Home Appliances
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Premium interior upgrades for your modern home</p>
          </div>
          {renderProductGrid(applianceProducts)}
        </div>

        {/* === SECTION 3: TRENDING FASHION === */}
        <div>
          <div className="mb-6 border-b pb-4" style={{ borderColor: theme.frostedBlue }}>
            <h2 className="text-xl font-black tracking-tight uppercase" style={{ color: theme.deepTwilight }}>
              Trending Fashion
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Curated lifestyle aesthetics for the seasonal look</p>
          </div>
          {renderProductGrid(fashionProducts)}
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;