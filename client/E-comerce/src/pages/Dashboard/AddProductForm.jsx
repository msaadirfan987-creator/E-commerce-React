import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import productService from '../../services/productService';

const AddProductForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      category: 'Headphones & Audio',
      featured: false
    }
  });

  const categories = [
    'Headphones & Audio',
    'Jewelry & Watches',
    'Laptops & PCs',
    'Cameras',
    'Skincare & Makeup',
    'Smart Watches'
  ];

  const onSubmit = async (formData) => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Map form fields to backend schema names and parse numeric types
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        brand: formData.brand,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : 0,
        stock: parseInt(formData.stock, 10),
        images: formData.images ? formData.images.split(',').map(url => url.trim()).filter(Boolean) : [],
        featured: !!formData.featured,
        status: 'Active'
      };

      if (payload.discountPrice >= payload.price) {
        setError('Discount price must be less than the regular price.');
        setLoading(false);
        return;
      }

      await productService.createProduct(payload);
      setSuccess('Product registered in database successfully!');
      
      setTimeout(() => {
        setLoading(false);
        navigate('/dashboard/products');
      }, 1500);

    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to submit product details to server.');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto select-none animate-fadeIn">
      
      <Link 
        to="/dashboard/products"
        className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        Back to catalog
      </Link>

      <div className="space-y-0.5">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Create Listing</h2>
        <p className="text-xs text-slate-400 font-bold">List and deploy new items directly to storefront database.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        
        {error && <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold p-3 rounded-lg mb-4">{error}</div>}
        {success && <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold p-3 rounded-lg mb-4">{success}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Product Name</label>
              <input 
                type="text" 
                placeholder="e.g. Pro Wireless Headphones"
                {...register('title', { 
                  required: 'Product Name is required',
                  minLength: { value: 3, message: 'Name must be at least 3 characters' }
                })}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-lg focus:outline-none placeholder-slate-300 text-slate-700"
              />
              {errors.title && <span className="text-rose-500 text-[10px] font-bold mt-1 block">{errors.title.message}</span>}
            </div>

            {/* Brand */}
            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Brand</label>
              <input 
                type="text" 
                placeholder="e.g. Sony"
                {...register('brand', { required: 'Brand is required' })}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-lg focus:outline-none placeholder-slate-300 text-slate-700"
              />
              {errors.brand && <span className="text-rose-500 text-[10px] font-bold mt-1 block">{errors.brand.message}</span>}
            </div>

            {/* Category */}
            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Category</label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-lg focus:outline-none text-slate-700 cursor-pointer"
              >
                {categories.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
              {errors.category && <span className="text-rose-500 text-[10px] font-bold mt-1 block">{errors.category.message}</span>}
            </div>

            {/* Price */}
            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Price ($ USD)</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="e.g. 129.00"
                {...register('price', { 
                  required: 'Price is required',
                  min: { value: 0.01, message: 'Price must be greater than 0' }
                })}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-lg focus:outline-none placeholder-slate-300 text-slate-700"
              />
              {errors.price && <span className="text-rose-500 text-[10px] font-bold mt-1 block">{errors.price.message}</span>}
            </div>

            {/* Discount Price */}
            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Discount Price ($ USD)</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="e.g. 99.00"
                {...register('discountPrice', { 
                  min: { value: 0, message: 'Discount cannot be negative' }
                })}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-lg focus:outline-none placeholder-slate-300 text-slate-700"
              />
              {errors.discountPrice && <span className="text-rose-500 text-[10px] font-bold mt-1 block">{errors.discountPrice.message}</span>}
            </div>

            {/* Stock */}
            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Stock Quantity</label>
              <input 
                type="number" 
                placeholder="e.g. 50"
                {...register('stock', { 
                  required: 'Stock quantity is required',
                  min: { value: 0, message: 'Stock quantity cannot be negative' }
                })}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-lg focus:outline-none placeholder-slate-300 text-slate-700"
              />
              {errors.stock && <span className="text-rose-500 text-[10px] font-bold mt-1 block">{errors.stock.message}</span>}
            </div>

            {/* Image URLs */}
            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Product Images (comma-separated URLs)</label>
              <input 
                type="text" 
                placeholder="URL1, URL2..."
                {...register('images', { required: 'At least one product image URL is required' })}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-lg focus:outline-none placeholder-slate-300 text-slate-700"
              />
              {errors.images && <span className="text-rose-500 text-[10px] font-bold mt-1 block">{errors.images.message}</span>}
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Description</label>
              <textarea 
                rows="3"
                placeholder="Enter detailed description of the item..."
                {...register('description', { 
                  required: 'Description is required',
                  minLength: { value: 10, message: 'Description must be at least 10 characters' }
                })}
                className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-lg focus:outline-none placeholder-slate-300 text-slate-700 leading-relaxed"
              />
              {errors.description && <span className="text-rose-500 text-[10px] font-bold mt-1 block">{errors.description.message}</span>}
            </div>

            {/* Featured */}
            <div className="sm:col-span-2">
              <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-650 cursor-pointer pt-1">
                <input 
                  type="checkbox" 
                  {...register('featured')}
                  className="rounded text-slate-900 border-slate-200 focus:ring-0"
                />
                Feature this product on the store home page
              </label>
            </div>

          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-2">
            <Link 
              to="/dashboard/products"
              className="px-3.5 py-1.5 border border-slate-200 text-slate-500 hover:text-slate-700 font-bold text-xs rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
            
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-sm transition-all disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Listing'}
            </button>
          </div>
        </form>

      </div>

    </div>
  );
};

export default AddProductForm;
