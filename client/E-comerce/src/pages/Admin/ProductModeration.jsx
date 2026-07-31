import React, { useState, useEffect } from 'react';
import { Search, Eye, EyeOff, Star, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProductModeration = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [visibilityFilter, setVisibilityFilter] = useState('All');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const categories = [
    'All',
    'Headphones & Audio',
    'Jewelry & Watches',
    'Laptops & PCs',
    'Cameras',
    'Skincare & Makeup',
    'Smart Watches'
  ];

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/admin/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setProducts(data.products || []);
      } else {
        setError(data.message || 'Failed to load product listing.');
      }
    } catch (err) {
      setError('Connection issues contacting admin API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  const handleToggleVisibility = async (productId, currentVisibility) => {
    setError('');
    setSuccess('');
    const targetVisibility = currentVisibility === 'Visible' ? 'Hidden' : 'Visible';

    try {
      const response = await fetch(`${API_URL}/api/admin/products/${productId}/visibility`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ visibility: targetVisibility }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess(`Listing visibility changed to ${targetVisibility}.`);
        setTimeout(() => setSuccess(''), 2000);
        
        // Refresh local list state
        setProducts(products.map(p => p._id === productId ? { ...p, visibility: targetVisibility } : p));
      } else {
        alert(data.message || 'Failed to update visibility.');
      }
    } catch (err) {
      alert('Error updating visibility.');
    }
  };

  const handleToggleFeatured = async (productId, currentFeatured) => {
    setError('');
    setSuccess('');
    const targetFeatured = !currentFeatured;

    try {
      const response = await fetch(`${API_URL}/api/admin/products/${productId}/featured`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ featured: targetFeatured }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess('Product featured status toggled.');
        setTimeout(() => setSuccess(''), 2000);
        
        setProducts(products.map(p => p._id === productId ? { ...p, featured: targetFeatured } : p));
      } else {
        alert(data.message || 'Failed to update featured status.');
      }
    } catch (err) {
      alert('Error updating product metrics.');
    }
  };

  const handleDeleteProduct = async (productId, title) => {
    const confirmDelete = window.confirm(`Are you sure you want to permanently delete listing "${title}"? This cannot be undone.`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess('Product listing deleted successfully.');
        setTimeout(() => setSuccess(''), 2000);
        
        setProducts(products.filter(p => p._id !== productId));
      } else {
        alert(data.message || 'Failed to delete product.');
      }
    } catch (err) {
      alert('Error during product deletion.');
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          p.brand.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;

    // Visibility defaults to "Visible" if missing
    const currentVis = p.visibility || 'Visible';
    const matchesVisibility = visibilityFilter === 'All' || currentVis === visibilityFilter;

    return matchesSearch && matchesCategory && matchesVisibility;
  });

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-base font-black text-slate-900 tracking-tight uppercase">Catalog Moderation</h2>
        <p className="text-xs text-slate-400 font-bold">Inspect product catalogs, hide objectionable listings, and promote featured products.</p>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold p-3 rounded-lg animate-fadeIn">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-650 text-xs font-bold p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        
        {/* Search */}
        <div className="w-full sm:max-w-xs flex items-center rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 focus-within:border-slate-400">
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search by title or brand..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-2 text-xs font-semibold bg-transparent focus:outline-none text-slate-700 placeholder-slate-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span className="text-slate-400">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-slate-200 bg-white px-2 py-1 rounded text-slate-650 font-bold focus:outline-none"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span className="text-slate-400">Visibility:</span>
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              className="border border-slate-200 bg-white px-2 py-1 rounded text-slate-650 font-bold focus:outline-none"
            >
              <option value="All">All Visibility</option>
              <option value="Visible">Visible</option>
              <option value="Hidden">Hidden</option>
            </select>
          </div>

        </div>

      </div>

      {/* Catalog grid/table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Product Info</th>
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Seller</th>
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Price</th>
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Visibility</th>
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Featured</th>
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-right">Moderations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-xs font-bold text-slate-400 animate-pulse">
                    Loading platform catalog...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((product) => {
                  const productImage = product.images && product.images.length > 0 ? product.images[0] : '';
                  const visState = product.visibility || 'Visible';

                  return (
                    <tr key={product._id} className="hover:bg-slate-50/30 transition-colors">
                      
                      {/* Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={productImage} 
                            alt={product.title} 
                            className="w-9 h-9 rounded object-cover border border-slate-100 shrink-0"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=100&q=80'; }}
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-800 truncate block max-w-[180px]">{product.title}</span>
                            <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">{product.brand} | {product.category}</span>
                          </div>
                        </div>
                      </td>

                      {/* Seller */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col text-[11px] font-semibold text-slate-650">
                          <span>{product.seller?.fullName || 'Platform'}</span>
                          <span className="text-[8px] text-slate-400">{product.seller?.email}</span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 text-xs font-bold text-slate-900">
                        ${product.price}
                      </td>

                      {/* Visibility status */}
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${
                          visState === 'Visible' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {visState}
                        </span>
                      </td>

                      {/* Featured */}
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${
                          product.featured ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {product.featured ? 'Featured' : 'Standard'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-3 text-xs font-bold">
                          
                          <button
                            onClick={() => handleToggleVisibility(product._id, visState)}
                            className="text-slate-500 hover:text-slate-900 cursor-pointer flex items-center gap-0.5"
                          >
                            {visState === 'Visible' ? (
                              <><EyeOff className="w-3.5 h-3.5" /> Hide</>
                            ) : (
                              <><Eye className="w-3.5 h-3.5" /> Show</>
                            )}
                          </button>

                          <button
                            onClick={() => handleToggleFeatured(product._id, product.featured)}
                            className={`${product.featured ? 'text-amber-600 hover:text-amber-800' : 'text-slate-400 hover:text-slate-700'} cursor-pointer flex items-center gap-0.5`}
                          >
                            <Star className="w-3.5 h-3.5 fill-current" /> Feature
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(product._id, product.title)}
                            className="text-rose-550 hover:text-rose-700 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-xs font-bold text-slate-400">
                    No matching products listed.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ProductModeration;
