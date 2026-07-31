import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import Footer from './components/Footer';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/50 flex text-slate-800">
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        mobileOpen={mobileSidebarOpen} 
        closeMobileSidebar={() => setMobileSidebarOpen(false)} 
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Header toolbar */}
        <TopNavbar 
          toggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} 
          sidebarOpen={sidebarOpen} 
        />

        {/* Dynamic Nested Route Content */}
        <main className="flex-grow p-4 sm:p-6 flex flex-col gap-6 md:gap-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Dashboard layout signature footer */}
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
