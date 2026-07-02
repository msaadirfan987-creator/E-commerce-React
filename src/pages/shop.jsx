import React from 'react';
import Navbar from '../components/Navbar';
import SidebarFilters from '../components/SidebarFilters';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';

const Shop = () => {
  return (
    <>
      {/* 1. Global Navigation header stays full width */}
     
      
      {/* 2. Main Page Layout Wrapper */}
      <div className="min-h-screen bg-slate-50 mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          
          {/* Main Content Workspace Grid */}
          <div className="flex flex-col lg:flex-row gap-8 items-start relative">
            
            {/* LEFT SIDE: Filters */}
            <div className="w-full lg:w-64 shrink-0 z-10">
              <SidebarFilters />
            </div>

            {/* RIGHT SIDE: Products display ONLY */}
            <div className="flex-1 w-full">
              <ProductGrid />
              {/* Pagination controls would go here */}
            </div>

          </div>

        </div>
      </div>

      {/* 3. FULL WIDTH FOOTER: Moved completely outside the layout container panels */}
      <Footer />
    </>
  );
};

export default Shop;