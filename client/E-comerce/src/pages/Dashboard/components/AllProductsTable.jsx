import React from 'react';
import { Link } from 'react-router-dom';

const AllProductsTable = ({ products, onDelete }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs select-none">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50">
              <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Product Name</th>
              <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Category</th>
              <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Price</th>
              <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Stock Status</th>
              <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Featured</th>
              <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => {
              const isOutOfStock = product.stock <= 0;
              const isLowStock = product.stock > 0 && product.stock <= 10;
              const productImage = product.images && product.images.length > 0 ? product.images[0] : (product.img || '');
              const productId = product._id || product.id;

              return (
                <tr key={productId} className="hover:bg-slate-50/30 transition-colors">
                  {/* Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={productImage} 
                        alt={product.title} 
                        className="w-9 h-9 rounded object-cover border border-slate-100 shrink-0"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=150&q=80'; }}
                      />
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-slate-800 truncate max-w-[180px]">
                          {product.title}
                        </h5>
                        <span className="text-[9px] text-slate-400 font-mono block mt-0.5">
                          ID: {productId}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  {/* Category */}
                  <td className="py-3 px-4 text-xs font-semibold text-slate-500">
                    {product.category}
                  </td>
                  
                  {/* Price */}
                  <td className="py-3 px-4 text-xs font-bold text-slate-900">
                    ${product.price}
                    {product.discountPrice > 0 && (
                      <span className="text-[10px] text-slate-400 line-through pl-1.5">${product.discountPrice}</span>
                    )}
                  </td>
                  
                  {/* Stock */}
                  <td className="py-3 px-4">
                    {isOutOfStock ? (
                      <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-rose-50 text-rose-600">
                        Out of stock
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-600">
                        Low stock ({product.stock})
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700">
                        {product.stock} Units
                      </span>
                    )}
                  </td>
                  
                  {/* Featured */}
                  <td className="py-3 px-4 text-xs font-bold text-slate-600">
                    {product.featured ? (
                      <span className="text-emerald-600 font-bold">Yes</span>
                    ) : (
                      <span className="text-slate-400 font-normal">No</span>
                    )}
                  </td>
                  
                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-3 text-xs font-bold">
                      <Link 
                        to={`/dashboard/products/edit/${productId}`}
                        className="text-slate-500 hover:text-slate-900 transition-colors"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => onDelete(productId)}
                        className="text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllProductsTable;
