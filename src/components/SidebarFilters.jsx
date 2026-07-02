import React, { useState } from 'react';

const SidebarFilters = ({ onFilterChange }) => {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(1000);
  const [selectedRating, setSelectedRating] = useState(null);

  // Theme Config
  const theme = {
    deepTwilight: '#03045e',
    brightTealBlue: '#0077b6',
    lightCyan: '#caf0f8',
  };

  const categories = [
    'All',
    'Smartphones', 'Laptops & PCs', 'Smart Watches', 'Headphones & Audio', 'Gaming Consoles', 'Cameras',
    "Men's Clothing", "Women's Clothing", "Kids' Wear", 'Shoes & Sneakers', 'Bags & Luggage', 'Jewelry & Watches',
    'Furniture', 'Home Decor', 'Kitchen Appliances', 'Smart Home Devices', 'Bedding & Linen',
    'Skincare & Makeup', 'Haircare', 'Vitamins & Supps', 'Fitness Equipment', 'Wellness & Personal Care'
  ];

  const ratings = [5, 4, 3, 2];

  // Trigger search / filters action
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Applying complete search filters layout:", {
      searchQuery,
      selectedCategory,
      priceRange,
      selectedRating
    });
    // If you have an onFilterChange function passed from Shop page, fire it here:
    if (onFilterChange) {
      onFilterChange({ searchQuery, selectedCategory, priceRange, selectedRating });
    }
  };

  // Reset all filters
  const handleClearAll = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setPriceRange(1000);
    setSelectedRating(null);
  };

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm h-fit sticky top-24 select-none">
      
      {/* Header section */}
      <div className="flex items-center justify-between border-b pb-4 mb-5 border-slate-100">
        <h3 style={{ color: theme.deepTwilight }} className="font-bold text-base tracking-wide flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          Filters
        </h3>
        <button 
          onClick={handleClearAll}
          style={{ color: theme.brightTealBlue }}
          className="text-xs font-semibold hover:underline transition-all"
        >
          Clear All
        </button>
      </div>

      {/* NEW SECTION: Inline Search Input with Icon Button */}
      <div className="mb-6">
        <h4 style={{ color: theme.deepTwilight }} className="font-bold text-xs uppercase tracking-wider mb-2.5">
          Search Products
        </h4>
        <form onSubmit={handleSearchSubmit} className="relative flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Type keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-3 pr-8 text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#0077b6] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ×
              </button>
            )}
          </div>
          <button
            type="submit"
            style={{ backgroundColor: theme.brightTealBlue }}
            className="p-2 text-white rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-sm flex items-center justify-center shrink-0"
            title="Search with filters"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </button>
        </form>
      </div>

      {/* 1. Category Filter */}
      <div className="mb-6">
        <h4 style={{ color: theme.deepTwilight }} className="font-bold text-xs uppercase tracking-wider mb-3">
          Category ({categories.length - 1})
        </h4>
        <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="w-full text-left text-xs py-2 px-3 rounded-xl font-medium transition-all duration-150 flex items-center justify-between group"
              style={selectedCategory === category ? {
                backgroundColor: theme.lightCyan,
                color: theme.deepTwilight,
                fontWeight: '700'
              } : {
                color: '#475569'
              }}
            >
              <span className="group-hover:translate-x-0.5 transition-transform truncate mr-2">{category}</span>
              {selectedCategory === category && (
                <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: theme.brightTealBlue }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Price Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h4 style={{ color: theme.deepTwilight }} className="font-bold text-xs uppercase tracking-wider">
            Max Price
          </h4>
          <span style={{ color: theme.brightTealBlue }} className="text-xs font-bold bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
            ${priceRange}
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="1000"
          step="10"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[#0077b6] bg-slate-100"
        />
        <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-1.5">
          <span>$10</span>
          <span>$1000</span>
        </div>
      </div>

      {/* 3. Ratings Filter */}
      <div>
        <h4 style={{ color: theme.deepTwilight }} className="font-bold text-xs uppercase tracking-wider mb-3">
          Customer Rating
        </h4>
        <div className="flex flex-col gap-1">
          {ratings.map((stars) => (
            <label 
              key={stars} 
              className="flex items-center gap-2.5 px-1 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name="rating-filter"
                checked={selectedRating === stars}
                onChange={() => setSelectedRating(stars)}
                className="w-3.5 h-3.5 border-slate-300 text-blue-600 focus:ring-blue-500 accent-[#0077b6]"
              />
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={i < stars ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-3.5 h-3.5"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
                <span className="text-xs font-semibold text-slate-500 ml-1">
                  {stars === 5 ? "" : "& Up"}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

    </aside>
  );
};

export default SidebarFilters;