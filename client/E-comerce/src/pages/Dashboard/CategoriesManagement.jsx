import React, { useState } from 'react';

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Headphones & Audio', count: 12, slug: 'headphones-audio', desc: 'Noise cancelling gear, wireless headphones, and speakers.' },
    { id: 2, name: 'Jewelry & Watches', count: 8, slug: 'jewelry-watches', desc: 'Premium chronographs, bracelets, and custom rings.' },
    { id: 3, name: 'Laptops & PCs', count: 15, slug: 'laptops-pcs', desc: 'Mechanical keypads, high performance laptops, and monitors.' },
    { id: 4, name: 'Cameras', count: 6, slug: 'cameras', desc: 'Action cameras, high-definition DSLRs, and lens brackets.' },
    { id: 5, name: 'Skincare & Makeup', count: 18, slug: 'skincare-makeup', desc: 'Hydration serum oils, cosmetic brushes, and foundations.' },
    { id: 6, name: 'Smart Watches', count: 10, slug: 'smart-watches', desc: 'Biometric trackers, step counters, and lifestyle wearables.' }
  ]);

  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newName.trim() || !newDesc.trim()) {
      setError('Please fill in both name and description.');
      return;
    }

    const exists = categories.find(c => c.name.toLowerCase() === newName.toLowerCase().trim());
    if (exists) {
      setError('A category with this name already exists.');
      return;
    }

    const newCat = {
      id: categories.length + 1,
      name: newName.trim(),
      count: 0,
      slug: newName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      desc: newDesc.trim()
    };

    setCategories([...categories, newCat]);
    setNewName('');
    setNewDesc('');
    setSuccess('Category registered successfully.');
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this category?')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Category Configuration</h2>
        <p className="text-xs text-slate-400 font-bold">Classify and organize products.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Register Category Form */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-xs space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Register Category</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Setup new catalog index channel</p>
          </div>

          {error && <div className="bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold p-2.5 rounded-lg">{error}</div>}
          {success && <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold p-2.5 rounded-lg">{success}</div>}

          <form onSubmit={handleAddCategory} className="space-y-3.5">
            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Category Title</label>
              <input 
                type="text"
                placeholder="e.g. Living Room Decor"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-lg focus:outline-none placeholder-slate-300 text-slate-700"
                required
              />
            </div>

            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Description</label>
              <textarea 
                rows="2"
                placeholder="Short index summary..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-lg focus:outline-none placeholder-slate-300 text-slate-700 leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-sm transition-all"
            >
              Add Channel
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2 space-y-4 bg-white border border-slate-200 p-5 rounded-lg shadow-xs">
          <div className="pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Active Channels</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">List of deployed storefront channels</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                className="p-4 border border-slate-200 rounded-lg bg-slate-50/30 flex flex-col justify-between gap-3 relative group"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="inline-block px-2 py-0.5 rounded text-[8px] font-bold bg-slate-200 text-slate-600 uppercase tracking-wider">
                      {cat.count} Listings
                    </span>
                    
                    <button 
                      onClick={() => handleDelete(cat.id)}
                      className="text-[10px] font-bold text-rose-500 hover:text-rose-700 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                  
                  <h5 className="text-xs font-bold text-slate-800">
                    {cat.name}
                  </h5>
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="text-[8px] text-slate-400 font-bold border-t border-slate-100 pt-2 font-mono">
                  slug: {cat.slug}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default CategoriesManagement;
