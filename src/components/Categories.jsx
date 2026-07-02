import React, { useState } from 'react';

const Categories = () => {
  const [showAll, setShowAll] = useState(false);

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

  const primaryCategories = [
    { name: 'Electronics', img: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=150&auto=format&fit=crop&q=60' },
    { name: 'Fashion & Apparel', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=150&auto=format&fit=crop&q=60' },
    { name: 'Beauty & Cosmetics', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=150&auto=format&fit=crop&q=60' },
    { name: 'Home & Living', img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=150&auto=format&fit=crop&q=60' },
    { name: 'Gaming Consoles', img: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=150&auto=format&fit=crop&q=60' },
    { name: 'Smart Watches', img: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=150&auto=format&fit=crop&q=60' },
    { name: 'Books & Stationery', img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=150&auto=format&fit=crop&q=60' },
    { name: 'Sports Equipment', img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=150&auto=format&fit=crop&q=60' },
  ];

  const extraCategories = [
    { name: 'Kitchen Appliances', img: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=150&auto=format&fit=crop&q=60' },
    { name: 'Automotive Accessories', img: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=150&auto=format&fit=crop&q=60' },
    { name: 'Health & Wellness', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150&auto=format&fit=crop&q=60' },
    { name: 'Pet Supplies', img: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=150&auto=format&fit=crop&q=60' },
    { name: 'Fine Jewelry', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=150&auto=format&fit=crop&q=60' },
    { name: 'Groceries & Snacks', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=60' },
    { name: 'Audio & Music', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&auto=format&fit=crop&q=60' },
    { name: 'Cameras & Optics', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=150&auto=format&fit=crop&q=60' }
  ];

  return (
    <section className="w-full py-12 bg-white select-none">
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
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={`transform transition-transform duration-300 ${showAll ? 'rotate-90 text-red-500' : 'group-hover:translate-x-1'}`}
            >
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>

        {/* --- DROPDOWN DRAWER PANEL --- */}
        <div 
          className={`overflow-hidden transition-all duration-500 ease-in-out bg-gradient-to-b from-slate-50 to-white rounded-2xl ${
            showAll ? 'max-h-[1200px] md:max-h-[500px] opacity-100 mb-8 p-4 sm:p-6 border border-dashed shadow-inner' : 'max-h-0 opacity-0'
          }`}
          style={{ borderColor: theme.frostedBlue }}
        >
          <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: theme.turquoiseSurf }}>
            Extended Collections
          </p>
          {/* Fixed layout: 2 columns on mobile, scaling up to 4 columns on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {extraCategories.map((cat, idx) => (
              <div 
                key={idx}
                className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-3 p-3 sm:p-4 rounded-xl transition-all duration-200 cursor-pointer border border-transparent shadow-sm hover:shadow-md"
                style={{ backgroundColor: theme.surface }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.brightTealBlue;
                  e.currentTarget.style.backgroundColor = theme.lightCyan;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.backgroundColor = theme.surface;
                }}
              >
                <img src={cat.img} alt={cat.name} className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0" />
                <span className="text-xs sm:text-sm font-medium transition-colors line-clamp-2" style={{ color: theme.deepTwilight }}>
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* --- CORE GRID CONTAINER --- */}
        {/* Fixed layout: Stays 2 columns on mobile, transforms to 4 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {primaryCategories.map((cat, idx) => (
            <div 
              key={idx}
              className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-3 sm:gap-5 p-3 sm:p-5 rounded-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5"
              style={{ backgroundColor: theme.cardBg }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.surface;
                e.currentTarget.style.boxShadow = `0 10px 25px -5px rgba(3, 4, 94, 0.08)`;
                e.currentTarget.querySelector('span').style.color = theme.brightTealBlue;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.cardBg;
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.querySelector('span').style.color = theme.deepTwilight;
              }}
            >
              {/* Image Container */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-white shadow-inner p-1 flex items-center justify-center shrink-0">
                <img 
                  src={cat.img} 
                  alt={cat.name} 
                  className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-110" 
                />
              </div>
              
              {/* Category Title Text */}
              <span 
                className="text-xs sm:text-sm font-semibold tracking-wide transition-colors duration-200 line-clamp-2"
                style={{ color: theme.deepTwilight }}
              >
                {cat.name}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Categories;