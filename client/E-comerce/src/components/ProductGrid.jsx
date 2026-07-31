import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { useCart } from '../context/CartContext';
import productService from '../services/productService';

const ProductGrid = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const mockProducts = [
    { id: 'mock-1', title: 'Pro Wireless Headphones', price: 129, category: 'Headphones & Audio', rating: 4.8, images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'] },
    { id: 'mock-2', title: 'Minimalist Leather Watch', price: 199, category: 'Jewelry & Watches', rating: 4.6, images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'] },
    { id: 'mock-3', title: 'Ergonomic Mechanical Keyboard', price: 89, category: 'Laptops & PCs', rating: 4.7, images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80'] },
    { id: 'mock-4', title: 'Ultra HD Action Camera', price: 249, category: 'Cameras', rating: 4.5, images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80'] },
    { id: 'mock-5', title: 'Premium Hydro Skincare Serum', price: 45, category: 'Skincare & Makeup', rating: 4.9, images: ['https://images.unsplash.com/photo-1608248597481-496100c8c836?w=500&q=80'] },
    { id: 'mock-6', title: 'Smart Fitness Tracker v4', price: 79, category: 'Smart Watches', rating: 4.4, images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80'] },
  ];

  useEffect(() => {
    const loadAllProducts = async () => {
      try {
        const data = await productService.getProducts();
        if (data.success) {
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error('Failed to load shop products:', err);
        setError('Connection issues loading catalog.');
      } finally {
        setLoading(false);
      }
    };

    loadAllProducts();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center w-full select-none">
        <p className="text-slate-400 font-bold text-xs animate-pulse">Loading catalog items...</p>
      </div>
    );
  }

  const items = products.length > 0 ? products : mockProducts;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full select-none">
      {items.map((product) => {
        const productId = product._id || product.id;
        const productImage = product.images && product.images.length > 0 ? product.images[0] : (product.img || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=300&q=80');

        return (
          <Link 
            to={`/product/${productId}`} 
            key={productId} 
            className="group bg-white border border-slate-200 rounded-lg overflow-hidden transition-all hover:border-slate-350 flex flex-col h-full cursor-pointer block"
          >
            {/* Product Image Wrapper */}
            <div className="w-full aspect-square bg-slate-50 overflow-hidden relative">
              <img 
                src={productImage} 
                alt={product.title} 
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=300&q=80'; }}
              />
            </div>

            {/* Product Info */}
            <div className="p-4 flex flex-col flex-grow justify-between bg-white">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                  {product.category} 
                </span>
                
                <h4 className="font-bold text-xs text-slate-800 line-clamp-2 leading-relaxed mb-3 group-hover:text-slate-950 transition-colors">
                  {product.title} 
                </h4>
              </div>

              {/* Price and Rating */}
              <div className="space-y-3">
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs font-black text-slate-900">
                    ${product.price} 
                  </span>
                  
                  <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold">
                    ★ {product.rating || 5.0} 
                  </div>
                </div>

                {/* Action Call Button */}
                <button 
                  className="w-full bg-slate-900 text-white text-[10px] font-bold py-2 rounded-lg transition-all hover:bg-slate-800 block shadow-sm cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault(); 
                    addToCart(product, 1);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductGrid;