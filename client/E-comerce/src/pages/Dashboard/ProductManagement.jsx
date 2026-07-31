import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, RefreshCcw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import productService from '../../services/productService';
import AllProductsTable from './components/AllProductsTable';

const ProductManagement = () => {
  const { user } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSellerProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const sellerId = user?.id || user?._id;
      if (user && sellerId) {
        // Query products belonging to the logged-in seller
        const data = await productService.getProducts({ seller: sellerId });
        if (data.success) {
          setProducts(data.products || []);
        }
      }
    } catch (err) {
      setError('Failed to fetch your product catalog from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSellerProducts();
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product permanently?')) {
      try {
        await productService.deleteProduct(id);
        setProducts(products.filter(p => p._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete listing.');
      }
    }
  };

  const categories = ['All', ...new Set(products.map(p => p.category))];
  
  const filtered = products.filter(p => {
    const titleVal = p.title || '';
    const matchesSearch = titleVal.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: products.length,
    outOfStock: products.filter(p => p.stock <= 0).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= 10).length,
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Products Catalog</h2>
          <p className="text-xs text-slate-400 font-bold">Catalog indexing metrics.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={loadSellerProducts}
            title="Refresh Catalog"
            className="p-2 rounded-lg border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
          </button>
          
          <Link 
            to="/dashboard/products/add"
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
          >
            Add New Product
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Mini Stats Bar */}
      <div className="grid grid-cols-3 gap-4 w-full">
        <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col justify-between">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Items</span>
          <span className="text-base font-bold text-slate-800 mt-2">{stats.total} SKU</span>
        </div>
        
        <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col justify-between">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Out of Stock</span>
          <span className="text-base font-bold text-rose-600 mt-2">{stats.outOfStock} Items</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col justify-between">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Low Stock</span>
          <span className="text-base font-bold text-amber-600 mt-2">{stats.lowStock} Items</span>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="w-full sm:max-w-xs flex items-center rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1 transition-all focus-within:border-slate-450">
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search catalog..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-2 text-xs font-semibold bg-transparent focus:outline-none text-slate-700 placeholder-slate-400"
          />
        </div>

        {/* Filter */}
        <div className="w-full sm:w-auto flex items-center gap-2 self-start sm:self-auto justify-end">
          <span className="text-xs font-bold text-slate-400">Channel:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-slate-400 cursor-pointer"
          >
            {categories.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Table */}
      {loading ? (
        <div className="py-12 text-center">
          <p className="text-slate-400 font-bold text-xs animate-pulse">Loading catalog indexes...</p>
        </div>
      ) : filtered.length > 0 ? (
        <AllProductsTable products={filtered} onDelete={handleDelete} />
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
          <p className="text-slate-400 font-bold text-xs">No catalog listings found matching selection.</p>
        </div>
      )}

    </div>
  );
};

export default ProductManagement;
