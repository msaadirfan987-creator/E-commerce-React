import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import productService from '../services/productService';
import ProductSkeleton from './loaders/ProductSkeleton';
import ImageLoader from './loaders/ImageLoader';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedImage, setSelectedImage] = useState(0); 
  const [quantity, setQuantity] = useState(1); 
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', transformOrigin: 'center' });

  const seedProducts = {
    "1": {
      title: "Pro Wireless Noise Cancelling Headphones",
      price: 129, discountPrice: 0, category: "Headphones & Audio", rating: 4.8, reviewCount: 124, stock: 15,
      brand: "Premium Audio",
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80"
      ],
      description: "Experience studio-quality audio with advanced active noise cancellation and ergonomic cushion pads."
    },
    "2": {
      title: "Minimalist Leather Watch",
      price: 199, discountPrice: 0, category: "Jewelry & Watches", rating: 4.6, reviewCount: 85, stock: 8,
      brand: "Chrono",
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"
      ],
      description: "Elegant quartz movement chronometer watch featuring premium leather strap options."
    }
  };

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError('');
      try {
        // If the ID is a mock index (like '1' or 'seed-1'), use seed fallback
        if (seedProducts[id]) {
          setProduct(seedProducts[id]);
        } else if (id.startsWith('seed-')) {
          const seedId = id.replace('seed-', '');
          setProduct(seedProducts[seedId] || seedProducts["1"]);
        } else {
          const data = await productService.getProductById(id);
          if (data.success && data.product) {
            setProduct(data.product);
          } else {
            setError('Product not found in database.');
          }
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
        setError('Error reaching backend catalog registry.');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
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
      transform: 'scale(1.5)' 
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' }); 
  };

  if (loading) {
    return <ProductSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="py-20 text-center select-none">
        <p className="text-rose-500 font-bold text-xs">{error || 'Unable to view product details.'}</p>
        <Link to="/" className="text-slate-900 text-xs font-bold underline mt-4 inline-block">Back Home</Link>
      </div>
    );
  }

  const imagesList = product.images && product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg border border-slate-200 select-none">
      
      {/* LEFT COLUMN: IMAGES */}
      <div className="flex flex-col gap-4">
        {/* Main Big Image Box */}
        <div 
          className="w-full aspect-square bg-slate-50 rounded-lg overflow-hidden relative cursor-zoom-in border border-slate-100"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <img 
            src={imagesList[selectedImage]} 
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-100"
            style={zoomStyle}
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80'; }}
          />
          {zoomStyle.display === 'none' && (
            <ImageLoader 
              src={imagesList[selectedImage]} 
              className="w-full h-full absolute inset-0" 
              imgClassName="object-cover w-full h-full animate-fadeIn"
              alt="normal" 
            />
          )}
        </div>

        {/* Small Thumbnails */}
        {imagesList.length > 1 && (
          <div className="flex gap-3">
            {imagesList.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-16 h-16 rounded-md overflow-hidden border bg-slate-50 transition-all ${selectedImage === idx ? 'border-slate-800' : 'border-slate-200'}`}
              >
                <img 
                  src={img} 
                  className="w-full h-full object-cover" 
                  alt="thumb" 
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=150&q=80'; }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: DETAILS */}
      <div className="flex flex-col justify-between">
        <div className="space-y-4">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">{product.category}</span>
            <h1 className="text-lg font-bold text-slate-900 mt-1">{product.title}</h1>
            <span className="text-[10px] text-slate-400 font-bold block mt-1">Brand: {product.brand || 'Generic'}</span>
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span className="text-amber-500">★ {product.rating || 5.0}</span>
            <span>({product.reviewCount || 10} ratings)</span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-2.5">
            <span className="text-lg font-bold text-slate-900">${product.price}</span>
            {product.discountPrice > 0 && (
              <>
                <span className="text-xs font-semibold text-slate-400 line-through">${product.discountPrice}</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Sale Active
                </span>
              </>
            )}
          </div>

          {/* Stock Alert */}
          <p className="text-[10px] font-bold flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            {product.stock > 0 ? `In Stock (${product.stock} items left)` : 'Out of Stock'}
          </p>

          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            {product.description}
          </p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 pt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quantity:</span>
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 text-xs">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={product.stock === 0}
                className="px-2.5 py-1 font-bold hover:bg-slate-100 transition-colors text-slate-600 disabled:opacity-40 cursor-pointer"
              >
                -
              </button>
              <span className="px-3 font-bold text-slate-800">{product.stock > 0 ? quantity : 0}</span>
              <button 
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                disabled={product.stock === 0}
                className="px-2.5 py-1 font-bold hover:bg-slate-100 transition-colors text-slate-600 disabled:opacity-40 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-6">
          <div className="flex gap-2">
            <button 
              disabled={product.stock === 0}
              onClick={() => addToCart({ id: id, ...product }, quantity)}
              className="flex-1 bg-slate-900 text-white font-bold text-xs py-2.5 rounded-lg hover:bg-slate-800 transition-colors shadow-sm disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer"
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <Link 
              to={`/messages?sellerId=${product.seller?._id || product.seller}&productId=${product._id || id}`}
              className="flex-1 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-850 font-bold text-xs py-2.5 rounded-lg text-center transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Message Seller
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;