import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import productService from '../services/productService';

const FeaturedProducts = () => {
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const seedFlashSale = [
    {
      id: 'seed-1',
      title: 'Premium Wireless Headphones',
      description: 'High-fidelity acoustics with active noise cancellation and sleek matte finish.',
      price: 299,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'],
      category: 'Headphones & Audio'
    },
    {
      id: 'seed-2',
      title: 'Minimalist Leather Watch',
      description: 'Luxury quartz movement watch with a pure genuine brown leather strap.',
      price: 189,
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'],
      category: 'Jewelry & Watches'
    },
    {
      id: 'seed-3',
      title: 'Amoled Active Smart Watch',
      description: 'Real-time biometric tracker with built-in location positioning metrics.',
      price: 249,
      images: ['https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&auto=format&fit=crop&q=80'],
      category: 'Smart Watches'
    },
    {
      id: 'seed-4',
      title: 'Next-Gen Wireless Console',
      description: 'Ultra-fast solid-state loading pipeline delivering immersive 4K high frame-rates.',
      price: 499,
      images: ['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&auto=format&fit=crop&q=80'],
      category: 'Gaming Consoles'
    }
  ];

  const seedAppliances = [
    {
      id: 'seed-5',
      title: 'Nordic Ceramic Flower Vase',
      description: 'Handcrafted contemporary clay vase optimized for sleek modern living rooms.',
      price: 45,
      images: ['https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&auto=format&fit=crop&q=80'],
      category: 'Home & Living'
    },
    {
      id: 'seed-6',
      title: 'Premium Espresso Coffee Maker',
      description: 'Compact high-pressure barista machine for perfect morning coffee extractions.',
      price: 185,
      images: ['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80'],
      category: 'Kitchen Appliances'
    },
    {
      id: 'seed-7',
      title: 'Minimalist Contemporary Sofa Set',
      description: 'High-density memory cushion couch featuring solid ash wood legs and premium fabrics.',
      price: 899,
      images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80'],
      category: 'Home & Living'
    },
    {
      id: 'seed-8',
      title: 'Smart Ambient LED Bar',
      description: 'RGB color sync automation tube for immersive workspace background setups.',
      price: 59,
      images: ['https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=600&auto=format&fit=crop&q=80'],
      category: 'Home & Living'
    }
  ];

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const data = await productService.getProducts();
        if (data.success) {
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error('Failed to load home page products:', err);
        setError('Connection issues loading catalog.');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  const renderProductGrid = (items) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((product) => {
        const productId = product._id || product.id;
        const isFavorited = favorites.includes(productId);
        const productImage = product.images && product.images.length > 0 ? product.images[0] : (product.img || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=300&q=80');

        return (
          <div 
            key={productId}
            className="flex flex-col rounded-xl overflow-hidden bg-white border border-slate-100 transition-all hover:border-slate-350 relative h-full"
          >
            {/* Image Box */}
            <div className="w-full h-48 bg-slate-50 relative group overflow-hidden">
              <button 
                onClick={() => toggleFavorite(productId)}
                className="absolute top-3 left-3 z-20 p-2 rounded-lg bg-white/90 border border-slate-100 hover:bg-white transition-all cursor-pointer"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill={isFavorited ? "#ef4444" : "none"} 
                  stroke={isFavorited ? "#ef4444" : "#475569"} 
                  strokeWidth="2.5"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                </svg>
              </button>

              <img 
                src={productImage} 
                alt={product.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=300&q=80'; }}
              />
            </div>

            {/* Content Details */}
            <div className="p-4 flex flex-col flex-grow justify-between bg-white">
              <div className="mb-3 space-y-1">
                <h3 className="text-xs font-bold text-slate-800 truncate">
                  {product.title}
                </h3>
                <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-slate-50">
                <span className="text-xs font-black text-slate-900">
                  ${product.price}
                </span>
                <button 
                  onClick={() => addToCart(product, 1)}
                  className="text-[10px] font-bold text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer"
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

  // Divide the database products into sections, otherwise fall back to seed details
  const dbFeatured = products.filter(p => p.featured);
  const dbAppliances = products.filter(p => p.category === 'Home & Living' || p.category === 'Kitchen Appliances');
  const dbGeneral = products.filter(p => !p.featured && p.category !== 'Home & Living' && p.category !== 'Kitchen Appliances');

  const flashSaleList = dbFeatured.length > 0 ? dbFeatured.slice(0, 4) : seedFlashSale;
  const applianceList = dbAppliances.length > 0 ? dbAppliances.slice(0, 4) : seedAppliances;
  
  // general lists fallback to general database items
  const GeneralCategoryTitle = dbGeneral.length > 0 ? "Latest Arrivals" : "Hot Collections";
  const generalList = dbGeneral.length > 0 ? dbGeneral.slice(0, 4) : seedFlashSale.slice().reverse();

  if (loading) {
    return (
      <div className="py-20 text-center select-none">
        <p className="text-slate-400 font-bold text-xs animate-pulse">Loading catalog listings...</p>
      </div>
    );
  }

  return (
    <section className="w-full py-12 bg-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* FLASH SALE / FEATURED */}
        <div>
          <div className="mb-4 border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Flash Sale / Featured
            </h2>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Grab these time-sensitive promotions and store spotlights</p>
          </div>
          {renderProductGrid(flashSaleList)}
        </div>

        {/* HOME APPLIANCES */}
        <div>
          <div className="mb-4 border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Home & Living
            </h2>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Premium interior items to upgrade your space</p>
          </div>
          {renderProductGrid(applianceList)}
        </div>

        {/* GENERAL CATALOG */}
        <div>
          <div className="mb-4 border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {GeneralCategoryTitle}
            </h2>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Curated seasonal look items</p>
          </div>
          {renderProductGrid(generalList)}
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;