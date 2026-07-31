import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import productService from '../../services/productService';

const InventoryManagement = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [tempStock, setTempStock] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const sellerId = user?.id || user?._id;
      if (user && sellerId) {
        const data = await productService.getProducts({ seller: sellerId });
        if (data.success) {
          setProducts(data.products || []);
        }
      }
    } catch (err) {
      setError('Failed to fetch inventory from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [user]);

  const handleStartEdit = (p) => {
    setEditingId(p._id);
    setTempStock(p.stock.toString());
  };

  const handleSaveStock = async (id) => {
    const stockNum = parseInt(tempStock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      alert('Stock quantity must be a non-negative number.');
      return;
    }

    try {
      await productService.updateProduct(id, { stock: stockNum });
      
      setProducts(products.map(p => {
        if (p._id === id) {
          return { ...p, stock: stockNum };
        }
        return p;
      }));
      
      setEditingId(null);
      setSuccess('Stock levels updated successfully.');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update stock.');
    }
  };

  const filtered = products.filter(p => {
    const titleVal = p.title || '';
    return titleVal.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Stock Control</h2>
        <p className="text-xs text-slate-400 font-bold">Monitor warehouse stock quantities and update inventory levels.</p>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold p-3 rounded-lg">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Control panel */}
      <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <input 
          type="text" 
          placeholder="Search items..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-xs px-3 py-1.5 text-xs font-bold border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-lg focus:outline-none placeholder-slate-300 text-slate-700"
        />

        <button 
          onClick={loadProducts}
          className="px-3.5 py-1.5 border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 text-slate-650 hover:text-slate-900 transition-colors text-xs font-bold shrink-0 cursor-pointer"
        >
          Sync Catalog
        </button>
      </div>

      {/* Inventory table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Product Name</th>
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">SKU</th>
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Stock</th>
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-xs font-bold text-slate-400 animate-pulse">
                    Loading inventory records...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((p) => {
                  const isOutOfStock = p.stock <= 0;
                  const isLowStock = p.stock > 0 && p.stock <= 10;
                  const productId = p._id || p.id;
                  
                  return (
                    <tr key={productId} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-3 px-4 text-xs font-bold text-slate-800">
                        {p.title}
                      </td>

                      <td className="py-3 px-4 text-xs font-mono font-semibold text-slate-500">
                        ID: {productId}
                      </td>

                      <td className="py-3 px-4">
                        {editingId === productId ? (
                          <div className="flex items-center gap-1.5">
                            <input 
                              type="number"
                              value={tempStock}
                              onChange={(e) => setTempStock(e.target.value)}
                              className="w-16 px-2 py-1 text-xs font-bold border border-slate-350 rounded focus:outline-none focus:border-slate-500 bg-white"
                            />
                            <button
                              onClick={() => handleSaveStock(productId)}
                              className="px-2 py-1 rounded bg-slate-900 text-white text-[10px] font-bold transition-colors cursor-pointer"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-slate-700">{p.stock} units</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {isOutOfStock ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-rose-50 text-rose-600">
                            Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-600">
                            Low Stock Warning
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-650">
                            Optimal
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right text-xs font-bold">
                        {editingId !== productId && (
                          <button
                            onClick={() => handleStartEdit(p)}
                            className="text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
                          >
                            Modify
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-xs font-bold text-slate-400">
                    No warehouse records found matching query.
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

export default InventoryManagement;
