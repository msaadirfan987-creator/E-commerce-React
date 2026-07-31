import React, { useState, useEffect, useRef } from 'react';

const Categories = () => {
  const [showAll, setShowAll] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const categorySectionRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categorySectionRef.current && !categorySectionRef.current.contains(event.target)) {
        setActiveCategory(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const primaryCategories = [
    { 
      name: 'Electronics', 
      id: 'electronics',
      img: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=150&auto=format&fit=crop&q=60',
      subcategories: ['Headphones', 'Smartphones', 'Laptops', 'Cameras']
    },
    { 
      name: 'Fashion & Apparel', 
      id: 'fashion',
      img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=150&auto=format&fit=crop&q=60',
      subcategories: ["Men's Wear", "Women's Wear", 'Kids Wear', 'Footwear']
    },
    { 
      name: 'Beauty & Cosmetics', 
      id: 'beauty',
      img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=150&auto=format&fit=crop&q=60',
      subcategories: ['Skin Care', 'Makeup Kits', 'Hair Care', 'Fragrances']
    },
    { 
      name: 'Home & Living', 
      id: 'home',
      img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=150&auto=format&fit=crop&q=60',
      subcategories: ['Furniture', 'Decor', 'Lighting', 'Cushions']
    },
    { 
      name: 'Gaming Consoles', 
      id: 'gaming',
      img: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=150&auto=format&fit=crop&q=60',
      subcategories: ['PS5 Gear', 'Xbox Consoles', 'Nintendo', 'Controllers']
    },
    { 
      name: 'Smart Watches', 
      id: 'watches',
      img: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=150&auto=format&fit=crop&q=60',
      subcategories: ['Fitness Bands', 'AMOLED', 'Sports Watches', 'Straps']
    },
    { 
      name: 'Books & Stationery', 
      id: 'books',
      img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=150&auto=format&fit=crop&q=60',
      subcategories: ['Textbooks', 'Notebooks', 'Office Gear', 'Art Supplies']
    },
    { 
      name: 'Sports Equipment', 
      id: 'sports',
      img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=150&auto=format&fit=crop&q=60',
      subcategories: ['Gym & Fitness', 'Cricket/Football', 'Outdoor', 'Athletic']
    },
  ];

  const extraCategories = [
    { 
      name: 'Kitchen Appliances', 
      id: 'kitchen',
      img: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=150&auto=format&fit=crop&q=60',
      subcategories: ['Coffee Makers', 'Blenders', 'Ovens', 'Juicers']
    },
    { 
      name: 'Automotive Accessories', 
      id: 'automotive',
      img: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=150&auto=format&fit=crop&q=60',
      subcategories: ['Car Audio', 'Seat Covers', 'Cleaning Kits', 'Trackers']
    },
    { 
      name: 'Health & Wellness', 
      id: 'health',
      img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150&auto=format&fit=crop&q=60',
      subcategories: ['Massagers', 'Vitamins', 'Medical Supplies', 'Yoga Gear']
    },
    { 
      name: 'Pet Supplies', 
      id: 'pet',
      img: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=150&auto=format&fit=crop&q=60',
      subcategories: ['Dog Food', 'Cat Toys', 'Pet Grooming', 'Aquariums']
    }
  ];

  const handleCategoryToggle = (id) => {
    setActiveCategory(prev => prev === id ? null : id);
  };

  const renderInlineSubbox = (cat) => {
    if (activeCategory !== cat.id) return null;
    return (
      <div className="w-full mt-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-left transition-all">
        <p className="text-[9px] font-bold uppercase tracking-wider mb-2 text-slate-400">Subcategories</p>
        <div className="flex flex-col gap-1">
          {cat.subcategories.map((sub, idx) => (
            <div 
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                alert(`Routing to category: ${sub}`);
              }}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-md bg-white hover:bg-slate-100 border border-slate-200/50 transition-colors cursor-pointer text-slate-700"
            >
              {sub}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section ref={categorySectionRef} className="w-full py-12 bg-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header Block */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-6">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Top Categories
          </h2>
          <button 
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <span>{showAll ? 'Close view' : 'See all'}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              className={`transform transition-transform duration-200 ${showAll ? 'rotate-90 text-rose-500' : ''}`}
            >
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>

        {/* Extended list drawer */}
        <div 
          className={`overflow-hidden transition-all duration-300 ${
            showAll ? 'max-h-[1000px] opacity-100 mb-6' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {extraCategories.map((cat) => (
              <div key={cat.id} className="flex flex-col">
                <div 
                  onClick={() => handleCategoryToggle(cat.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                    activeCategory === cat.id ? 'bg-slate-100 border-slate-300' : 'bg-slate-50 border-slate-200/70 hover:border-slate-300'
                  }`}
                >
                  <img src={cat.img} alt={cat.name} className="w-10 h-10 rounded-md object-cover bg-slate-100 shrink-0" />
                  <span className="text-xs font-semibold text-slate-700 truncate">
                    {cat.name}
                  </span>
                </div>
                {renderInlineSubbox(cat)}
              </div>
            ))}
          </div>
        </div>

        {/* Primary list grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {primaryCategories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <div key={cat.id} className="flex flex-col">
                <div 
                  onClick={() => handleCategoryToggle(cat.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected ? 'bg-slate-100 border-slate-300' : 'bg-slate-50 border-slate-200/70 hover:border-slate-300'
                  }`}
                >
                  <img 
                    src={cat.img} 
                    alt={cat.name} 
                    className="w-10 h-10 rounded-md object-cover bg-slate-100 shrink-0" 
                  />
                  <span className={`text-xs font-semibold truncate ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                    {cat.name}
                  </span>
                </div>
                {renderInlineSubbox(cat)}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Categories;