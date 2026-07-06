import React, { useState, useEffect, useRef } from 'react';

const Categories = () => {
  const [showAll, setShowAll] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  
  // 1. Ref create kiya hai jo container ko track karega
  const categorySectionRef = useRef(null);

  // Synced exactly with your Navbar / Hero color palette
  const theme = {
    deepTwilight: '#03045e',
    brightTealBlue: '#0077b6',
    turquoiseSurf: '#00b4d8',
    frostedBlue: '#90e0ef',
    lightCyan: '#caf0f8',
    surface: '#ffffff',
    cardBg: '#f8fafc' 
  };

  // 2. useEffect lagaya hai jo click outside event ko handle karega
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Agar click category section ke bahar hua hai, to box band kar do
      if (categorySectionRef.current && !categorySectionRef.current.contains(event.target)) {
        setActiveCategory(null);
      }
    };

    // Event listener attach kiya global document par
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup function takay memory leak na ho
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
      subcategories: ["Men's Wear", "Women's", 'Kids Wear', 'Footwear']
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
      subcategories: ['Furniture', 'Vases & Decor', 'Lighting', 'Cushions']
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
      <div 
        className="w-full mt-2 p-3 rounded-xl bg-slate-50 border border-dashed text-left animate-fadeIn transition-all duration-300"
        style={{ borderColor: theme.frostedBlue }}
      >
        <p className="text-[10px] font-bold uppercase tracking-wider mb-2 text-slate-400">Subcategories:</p>
        <div className="flex flex-col gap-1.5">
          {cat.subcategories.map((sub, idx) => (
            <div 
              key={idx}
              onClick={(e) => {
                e.stopPropagation(); // Event clash handle karne ke liye
                alert(`Routing to: ${sub}`);
              }}
              className="text-xs font-semibold px-2 py-1.5 rounded-lg bg-white hover:bg-cyan-50 border border-slate-100 transition-colors cursor-pointer text-left"
              style={{ color: theme.brightTealBlue }}
            >
              {sub}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    // 3. Yahan humne ref bind kar diya hai main wrapper section par
    <section ref={categorySectionRef} className="w-full py-12 bg-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* --- HEADER BLOCK --- */}
        <div className="flex items-center justify-between border-b pb-4 mb-8" style={{ borderColor: theme.frostedBlue }}>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: theme.deepTwilight }}>
            Top categories
          </h2>
          <button 
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1 text-sm font-semibold transition-all duration-200 group"
            style={{ color: theme.brightTealBlue }}
          >
            <span>{showAll ? 'Close view' : 'See all'}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              className={`transform transition-transform duration-300 ${showAll ? 'rotate-90 text-red-500' : 'group-hover:translate-x-1'}`}
            >
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>

        {/* --- DROPDOWN DRAWER PANEL (EXTRA CATEGORIES) --- */}
        <div 
          className={`overflow-hidden transition-all duration-500 ease-in-out bg-gradient-to-b from-slate-50 to-white rounded-2xl ${
            showAll ? 'max-h-[1500px] opacity-100 mb-8 p-4 sm:p-6 border border-dashed shadow-inner' : 'max-h-0 opacity-0'
          }`}
          style={{ borderColor: theme.frostedBlue }}
        >
          <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: theme.turquoiseSurf }}>
            Extended Collections
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {extraCategories.map((cat) => (
              <div key={cat.id} className="flex flex-col">
                <div 
                  onClick={() => handleCategoryToggle(cat.id)}
                  className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-3 p-3 sm:p-4 rounded-xl transition-all duration-200 cursor-pointer border shadow-sm hover:shadow-md"
                  style={{ 
                    backgroundColor: activeCategory === cat.id ? theme.lightCyan : theme.surface,
                    borderColor: activeCategory === cat.id ? theme.brightTealBlue : 'transparent'
                  }}
                >
                  <img src={cat.img} alt={cat.name} className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0" />
                  <span className="text-xs sm:text-sm font-medium line-clamp-2" style={{ color: theme.deepTwilight }}>
                    {cat.name}
                  </span>
                </div>
                {renderInlineSubbox(cat)}
              </div>
            ))}
          </div>
        </div>

        {/* --- CORE GRID CONTAINER (PRIMARY CATEGORIES) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {primaryCategories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <div key={cat.id} className="flex flex-col">
                <div 
                  onClick={() => handleCategoryToggle(cat.id)}
                  className={`flex flex-col sm:flex-row items-center text-center sm:text-left gap-3 sm:gap-5 p-3 sm:p-5 rounded-xl transition-all duration-300 cursor-pointer border ${
                    isSelected ? 'shadow-md' : 'hover:-translate-y-0.5'
                  }`}
                  style={{ 
                    backgroundColor: isSelected ? theme.lightCyan : theme.cardBg,
                    borderColor: isSelected ? theme.brightTealBlue : 'transparent'
                  }}
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-white shadow-inner p-1 flex items-center justify-center shrink-0">
                    <img 
                      src={cat.img} 
                      alt={cat.name} 
                      className="w-full h-full object-cover rounded-lg transition-transform duration-300" 
                    />
                  </div>
                  
                  <span 
                    className="text-xs sm:text-sm font-semibold tracking-wide transition-colors duration-200 line-clamp-2"
                    style={{ color: isSelected ? theme.brightTealBlue : theme.deepTwilight }}
                  >
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