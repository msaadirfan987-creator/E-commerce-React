import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto py-4 px-6 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-semibold text-slate-400 select-none">
      <div>
        © 2026 Cartify Inc. All rights reserved.
      </div>
      
      <div className="flex items-center gap-4">
        <a 
          href="/help" 
          className="hover:text-slate-600 transition-colors"
        >
          Merchant Help Center
        </a>
        <span className="w-1 h-1 rounded-full bg-slate-200" />
        <a 
          href="/api-docs" 
          className="hover:text-slate-600 transition-colors"
        >
          API Reference
        </a>
      </div>
    </footer>
  );
};

export default Footer;
